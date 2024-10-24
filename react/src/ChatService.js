import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

export const ChatService = {
  async getUserData(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        // Create a new user document if it doesn't exist
        const newUserData = { 
          name: "", 
          chatHistory: [],
          created_at: serverTimestamp()
        };
        await setDoc(userRef, newUserData);
        return newUserData;
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      throw error;
    }
  },

  async updateUserName(userId, name) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { 
        name: name,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating user name:", error);
      throw error;
    }
  },

  async addMessageToHistory(userId, message, isUser) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        chatHistory: arrayUnion({
          content: message,
          isUser: isUser,
          timestamp: serverTimestamp()
        }),
        last_interaction: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding message to history:", error);
      throw error;
    }
  },

  async getLastConversationSummary(userId) {
    try {
      const userData = await this.getUserData(userId);
      
      // If there's already a generated summary, use it
      if (userData.last_conversation_summary) {
        return userData.last_conversation_summary;
      }
      
      const chatHistory = userData.chatHistory;
      if (!chatHistory || chatHistory.length === 0) {
        return null;
      }

      // Get the last 5 messages
      const lastMessages = chatHistory.slice(-5);
      const summaryText = lastMessages
        .map((msg) => `${msg.isUser ? "User" : "Bot"}: ${msg.content}`)
        .join("\n");

      // Update the user document with the new summary
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        last_conversation_summary: summaryText
      });

      return summaryText;
    } catch (error) {
      console.error("Error getting conversation summary:", error);
      return null;
    }
  },

  async clearChatHistory(userId) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        chatHistory: [],
        last_conversation_summary: null,
        last_interaction: serverTimestamp()
      });
    } catch (error) {
      console.error("Error clearing chat history:", error);
      throw error;
    }
  }
};