//This will be a navigation bar component used on all pages
import "./navbar.css";
import { useAuth } from "./AuthContext.js"; //import global auth state
import { Link, redirect } from "react-router-dom"; // Import Link for navigation
import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./assets/logo.png";
import CryptoJS from 'crypto-js';


const Navbar = () => {
  const { isLoggedIn, toggleLogin, updateEncryptedCsTicket, updateUserCredentials, username, fullName, encryptedCsTicket } = useAuth(); // Get login state and function
  const navigate = useNavigate(); // Navigation function
  const location = useLocation(); // Get current page
  const secretKey = process.env.REACT_APP_APP_SECRET

  // Function to force reload to a given page
  const handleNavigation = (path) => {
    if (location.pathname === path) {
      navigate(path, { replace: true }); // Force reload Home
    } else {
      navigate(path);
    }
  };

  const authenticateViaCAS =  async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/intiate_login")
      if (!response.ok){

        throw new Error('Failed to authenticate user, check the flask server because this is not meant to happen')

      }
      console.log(secretKey)
      const data = await response.json();
      const redirect_url = data.auth_url
      const csTick = data.cs_ticket
      const encryptedCsTicket = CryptoJS.AES.encrypt(csTick, secretKey).toString();
      updateEncryptedCsTicket(encryptedCsTicket)

      window.location = redirect_url

    }catch (error){
      console.error(error)
    }

  };

  return (
    <nav className = "navbar">
      {/* Left Side - Brand */}
      <div className="nav-left">
        <img src={logo} alt="Thrifty Bee Logo" className="logo" />
        <span className="brand">Thrifty Bee</span>
      </div>

      {/* Right Side - Navigation Links */}
      <div className="nav-right">
        <button className="nav-button">Help</button>
        <button className="nav-button" onClick={() => handleNavigation("/listing")}>Listing (Temporary)</button>
        <button className="nav-button" onClick={() => handleNavigation("/")}>Search</button>
        <button className="login-button" onClick={() => {
          if (!isLoggedIn){
            authenticateViaCAS()
            // toggleLogin(); I have removed this so that we only toggle when the person has successfuly loged in. Look at Profile.js line 25

          } else{
            navigate(`/profile/?app_secret=${secretKey}&csticket=${true}`)
          }
          console.log(isLoggedIn)
          }}>
          {isLoggedIn ? "Dashboard" : "Login"}
        </button>
      </div>

    </nav>
  )
}

export default Navbar