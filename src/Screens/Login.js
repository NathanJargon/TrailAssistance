import React, { useState } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../Config/FirebaseConfig';
import bcrypt from 'bcryptjs';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const q = query(collection(db, 'Students'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          alert('No user found with this email.');
          return;
        }
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const isPasswordValid = bcrypt.compareSync(password, userData.password_hash);
          if (isPasswordValid) {
            alert('Login successful!');
          } else {
            alert('Invalid password.');
          }
        });
      } catch (error) {
        console.error('Error logging in: ', error);
      }
    };
  
    return (
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    );
  };
  
  export default Login;