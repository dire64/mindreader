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
    with mental health: """

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

add_routes(
    app,
    prompt | model,
    path="/chat"
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)