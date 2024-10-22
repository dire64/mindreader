// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChLYlTA4L9B1nZ-eXCODPMqjFlHVb1GLs",
  authDomain: "login-bf0d1.firebaseapp.com",
  projectId: "login-bf0d1",
  storageBucket: "login-bf0d1.appspot.com",
  messagingSenderId: "1074137988897",
  appId: "1:1074137988897:web:5234bdf323f38b72fcc860",
  measurementId: "G-GH22704L57",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export const db = getFirestore(app);
