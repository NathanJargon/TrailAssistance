import React, { useState, useEffect } from 'react';
import './styles/Dashboard.css';
import logo from '../assets/ustplogo.png';
import { useAuth } from './Auth/AuthContext';
import { DashboardProvider, useDashboard } from './Context/DashboardContext';
import PersonalInfo from './DashboardViews/PersonalInfo';
import Concerns from './DashboardViews/Concerns';
import WebsiteFeedback from './DashboardViews/WebsiteFeedback';
import { useNavigate } from 'react-router-dom';
import people from '../assets/people.png';
import marks from '../assets/marks.png';
import rate from '../assets/rate.png';

const DashboardContent = () => {
  const [currentView, setCurrentView] = useState('personalInfo');
  const [isFormValid, setIsFormValid] = useState(false);
  const { currentUser } = useAuth();
  const { userInfo, updateUserInfo } = useDashboard();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Current user: ", currentUser);
  }, [currentUser]);

  const handleFormValid = (isValid) => {
    setIsFormValid(isValid);
  };

  const handleNavigate = (view) => {
    if (view === 'personalInfo' || isFormValid) {
      if (view !== 'personalInfo') {
        handleSaveInfo(userInfo);
      }
      setCurrentView(view);
    } else {
      alert('Please fill out all fields in Personal Information before proceeding.');
    }
  };

  const handleSaveInfo = (info) => {
    updateUserInfo(info);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/landing');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <img src={logo} alt="USTP Logo" className="dashboard-logo" />
        {currentUser && (
          <div className="dashboard-user-info">
            <h1>{currentUser.name || 'Default Name'}</h1>
            <p>{currentUser.email || 'default@example.com'}</p>
          </div>
        )}
        <button 
          className={currentView === 'personalInfo' ? 'active-button' : 'inactive-button'} 
          onClick={() => handleNavigate('personalInfo')}
        >
          <img src={people} alt="People Icon" className="button-icon" />
          Personal Information
        </button>
        <button 
          className={currentView === 'concerns' ? 'active-button' : 'inactive-button'} 
          onClick={() => handleNavigate('concerns')}
        >
          <img src={marks} alt="Marks Icon" className="button-icon" />
          Personal Concerns
        </button>
        <button 
          className={currentView === 'websiteFeedback' ? 'active-button' : 'inactive-button'} 
          onClick={() => handleNavigate('websiteFeedback')}
        >
          <img src={rate} alt="Rate Icon" className="button-icon" />
          Website Feedback
        </button>
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
      </div>
      <div className="dashboard-content">
        {currentView === 'personalInfo' && (
          <PersonalInfo
            currentUser={currentUser}
            onFormValid={handleFormValid}
            onSaveInfo={handleSaveInfo}
          />
        )}
        {currentView === 'concerns' && <Concerns />}
        {currentView === 'websiteFeedback' && <WebsiteFeedback />}
      </div>
    </div>
  );
};

const Dashboard = () => (
  <DashboardProvider>
    <DashboardContent />
  </DashboardProvider>
);

export default Dashboard;