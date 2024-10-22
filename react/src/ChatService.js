import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

export const ChatService = {
  async getUserData(userId) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      // Create a new user document if it doesn't exist
      await setDoc(userRef, { name: "", chatHistory: [] });
      return { name: "", chatHistory: [] };
    }
  },

  async updateUserName(userId, name) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { name: name });
  },

  async addMessageToHistory(userId, message, isUser) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      chatHistory: arrayUnion({
        content: message,
        isUser: isUser,
        timestamp: new Date(),
      }),
    });
  },

  async getLastConversationSummary(userId) {
    const userData = await this.getUserData(userId);
    const chatHistory = userData.chatHistory;
    if (chatHistory.length > 0) {
      // Get the last 5 messages or all if less than 5
      const lastMessages = chatHistory.slice(-5);
      return lastMessages
        .map((msg) => `${msg.isUser ? "User" : "Bot"}: ${msg.content}`)
        .join("\n");
    }
    return null;
  },
};
