//This will be a navigation bar component used on all pages
import "./navbar.css";
import { useAuth } from "./AuthContext.js"; //import global auth state
import React from 'react'

const Navbar = () => {
  const { isLoggedIn, toggleLogin } = useAuth(); // Get login state and function
  
  return (
    <nav className = "navbar">
      {/* Left Side - Brand */}
      <div className="nav-left">
        <span className="brand">Thrifty Bee</span>
      </div>

      {/* Right Side - Navigation Links */}
      <div className="nav-right">
        <button className="nav-button">Help</button>
        <button className="nav-button">Search</button>
        <button className="login-button" onClick={toggleLogin}>{isLoggedIn ? "Dashboard" : "Login"}</button>
      </div>

    </nav>    
  )
}

export default Navbar