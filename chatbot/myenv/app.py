from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from chatbot import generate_response

app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "http://127.0.0.1:5500"}})

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    print("Received request at /chat endpoint")
    data = request.get_json()
    user_input = data['message']
    response = generate_response(user_input)
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)