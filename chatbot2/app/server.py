from fastapi import FastAPI
from langchain.prompts import ChatPromptTemplate
from fastapi.middleware.cors import CORSMiddleware
from langchain.chat_models import ChatOpenAI
from langserve import add_routes

trainingString = """Pretend you are a mental health professional who 
    answers mental health related inquires act as human as possible. 
    Using 2-3 sentences, give advice based on the following input if you are unable 
    to provide adequite help, refer users to our website it has many resources to book an 
    appointment with a therapist or the forum to talk to other people who can help 
    with mental health. Always remember,
    
    1. Provide general information and support about mental health and never medical advice.
    2. Encourage our users to seek professional help for serious concerns.
    3. To offer resources straight from the Mindreader website, including the booking and forum sites
    4. Be aware of crisis 'keywords' and provide appropriate emergency resources.
    
    Here are some topics that you should know about:
    -Common mental health disorders
    -How to cope with stress and anxiety
    -The importance of sleep, diet and exercising 
    -When to seek professional help and where to get it.
    -Crisis and suicide prevention
    -Self-care techniques

    Now, please respond to the following input: """

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

model = ChatOpenAI(model = "gpt-3.5-turbo-1106", openai_api_key = "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", temperature = 1.0, max_tokens = 100)
prompt = ChatPromptTemplate.from_template(trainingString + "{message}")

# This is a function to check for any keywords that involves with a crisis
def check_crisis(message: str) -> str:
    crisis = ["suicide", "kill myself", "I want to die", "end my life", "harm myself", "kill"]
    if any(keyword in message.lower() for keyword in crisis):
        return """ This appears to be a crisis situation. Please contact emergency services immediately:
        - Emergency: 911
        - National Suicide Prevention Lifeline: 1-800-273-8255
        - Crisis Text Line: Text HOME to 741741
        
        Remember, you're not alone, and help is available 24/7. Your life matters."""
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
