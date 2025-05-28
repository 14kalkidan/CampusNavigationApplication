import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging/react-native";

const firebaseConfig = {
    apiKey: "AIzaSyCECQ0LpJJboELiKqicqvliJEtTsqPBV1I",
    authDomain: "notification-c3750.firebaseapp.com",
    projectId: "notification-c3750",
    storageBucket: "notification-c3750.firebasestorage.app",
    messagingSenderId: "831382274759",
    appId: "1:831382274759:web:6b63068fad01392bd5b4e2",
    measurementId: "G-916V5BGXG0"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const messaging = getMessaging(app);