import './App.css';
import { Routes, Route} from "react-router-dom"; // Import React Router
import React from 'react'
import Home from "./Home.js";
import Navbar from './Navbar.js';

import Profile from "./Profile.js"; // Import Profile page
import Listing from "./Listing.js"; // Import Listing page
import Footer from "./Footer.js";
import Product from "./Product.js";
import EditProduct from "./EditProduct.js";
import Purchase from "./Purchase.js";
import Help from "./Help.js";
import About from  "./About.js";
import Chat from './Chat.js';
import Notifications from './Notifications.js';
import Moderation from './Moderation.js';

function App() {
  return (
    <div>

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<Listing />}  />
        <Route path="/profile" element={<Profile />}  />
        <Route path="/product" element={<Product />} />
        <Route path="/edit-product" element={<EditProduct />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/moderation" element={<Moderation />} />
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
