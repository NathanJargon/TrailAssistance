import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import the initialized Firestore instance
import './styles/Signup.css';
import next from '../assets/next.png';
import emailIcon from '../assets/email.png';
import padlock from '../assets/padlock.png';
import nameIcon from '../assets/name.png';
import roleIcon from '../assets/role.png';
import logo from '../assets/ustplogo.png';

const SignUp = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Log the Firestore instance
      console.log('Firestore instance:', db);

      // Log the email and other details
      console.log('Email:', email);
      console.log('Role:', role);
      console.log('Name:', name);
      console.log('Password:', password);

      const userDoc = doc(db, 'visitors', email);
      console.log('Document reference:', userDoc);

      await setDoc(userDoc, {
        role,
        name,
        email,
        password,
      });
      alert('Sign up successful!');
      // Clear the form fields
      setRole('');
      setName('');
      setEmail('');
      setPassword('');
      // Redirect to the dashboard
      navigate('/login');
    } catch (error) {
      console.error('Error signing up: ', error);
      alert('Sign up failed. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <header className="login-header">
        <img src={logo} alt="USTP Logo" className="signup-logo" />
      </header>
      <form onSubmit={handleSignUp} className="signup-form">
        <h2>Create your account</h2>
        <hr/>
        <div className="input-group">
          <img src={nameIcon} alt="Name Icon" className="icon" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
          />
        </div>
        <div className="input-group">
          <img src={emailIcon} alt="Email Icon" className="icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
          />
        </div>
        <div className="input-group">
          <img src={roleIcon} alt="Role Icon" className="icon" />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>Select Role</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
            <option value="alumni">Alumni</option>
            <option value="exchange">Exchange</option>
            <option value="non-degree">Non-Degree</option>
            <option value="prospective">Prospective</option>
          </select>
        </div>
        <div className="input-group">
          <img src={padlock} alt="Padlock Icon" className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
          />
        </div>
        <button type="submit">
          Sign Up
          <img src={next} alt="Next Icon" className="next-icon" />
        </button>
        <hr />
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
};

export default SignUp;