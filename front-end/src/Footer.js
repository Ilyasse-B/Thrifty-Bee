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
            <button className="foot-button">Feedback</button>
            <button className="foot-button">Report a User</button>
            <button className="foot-button">Contact Us</button>
          </div>
          <div className="inner-group">
            <div className="sub-heading">Selling</div>
            <button className="foot-button">Community Guidelines</button>
            <button className="foot-button">Seller Requirements</button>
          </div>
          <div className="inner-group">
            <div className="sub-heading">About Us</div>
            <button className="foot-button">Commitment</button>
            <button className="foot-button">Page</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;