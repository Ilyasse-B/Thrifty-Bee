import React from 'react'
import "./footer.css";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="main-heading">Thrifty Bee</div>
        <div className="inner-container">
          <div className="inner-group">
            <div className="sub-heading">Help</div>
            <button className="nav-button">Feedback</button>
            <button className="nav-button">Report a User</button>
            <button className="nav-button">Contact Us</button>
          </div>
          <div className="inner-group">
            <div className="sub-heading">Selling</div>
            <button className="nav-button">Community Guidelines</button>
            <button className="nav-button">Seller Requirements</button>
          </div>
          <div className="inner-group">
            <div className="sub-heading">About Us</div>
            <button className="nav-button">Commitment</button>
            <button className="nav-button">Page</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;