import React, { useState } from "react";
import "../assets/ChatBot.css";

export default function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      setMessages([...messages, message]);
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div id="chat-widget">
      {/* Only show the chat button if chat is closed */}
      {!isChatOpen && (
        <button id="chat-button" onClick={toggleChat}>
          Chat with us!
        </button>
      )}

      {/* Chat Box */}
      {isChatOpen && (
        <div id="chat-box">
          <div id="chat-box-header">
            <span>Chat with us!</span>
            <button onClick={toggleChat}>Close</button>
          </div>
          <div id="chat-box-content">
            {/* Display chat messages */}
            {messages.map((msg, index) => (
              <div key={index} className="chat-message">
                {msg}
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
