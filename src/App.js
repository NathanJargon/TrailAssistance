import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './Screens/Signup';
import Login from './Screens/Login';
import Landing from './Screens/Landing';
import Dashboard from './Screens/Dashboard';
import Admin from './Screens/Admin';
import { AuthProvider } from './Screens/Auth/AuthContext';
import './App.css'; // Import the CSS file
import thanks from './assets/thanks.png';

function App() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isDesktop) {
    return (
      <div className="mobile-warning">
        <img src={thanks} alt="Thanks" className="thanks-image" />
        <p>Mobile resolution is not supported! Use media display if it exists on your current engine.</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/landing" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;