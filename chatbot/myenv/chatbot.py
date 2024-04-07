from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ChatMessageHistory
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from pydantic import BaseModel, Field

# This will load related mental health content from websites related to Mental Health
urls = [
    "https://www.nimh.nih.gov/health/topics/index.shtml",
    "https://www.psychologytoday.com/us",
    "https://www.mentalhealth.gov/basics/what-is-mental-health",
]

docs = []
for url in urls:
    loader = WebBaseLoader(url)
    data = loader.load()
    docs.extend(data)

# This will help split loaded documents into smaller chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
all_splits = text_splitter.split_documents(docs)

# We will have to initialize the brain of the chatbot
chat = ChatOpenAI(model="gpt-3.5-turbo-1106", temperature=0.2, openai_api_key="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")
# Next we will have to embed and store the chunks in a vector database
vectorstore = Chroma.from_documents(documents=all_splits, embedding=OpenAIEmbeddings(openai_api_key="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"))

# After that we will create a retriever from the initialized vectorstore
retriever = vectorstore.as_retriever(k=4)

# Next we will define the response schema
class MentalHealthResponse(BaseModel):
    advice: str = Field(description="Supportive advice or information related to the user's question")
    resources: list[str] = Field(description="Relevant resources or links for further information")

# Next we will create a prompt template
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful mental health assistant. Answer questions to the best of your ability using the information provided, focusing on being supportive and avoiding potential biases. Provide your response in the specified JSON format.",
        ),
        MessagesPlaceholder(variable_name="messages"),
    ],
)

# We can then create a chain by piping the prompt into the model
chain = prompt | chat

# Initializing message history will help keep track of the interaction
message_history = ChatMessageHistory()

def generate_response(user_input):
    # This will add the user messae to the message history
    message_history.add_user_message(user_input)
    
    # This will help retrieve relevant documents based on user input
    docs = retriever.get_relevant_documents(user_input)

    # This part will prepare the messages with retrieved documents
    messages = message_history.messages + [HumanMessage(content=doc.page_content) for doc in docs]

    # It will generate a response by usingg the chain
    response = chain.apply(
        messages=[HumanMessage(content=user_input)],
        input_documents=docs
    )

    # Parsing the response using the MentalHealthResponse model
    parsed_response = MentalHealthResponse.parse_raw(response.content)

    # Add AI response to history
    message_history.add_ai_message(parsed_response.json())

    return {
        "advice": parsed_response.advice,
        "resources": parsed_response.resources
    }