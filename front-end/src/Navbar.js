//This will be a navigation bar component used on all pages
import "./navbar.css";
import { useAuth } from "./AuthContext.js"; //import global auth state
import { Link } from "react-router-dom"; // Import Link for navigation
import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { isLoggedIn, toggleLogin } = useAuth(); // Get login state and function
  const navigate = useNavigate(); // Navigation function
  const location = useLocation(); // Get current page

  // Function to force reload to a given page
  const handleNavigation = (path) => {
    if (location.pathname === path) {
      navigate(path, { replace: true }); // Force reload Home
    } else {
      navigate(path);
    }
  };

  return (
    <nav className = "navbar">
      {/* Left Side - Brand */}
      <div className="nav-left">
        <span className="brand">Thrifty Bee</span>
      </div>

      {/* Right Side - Navigation Links */}
      <div className="nav-right">
        <button className="nav-button">Help</button>
        <button className="nav-button" onClick={() => handleNavigation("/")}>Search</button>
        <button className="login-button" onClick={() => {
          if (!isLoggedIn){
            toggleLogin();
            navigate("/profile");
          } else{
            handleNavigation("/profile");
          }
          }}>
          {isLoggedIn ? "Dashboard" : "Login"}
        </button>
      </div>

    </nav>    
  )
}

export default Navbar