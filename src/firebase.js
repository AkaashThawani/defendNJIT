// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsqAvIs7gv5wYpQcOk48XQtr20okyhY4I",
  authDomain: "defendnjit.firebaseapp.com",
  projectId: "defendnjit",
  storageBucket: "defendnjit.appspot.com",
  messagingSenderId: "515839902781",
  appId: "1:515839902781:web:dbd786809621d260565654",
  measurementId: "G-CN6TZHG84W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);