import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Landing.css';
import logo from '../assets/logo.png';
import next from '../assets/next.png';


//          <Link to="/sign-up" className="register-button">
//            Register
//            <img src={next} alt="Next Icon" className="next-icon" />
//          </Link>


const Landing = () => {
  return (
    <div className="landing-page">
      <div className="logo-container">
        <img src={logo} alt="USTP Logo" className="landing-logo" />
        <p className="slogan">Welcome to the Dean's Office Assistance Kiosk.</p>
        <p className="slogan">We're here to help you with all your academic needs.</p>
        <div className="button-container">
          <Link to="/login" className="login-button">
            Login
            <img src={next} alt="Next Icon" className="next-icon" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;