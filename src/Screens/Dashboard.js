import React, { useState, useEffect } from 'react';
import './styles/Dashboard.css';
import logo from '../assets/ustplogo.png';
import { useAuth } from './Auth/AuthContext';
import PersonalInfo from './DashboardViews/PersonalInfo';
import Concerns from './DashboardViews/Concerns';
import WebsiteFeedback from './DashboardViews/WebsiteFeedback';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('personalInfo');
  const { currentUser } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <img src={logo} alt="USTP Logo" className="dashboard-logo" />
        {currentUser && (
          <div className="dashboard-user-info">
            <p>{currentUser.displayName || 'Default Name'}</p>
            <p>{currentUser.email || 'default@example.com'}</p>
          </div>
        )}
        <button onClick={() => setCurrentView('personalInfo')}>Personal Information</button>
        <button onClick={() => setCurrentView('concerns')}>Concerns</button>
        <button onClick={() => setCurrentView('websiteFeedback')}>Website Feedback</button>
      </div>
      <div className="dashboard-content">
        {currentView === 'personalInfo' && <PersonalInfo />}
        {currentView === 'concerns' && <Concerns />}
        {currentView === 'websiteFeedback' && <WebsiteFeedback />}
      </div>
    </div>
  );
};

export default Dashboard;