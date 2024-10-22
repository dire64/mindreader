import React, { useState, useEffect, useRef } from "react";
import "../assets/ChatBot.css";
import { auth } from "../firebase";
import { ChatService } from "../ChatService";

export default function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [initialMessage, setInitialMessage] = useState("");
  const chatBoxContentRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatBoxContentRef.current) {
      chatBoxContentRef.current.scrollTop =
        chatBoxContentRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userData = await ChatService.getUserData(currentUser.uid);
        const lastSummary = await ChatService.getLastConversationSummary(
          currentUser.uid
        );
        if (lastSummary) {
          setInitialMessage(
            `Welcome back! Here's a summary of our last conversation:\n${lastSummary}\n\nHow can I help you today?`
          );
        } else {
          setInitialMessage("Welcome! How can I assist you today?");
        }
      } else {
        setUser(null);
        setInitialMessage(
          "Welcome to our mental health chatbot! How can I assist you today?"
        );
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = async () => {
    if (message.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "user" },
      ]);
      setMessage("");

      try {
        let response;
        if (user) {
          const token = await user.getIdToken();
          response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message: message }),
          });
        } else {
          response = await fetch("http://localhost:8000/chat/invoke", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              input: {
                message: message,
              },
              config: {},
              kwargs: {},
            }),
          });
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const botResponse = user ? data.response : data.output.content;

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botResponse, sender: "bot" },
        ]);

        if (user) {
          await ChatService.addMessageToHistory(user.uid, message, true);
          await ChatService.addMessageToHistory(user.uid, botResponse, false);
        }
      } catch (error) {
        console.error("Error:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, there was an error processing your request.",
            sender: "bot",
          },
        ]);
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
            {initialMessage && (
              <div className="chat-message bot-message">{initialMessage}</div>
            )}
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
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
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
