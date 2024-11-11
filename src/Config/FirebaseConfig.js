// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCs5-5xJsLmQQavBmrObJon5-4sUqxFMp8",
  authDomain: "expofront-3d484.firebaseapp.com",
  projectId: "expofront-3d484",
  storageBucket: "expofront-3d484.firebasestorage.app",
  messagingSenderId: "292845955801",
  appId: "1:292845955801:web:f3ad717abd91fa4102ecc8",
  measurementId: "G-5702WYQM03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);