// This file will store a global state of "logged in", which can be used in any page to know if the user is logged in or not.

import React, { createContext, useState, useContext} from "react";

// Create a Context for authentication
const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });

  // Function to toggle login state
  const toggleLogin = () => {
    const newState = !isLoggedIn;
    setIsLoggedIn(newState);
    sessionStorage.setItem("isLoggedIn", newState.toString());//stores in session
  }
  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);