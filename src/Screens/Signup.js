import React, { useState } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../Config/FirebaseConfig';
import bcrypt from 'bcryptjs';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentType, setStudentType] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const passwordHash = bcrypt.hashSync(password, 10);
    try {
      await addDoc(collection(db, 'Students'), {
        name,
        email,
        password_hash: passwordHash,
        student_type: studentType,
        created_at: new Date(),
        updated_at: new Date()
      });
      alert('User signed up successfully!');
    } catch (error) {
      console.error('Error signing up: ', error);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="text" placeholder="Student Type" value={studentType} onChange={(e) => setStudentType(e.target.value)} required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;