import React, { useState, useEffect } from 'react';
import './styles/PersonalInfo.css';
import { useDashboard } from '../Context/DashboardContext';

const PersonalInfo = ({ currentUser, onFormValid, onSaveInfo }) => {
  const { userInfo, updateUserInfo } = useDashboard();
  const [localUserInfo, setLocalUserInfo] = useState(userInfo || currentUser || {});

  useEffect(() => {
    if (currentUser) {
      console.log('Setting localUserInfo from currentUser:', currentUser);
      setLocalUserInfo(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    console.log('Validating form with localUserInfo:', localUserInfo);
    validateForm(localUserInfo);
  }, [localUserInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedUserInfo = { ...localUserInfo, [name]: value };
    setLocalUserInfo(updatedUserInfo);
  };

  const handleBlur = () => {
    console.log('Updating user info:', localUserInfo);
    updateUserInfo(localUserInfo);
  };

  const validateForm = (data) => {
    const isValid = data.name && data.email && data.program && data.year_of_study && data.major && data.status;
    console.log('Form is valid:', isValid);
    onFormValid(isValid);
  };

  useEffect(() => {
    console.log('Saving info with localUserInfo:', localUserInfo);
    onSaveInfo(localUserInfo);
  }, [localUserInfo, onSaveInfo]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="personalinfo-container">
      <h2 className="personalinfo-title">Personal Information</h2>
      <div className="personalinfo-row">
        <div className="personalinfo-field">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={localUserInfo.name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Name"
          />
        </div>
        <div className="personalinfo-field">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={localUserInfo.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Email"
          />
        </div>
      </div>
      {localUserInfo.role === 'undergraduate' && (
        <>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Program:</label>
              <input
                type="text"
                name="program"
                value={localUserInfo.program || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Program"
              />
            </div>
            <div className="personalinfo-field">
              <label>Year of Study:</label>
              <input
                type="text"
                name="year_of_study"
                value={localUserInfo.year_of_study || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Year of Study"
              />
            </div>
          </div>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Major:</label>
              <input
                type="text"
                name="major"
                value={localUserInfo.major || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Major"
              />
            </div>
            <div className="personalinfo-field">
              <label>Status:</label>
              <input
                type="text"
                name="status"
                value={localUserInfo.status || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Status"
              />
            </div>
          </div>
        </>
      )}
      {/* Add other roles similarly */}
    </div>
  );
};

export default PersonalInfo;