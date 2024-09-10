from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from langchain.prompts import ChatPromptTemplate
from fastapi.middleware.cors import CORSMiddleware
from langchain.chat_models import ChatOpenAI
from langserve import add_routes


app = FastAPI(
    title = "Mental Health Chatbot",
    version = "0.1",
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

@app.get("/")
async def redirect_root_to_docs():
    return RedirectResponse("/docs")

model = ChatOpenAI(model = "gpt-3.5-turbo-1106", openai_api_key = "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")
prompt = ChatPromptTemplate.from_template("Pretend you are a mental health professional who can only answer mental health related inquires. Using 2-3 sentences, give advice based on the following input: {message}")

add_routes(
    app,
    prompt | model,
    path="/chat"
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
