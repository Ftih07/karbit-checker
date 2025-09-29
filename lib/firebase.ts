// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// config dari Firebase Console (pakai .env di production)
const firebaseConfig = {
  apiKey: "AIzaSyAyPWufGnpUuvyqerHoK_G9jD2aJc1rqfQ",
  authDomain: "karbit-checker.firebaseapp.com",
  projectId: "karbit-checker",
  storageBucket: "karbit-checker.firebasestorage.app",
  messagingSenderId: "323862676409",
  appId: "1:323862676409:web:ebdf58676f1e0cc03c2c68",
  measurementId: "G-WL0JL5RK7C"
};

// Supaya gak double init di Next.js (karena hot reload bisa re-init)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore instance
export const db = getFirestore(app);
