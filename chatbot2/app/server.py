import os
from dotenv import load_dotenv
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from langchain.prompts import ChatPromptTemplate
from langchain.chat_models import ChatOpenAI
from app.train import trainingString 
from app.config import OPENAI_API_KEY, GOOGLE_API_KEY, GOOGLE_CSE_ID
from langchain_core.tools import Tool
from langchain_google_community import GoogleSearchAPIWrapper
import firebase_admin
from firebase_admin import credentials, firestore, auth
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Get the directory containing the current file
current_dir = Path(__file__).parent.absolute()

# Load the .env file from the same directory as this script
env_path = current_dir / 'secure.env'
if not env_path.exists():
    raise FileNotFoundError(f"Please create a .env file at {env_path}")

load_dotenv(env_path)

def get_required_env_var(var_name: str) -> str:
    value = os.getenv(var_name)
    if value is None:
        raise ValueError(f"Environment variable {var_name} is not set in {env_path}")
    return value

# Pydantic models for request validation
class ChatRequest(BaseModel):
    message: str

class UpdateNameRequest(BaseModel):
    name: str

app = FastAPI(
    title="Mental Health Chatbot",
    version="2.0",
    description="Mental health chatbot that gives only mental health advice."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Initialize Firebase credentials
try:
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": get_required_env_var("FIREBASE_PROJECT_ID"),
        "private_key_id": get_required_env_var("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": get_required_env_var("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
        "client_email": get_required_env_var("FIREBASE_CLIENT_EMAIL"),
        "client_id": get_required_env_var("FIREBASE_CLIENT_ID"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": get_required_env_var("FIREBASE_CLIENT_CERT_URL")
    })
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Error initializing Firebase: {str(e)}")
    raise

model = ChatOpenAI(model="gpt-4o", openai_api_key=OPENAI_API_KEY, temperature=1.0, max_tokens=400)
prompt = ChatPromptTemplate.from_template(trainingString + "{message}")

# Set up Google Search with metadata
search = GoogleSearchAPIWrapper(
    google_api_key=GOOGLE_API_KEY,
    google_cse_id=GOOGLE_CSE_ID,
    k=1
)

def get_search_result(query: str) -> dict:
    try:
        raw_results = search.results(query, num_results=1)
        if raw_results and len(raw_results) > 0:
            result = raw_results[0]
            return {
                'title': result.get('title', ''),
                'link': result.get('link', ''),
                'snippet': result.get('snippet', '')
            }
    except Exception as e:
        print(f"Error in search: {str(e)}")
    return None

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = auth.verify_id_token(credentials.credentials)
        return decoded_token['uid']
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def check_crisis(message: str) -> str:
    crisis = ["suicide", "kill myself", "I want to die", "end my life", "harm myself", "kill"]
    if any(keyword in message.lower() for keyword in crisis):
        return """Your response contains words that have been flagged as concerning. If you're in dire need of help, please contact any of these emergency services down below:
        - Emergency: 911
        - National Suicide Prevention Lifeline: 1-800-273-8255
        - Crisis Text Line: Text HOME to 741741
        
        Help is available 24/7."""
    return ""

def Resource(message: str) -> bool:
    info = [
        "resource", "link", "website", "more information", 
        "where can I find", "help me find", "looking for",
        "need information", "can you recommend"
    ]
    return any(keyword in message.lower() for keyword in info)

async def generate_conversation_summary(messages):
    try:
        conversation_text = "\n".join([
            f"{'User' if msg['isUser'] else 'Assistant'}: {msg['content']}" 
            for msg in messages
        ])
        
        summary_prompt = ChatPromptTemplate.from_template(
            "Create a natural summary that starts exactly with 'In our last conversation' and "
            "describes the interaction in 2-3 sentences. Focus on the main concerns discussed "
            "and support provided. Be empathetic and natural. The summary should seamlessly "
            "continue after 'In our last conversation' and must be cohesive.\n\n"
            "{conversation}"
        )
        
        summary_chain = summary_prompt | model
        summary_response = await summary_chain.ainvoke({"conversation": conversation_text})
        summary = summary_response.content if hasattr(summary_response, 'content') else str(summary_response)
        
        # Ensure the summary starts with "In our last conversation"
        if not summary.startswith("In our last conversation"):
            summary = "In our last conversation " + summary
            
        return summary
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        return None

@app.post("/chat/authenticated")
async def chat(request: ChatRequest, user_id: str = Depends(verify_token)):
    message = request.message
    crisis_response = check_crisis(message)
    if crisis_response:
        return {"response": crisis_response}

    user_ref = db.collection('users').document(user_id)
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        welcome_message = "Welcome to our mental health chatbot! I'm here to provide support and information about mental health. How can I assist you today?"
        user_ref.set({
            'name': '', 
            'chatHistory': [],
            'created_at': firestore.SERVER_TIMESTAMP
        })
        return {"response": welcome_message, "isNewUser": True}

    # Get model response
    chain = prompt | model
    response = await chain.ainvoke({"message": message})
    bot_response = response.content if hasattr(response, 'content') else str(response)
    
    # Add resource information 
    if Resource(message):
        search_query = f"mental health resources {message}"
        try:
            result = get_search_result(search_query)
            if result:
                resource_info = f'\n\nHere\'s a helpful resource: [{result["title"]}]({result["link"]})'
                bot_response += resource_info
        except Exception as e:
            pass

    # Create new messages
    new_messages = [
        {'content': message, 'isUser': True},
        {'content': bot_response, 'isUser': False}
    ]

    # Making sure to update chat history and generate summary
    user_data = user_doc.to_dict()
    current_history = user_data.get('chatHistory', [])
    updated_history = current_history + new_messages
    
    try:
        # Generating summary from the last few messages
        last_messages = updated_history[-5:]
        summary = await generate_conversation_summary(last_messages)
        
        # Updating Firestore with new history and summary
        user_ref.update({
            'chatHistory': updated_history,
            'last_interaction': firestore.SERVER_TIMESTAMP,
            'last_conversation_summary': summary
        })
    except Exception as e:
        print(f"Error updating chat history: {str(e)}")
        user_ref.update({
            'chatHistory': updated_history,
            'last_interaction': firestore.SERVER_TIMESTAMP
        })

    return {"response": bot_response, "isNewUser": False}

@app.post("/chat/unauthenticated")
async def chat_invoke(request: dict):
    message = request['input']['message']
    crisis_response = check_crisis(message)
    if crisis_response:
        return {"output": {"content": crisis_response}}

    chain = prompt | model
    response = await chain.ainvoke({"message": message})
    bot_response = response.content if hasattr(response, 'content') else str(response)
    
    if Resource(message):
        search_query = f"mental health resources {message}"
        try:
            result = get_search_result(search_query)
            if result:
                resource_info = f'\n\nHere\'s a helpful resource: [{result["title"]}]({result["link"]})'
                bot_response += resource_info
        except Exception as e:
            pass

    return {"output": {"content": bot_response}}

@app.post("/update_user_name")
async def update_user_name(request: UpdateNameRequest, user_id: str = Depends(verify_token)):
    user_ref = db.collection('users').document(user_id)
    user_ref.update({
        'name': request.name,
        'updated_at': firestore.SERVER_TIMESTAMP
    })
    return {"status": "success"}

@app.get("/user_info")
async def get_user_info(user_id: str = Depends(verify_token)):
    user_ref = db.collection('users').document(user_id)
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        return {
            "is_new_user": True,
            "name": "",
            "last_conversation_summary": None
        }
    
    user_data = user_doc.to_dict()
    last_conversation_summary = user_data.get('last_conversation_summary')
    
    if not last_conversation_summary and user_data.get('chatHistory'):
        try:
            last_messages = user_data['chatHistory'][-5:]
            last_conversation_summary = await generate_conversation_summary(last_messages)
            if last_conversation_summary:
                user_ref.update({
                    'last_conversation_summary': last_conversation_summary
                })
        except Exception as e:
            print(f"Error generating summary: {str(e)}")
            last_conversation_summary = None
    
    # Formatting the response with greeting and closing
    if last_conversation_summary:
        formatted_summary = f"Hello! {last_conversation_summary}\n\nHow can I assist you today?"
    else:
        formatted_summary = "Hello! How can I assist you today?"
    
    return {
        "is_new_user": False,
        "name": user_data.get('name', ''),
        "last_conversation_summary": formatted_summary
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)