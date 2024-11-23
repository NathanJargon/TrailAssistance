import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Login.css';
import logo from '../assets/ustplogo.png';
import user from '../assets/user.png';
import padlock from '../assets/padlock.png';
import next from '../assets/next.png';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './Auth/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const q = query(collection(db, 'visitors'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert('Login failed. Email not found.');
        return;
      }

      let loginSuccessful = false;
      let userData = null;
      querySnapshot.forEach((doc) => {
        if (doc.data().password === password) {
          loginSuccessful = true;
          userData = { ...doc.data(), uid: doc.id };
        }
      });

      if (loginSuccessful) {
        setCurrentUser(userData);
        navigate('/dashboard');
      } else {
        alert('Login failed. Incorrect password.');
      }
    } catch (error) {
      console.error('Error logging in: ', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <img src={logo} alt="USTP Logo" className="login-logo" />
      </header>
      <main className="login-content">
        <h1 className="login-h1">Login to your account</h1>
        <hr />
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-input-group">
            <img src={user} alt="User Icon" className="login-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              className="login-input"
            />
          </div>
          <div className="login-input-group">
            <img src={padlock} alt="Padlock Icon" className="login-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              className="login-input"
            />
          </div>
          <div className="login-form-container">
            <button type="submit" className="login-btn">
              Login
              <img src={next} alt="Next Icon" />
            </button>
          </div>
          <hr />
          <p>Don't have an account? <Link to="/sign-up" className="login-link">Sign up</Link></p>
        </form>
      </main>
    </div>
  );
};

export default Login;