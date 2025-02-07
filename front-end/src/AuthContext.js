// This file will store a global state of "logged in", which can be used in any page to know if the user is logged in or not.

import React, { createContext, useState, useContext, useRef } from "react";

// Create a Context for authentication
const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });
  const [username, setUsername] = useState(() => {
    return sessionStorage.getItem("username") || '';
  });
  const [fullName, setFullName] = useState(() => {
    return sessionStorage.getItem("FullName") || '';
  });
  const [encryptedCsTicket, setEncryptedCsTicket] = useState(() => {
    return sessionStorage.getItem("encryptedCsTicket") || '';
  });




  const usernameRef = useRef('')
  const fullNameRef = useRef('');
  const csTicketRef = useRef('');

  const updateUserCredentials = (newUsernname,newFullName) => {

    setUsername(newUsernname);
    setUsername(newFullName);
    sessionStorage.setItem("username", newUsernname);//stores in session
    sessionStorage.setItem("FullName", newFullName);//stores in session

  };

  const updateEncryptedCsTicket = (newEncryptedCsTicket) => {
    setEncryptedCsTicket(newEncryptedCsTicket)
    sessionStorage.setItem("encryptedCsTicket", newEncryptedCsTicket)

  }





  // Function to toggle login state
  const toggleLogin = () => {
    const newState = !isLoggedIn;
    setIsLoggedIn(newState);
    sessionStorage.setItem("isLoggedIn", newState.toString());//stores in session
  }
  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleLogin, updateUserCredentials, updateEncryptedCsTicket, username, fullName, encryptedCsTicket}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);