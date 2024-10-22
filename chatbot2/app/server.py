import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from langchain.prompts import ChatPromptTemplate
from langchain.chat_models import ChatOpenAI
from langserve import add_routes
from app.train import trainingString 
from app.config import OPENAI_API_KEY, GOOGLE_API_KEY, GOOGLE_CSE_ID
from langchain_core.tools import Tool
from langchain_google_community import GoogleSearchAPIWrapper
import random
import firebase_admin
from firebase_admin import credentials, firestore, auth

# Load environment variables
load_dotenv()

app = FastAPI(
    title = "Mental Health Chatbot",
    version = "2.0",
    description = "Mental health chatbot that gives only mental health advice."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Initialize Firebase Admin SDK using environment variables
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL")
})

firebase_admin.initialize_app(cred)
db = firestore.client()

model = ChatOpenAI(model = "gpt-3.5-turbo-1106", openai_api_key = OPENAI_API_KEY, temperature = 1.0, max_tokens = 400)
prompt = ChatPromptTemplate.from_template(trainingString + "{message}")

# Set up Google Search
search = GoogleSearchAPIWrapper(google_api_key=GOOGLE_API_KEY, google_cse_id=GOOGLE_CSE_ID)
search_tool = Tool(
    name="Google Search",
    description="Search Google for results on mental health.",
    func=search.run
)

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = auth.verify_id_token(credentials.credentials)
        return decoded_token['uid']
    except:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def check_crisis(message: str) -> str:
    crisis = ["suicide", "kill myself", "I want to die", "end my life", "harm myself", "kill"]
    if any(keyword in message.lower() for keyword in crisis):
        return """ Your response contains words that have been flagged as concerning. If you're in dire need of help, please contact any of these emergency services down below:
        - Emergency: 911
        - National Suicide Prevention Lifeline: 1-800-273-8255
        - Crisis Text Line: Text HOME to 741741
        
        Help is available 24/7."""
    return ""

def Resource(message: str) -> bool:
    info = ["resource", "link", "website", "more information", "where can I find"]
    if any(keyword in message.lower() for keyword in info):
        return True
    if random.random() < 0.5:
        return True
    return False

@app.post("/chat")
async def chat(message: str, user_id: str = Depends(verify_token)):
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
    
    user_data = user_doc.to_dict()
    
    if user_data.get('chatHistory'):
        last_messages = user_data['chatHistory'][-5:]
        summary = "Based on our last conversation:\n" + "\n".join([f"{'You' if msg['isUser'] else 'Bot'}: {msg['content']}" for msg in last_messages])
        intro = f"Welcome back! {summary}\nHow can I help you further today?"
    else:
        intro = "Welcome back! How can I assist you today?"

    chain = prompt | model
    response = await chain.ainvoke({"message": message})
    
    # Update chat history in Firestore
    new_messages = [
        {'content': message, 'isUser': True, 'timestamp': firestore.SERVER_TIMESTAMP},
        {'content': response['content'], 'isUser': False, 'timestamp': firestore.SERVER_TIMESTAMP}
    ]
    
    user_ref.update({
        'chatHistory': firestore.ArrayUnion(new_messages),
        'last_interaction': firestore.SERVER_TIMESTAMP
    })
    
    if Resource(message):
        search_query = f"mental health resources for {message}"
        search_result = search_tool.run(search_query)
        resource_info = f"\n\nHere's a helpful resource: {search_result}"
        response['content'] += resource_info

    return {"response": intro + "\n\n" + response['content'], "isNewUser": False}

@app.post("/chat/invoke")
async def chat_invoke(request: dict):
    message = request['input']['message']
    crisis_response = check_crisis(message)
    if crisis_response:
        return {"output": {"content": crisis_response}}

    chain = prompt | model
    response = await chain.ainvoke({"message": message})
    
    if Resource(message):
        search_query = f"mental health resources for {message}"
        search_result = search_tool.run(search_query)
        resource_info = f"\n\nHere's a helpful resource: {search_result}"
        response['content'] += resource_info

    return {"output": response}

@app.post("/update_user_name")
async def update_user_name(name: str, user_id: str = Depends(verify_token)):
    user_ref = db.collection('users').document(user_id)
    user_ref.update({
        'name': name,
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
    last_conversation_summary = None
    
    if user_data.get('chatHistory'):
        last_messages = user_data['chatHistory'][-5:]
        last_conversation_summary = "\n".join([f"{'You' if msg['isUser'] else 'Bot'}: {msg['content']}" for msg in last_messages])
    
    return {
        "is_new_user": False,
        "name": user_data.get('name', ''),
        "last_conversation_summary": last_conversation_summary
    }

add_routes(
    app,
    prompt | model,
    path="/chat"
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)