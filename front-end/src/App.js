import './App.css';
import { Routes, Route, Navigate } from "react-router-dom"; // Import React Router
import React, { useState } from 'react'
import Home from "./Home.js";
import Navbar from './Navbar.js';
import Profile from "./Profile.js"; // Import Profile page
import Listing from "./Listing.js"; // Import Listing page
//import { useAuth } from "./AuthContext"; // Import login state
import Footer from "./Footer.js";

function App() {
  //const { isLoggedIn, toggleLogin } = useAuth(); // Get login state+
  const [auth,setAuth]  = useState(false)

  const GlobalState = {
    auth,setAuth
  }


  return (
    <div>

      <Navbar GlobalState={GlobalState}/>
      <Routes>
        <Route path="/" element={<Home GlobalState={GlobalState}/>} />
        <Route path="/listing" element={<Listing GlobalState={GlobalState}/>}  />
        {/* Redirect to Profile when logged in, otherwise stay on Home */}
        <Route path="/profile" element={<Profile GlobalState={GlobalState}/>}  />
        {/* <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} /> */}
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
