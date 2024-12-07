import React, { createContext, useState, useEffect } from "react";

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);  // Added userId state

  // Load data from localStorage if it exists
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
    }

    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }

    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
    }
  }, []);

  // Store token, userRole, and userId in localStorage when they change
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }

    if (userRole) {
      localStorage.setItem("userRole", userRole);
    } else {
      localStorage.removeItem("userRole");
    }

    if (userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  }, [authToken, userRole, userId]);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, userRole, setUserRole, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
