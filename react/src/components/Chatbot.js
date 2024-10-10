import React, { useState, useEffect, useRef } from "react";
import "../assets/ChatBot.css";

export default function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatBoxContentRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatBoxContentRef.current) {
      chatBoxContentRef.current.scrollTop = chatBoxContentRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = async () => {
    if (message.trim() !== "") {
      // Add user message to chat
      setMessages(prevMessages => [...prevMessages, { text: message, sender: 'user' }]);
      setMessage(""); // Clear the input field

      try {
        const response = await fetch('http://localhost:8000/chat/invoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "input": {
              "message": message
            },
            "config": {},
            "kwargs": {}
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Add bot response to chat
        setMessages(prevMessages => [...prevMessages, { text: data.output.content, sender: 'bot' }]);
      } catch (error) {
        console.error('Error:', error);
        // Optionally, add an error message to the chat
        setMessages(prevMessages => [...prevMessages, { text: "Sorry, there was an error processing your request.", sender: 'bot' }]);
      }
    }
  };

  return (
    <div id="chat-widget">
      {!isChatOpen && (
        <button id="chat-button" onClick={toggleChat}>
          Chat with us!
        </button>
      )}

      {isChatOpen && (
        <div id="chat-box">
          <div id="chat-box-header">
            <span>Chat with us!</span>
            <button onClick={toggleChat}>Close</button>
          </div>
          <div id="chat-box-content" ref={chatBoxContentRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}-message`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div id="chat-box-input">
            <input
              type="text"
              id="user-input"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button id="send-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}