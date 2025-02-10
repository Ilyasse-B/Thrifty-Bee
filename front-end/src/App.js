import './App.css';
import { Routes, Route} from "react-router-dom"; // Import React Router
import React from 'react'
import Home from "./Home.js";
import Navbar from './Navbar.js';

import Profile from "./Profile.js"; // Import Profile page
import Listing from "./Listing.js"; // Import Listing page
import { useAuth } from "./AuthContext"; // Import login state
import Footer from "./Footer.js";

function App() {




  return (
    <div>

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<Listing />}  />
        {/* Redirect to Profile when logged in, otherwise stay on Home */}
        <Route path="/profile" element={<Profile />}  />
        {/* <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} /> */}

      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
