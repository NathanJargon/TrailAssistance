import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCs5-5xJsLmQQavBmrObJon5-4sUqxFMp8",
  authDomain: "expofront-3d484.firebaseapp.com",
  projectId: "expofront-3d484",
  storageBucket: "expofront-3d484.appspot.com",
  messagingSenderId: "292845955801",
  appId: "1:292845955801:web:f3ad717abd91fa4102ecc8",
  measurementId: "G-5702WYQM03"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

export { auth, db };