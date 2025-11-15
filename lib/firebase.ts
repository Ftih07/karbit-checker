import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Prevent double init
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();

// MICROSOFT SIGN-IN
export const microsoftProvider = new OAuthProvider("microsoft.com");
microsoftProvider.setCustomParameters({
  prompt: "consent",
});
microsoftProvider.addScope("email");
microsoftProvider.addScope("openid");
microsoftProvider.addScope("profile");

// GITHUB SIGN-IN
export const githubProvider = new GithubAuthProvider();
githubProvider.addScope("user:email");

// FACEBOOK SIGN-IN
export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("public_profile");
facebookProvider.addScope("email");

// TWITTER SIGN-IN
export const twitterProvider = new TwitterAuthProvider();

// YAHOO SIGN-IN
export const yahooProvider = new OAuthProvider("yahoo.com");
yahooProvider.addScope("email");
yahooProvider.addScope("profile");
yahooProvider.addScope("openid");

export default app;
