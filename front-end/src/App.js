import './App.css';
import { Routes, Route, Navigate } from "react-router-dom"; // Import React Router
import Home from "./Home.js";
import Navbar from './Navbar.js';
import Profile from "./Profile.js"; // Import Profile page
import Listing from "./Listing.js"; // Import Listing page
import { useAuth } from "./AuthContext"; // Import login state

function App() {
  const { isLoggedIn, toggleLogin } = useAuth(); // Get login state


  return (
    <div>

      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<Listing />} />
        {/* Redirect to Profile when logged in, otherwise stay on Home */}
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} /> */}
      </Routes>
    </div>
  );
}

export default App;
