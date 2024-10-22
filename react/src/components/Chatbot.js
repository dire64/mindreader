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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatBoxContentRef = useRef(null);

  useEffect(() => {
    if (chatBoxContentRef.current) {
      chatBoxContentRef.current.scrollTop = chatBoxContentRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      try {
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
      } catch (error) {
        setError("Error loading user data");
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setError(null);
    }
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    try {
      setIsLoading(true);
      setError(null);

      const userMessage = { text: message, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setMessage("");

      let response;
      if (user) {
        const token = await user.getIdToken();
        response = await fetch("http://localhost:8000/chat/authenticated", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage.text,
          }),
        });
      } else {
        response = await fetch("http://localhost:8000/chat/unauthenticated", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: {
              message: userMessage.text,
            },
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
        await ChatService.addMessageToHistory(user.uid, userMessage.text, true);
        await ChatService.addMessageToHistory(user.uid, botResponse, false);
      }

    } catch (error) {
      setError("Failed to send message. Please try again.");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, there was an error processing your request. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
              <div
                key={index}
                className={`chat-message ${msg.sender}-message`}
                style={{
                  opacity: msg.sending ? 0.7 : 1,
                }}
              >
                {msg.text}
              </div>
            ))}

            {isLoading && (
              <div className="chat-message bot-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
          </div>

          <div id="chat-box-input">
            <textarea
              id="user-input"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              rows="1"
              style={{ resize: "none" }}
            />
            <button
              id="send-button"
              onClick={sendMessage}
              disabled={isLoading || message.trim() === ""}
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}