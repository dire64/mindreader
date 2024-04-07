from flask import Flask, request, jsonify, render_template
from chatbot import generate_response

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data['message']
    response = generate_response(user_input)
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)