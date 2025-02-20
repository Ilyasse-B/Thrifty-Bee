import React from 'react';
import {useState} from 'react';
import './help.css';

const Help = () => {

  const [activeSection, setActiveSection] = useState('help');

  const renderContent = () => {
    switch (activeSection) {
      case 'help':
        return (
          <div className="content-section">
            <h2>Help Page</h2>
            <div className="help-grid">
                <p>Find answers to commonly asked questions</p>
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="content-section">
            <h2>Submit Feedback</h2>
            <form className="feedback-form">
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select id="category">       
                  <option value="select">Please Select a Category</option>
                  <option value="bug">Bug Report</option>
                  <option value="product">Faulty Product</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Feedback:</label>
                <textarea id="message" rows="5"></textarea>
              </div>
              <button type="submit" className="submit-button">Submit Feedback</button>
            </form>
          </div>
        );

      case 'report':
        return (
          <div className="content-section">
            <h2>Report a User</h2>
            <form className="report-form">
              <div className="form-group">
                <label htmlFor="username">Username to Report:</label>
                <input type="text" id="username" />
              </div>
              <div className="form-group">
                <label htmlFor="reason">Reason:</label>
                <select id="reason">
                  <option value="select">Please Select a Reason</option>
                  <option value="item-missing">Did not send item</option>
                  <option value="payment">Issue with payment</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="details">Additional Details:</label>
                <textarea id="details" rows="5"></textarea>
              </div>
              <button type="submit" className="submit-button">Submit Report</button>
            </form>
          </div>
        );

      case 'contact':
        return (
          <div className="content-section">
            <h2>Contact Us</h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" />
              </div>
              <div className="form-group">
                <label htmlFor="reason">Reason:</label>
                <input type="reason" id="reason" /> 
              </div>
              <button type="submit" className="submit-button">Send Message</button>
            </form>
          </div>
        );

      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="help-page">
      <nav className="sidebar">
        <button 
          className={`nav-button ${activeSection === 'help' ? 'active' : ''}`}
          onClick={() => setActiveSection('help')}
        >
          Help
        </button>
        <button 
          className={`nav-button ${activeSection === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveSection('feedback')}
        >
          Feedback
        </button>
        <button 
          className={`nav-button ${activeSection === 'report' ? 'active' : ''}`}
          onClick={() => setActiveSection('report')}
        >
          Report a User
        </button>
        <button 
          className={`nav-button ${activeSection === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveSection('contact')}
        >
          Contact Us
        </button>
      </nav>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default Help