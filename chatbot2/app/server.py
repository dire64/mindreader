from fastapi import FastAPI
from langchain.prompts import ChatPromptTemplate
from fastapi.middleware.cors import CORSMiddleware
from langchain.chat_models import ChatOpenAI
from langserve import add_routes
from app.train import trainingString 
from app.config import OPENAI_API_KEY


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

model = ChatOpenAI(model = "gpt-3.5-turbo-1106", openai_api_key = OPENAI_API_KEY, temperature = 1.0, max_tokens = 100)
prompt = ChatPromptTemplate.from_template(trainingString + "{message}")

# This is a function to check for any keywords that involves with a crisis
def check_crisis(message: str) -> str:
    crisis = ["suicide", "kill myself", "I want to die", "end my life", "harm myself", "kill"]
    if any(keyword in message.lower() for keyword in crisis):
        return """ Your response contains words that have been flagged as concerning. If you're in dire need of help, please contact any of these emergency services down below:
        - Emergency: 911
        - National Suicide Prevention Lifeline: 1-800-273-8255
        - Crisis Text Line: Text HOME to 741741
        
        Help is available 24/7."""
    return ""

# Modify the chat route to include crisis function
@app.post("/chat")
async def chat(message: str):
    response = check_crisis(message)
    if response:
        return {"response": response}
    
    # If its not a crisis, proceed with the normal chatbot response
    chain = prompt | model
    response = await chain.ainvoke({"message": message})
    return response

add_routes(
    app,
    prompt | model,
    path="/chat"
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
