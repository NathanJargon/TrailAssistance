import React, { createContext, useState, useContext, useEffect } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const savedInfo = localStorage.getItem('ConcernInformation');
    return savedInfo ? JSON.parse(savedInfo) : {};
  });

  useEffect(() => {
    localStorage.setItem('ConcernInformation', JSON.stringify(userInfo));
  }, [userInfo]);

  const updateUserInfo = (updatedInfo) => {
    setUserInfo(updatedInfo);
    console.log("Concern Information: ", updatedInfo);
  };

  return (
    <DashboardContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </DashboardContext.Provider>
  );
};