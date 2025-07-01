// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || '';
  });

  const login = (email) => {
    if (!email) return;
    localStorage.setItem('userEmail', email);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail('');
  };

  return (
    <AuthContext.Provider value={{ userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
