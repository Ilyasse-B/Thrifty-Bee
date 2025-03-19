import React from 'react';
import {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import './help.css';

const Help = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSection = queryParams.get('section') || 'help';
  const [activeSection, setActiveSection] = useState('help');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const username = sessionStorage.getItem('username');

    if (!reason) {
      alert('Please enter a reason.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/create_contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username || null,
          name: username ? null : name,
          email: username ? null : email,
          reason,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Message sent successfully');
        setName('');
        setEmail('');
        setReason('');
      } else {
        alert(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred while sending the message.');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const username = sessionStorage.getItem('username');

    if (!category || category === "select") {
      alert("Please select a category.");
      return;
    }

    if (!feedback) {
      alert("Please enter your feedback.");
      return;
    }

    // Payload based on login status
    const payload = {
      category,
      feedback,
      ...(username ? { username } : { name, email })
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/create_feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Feedback submitted successfully!');
        setCategory('');
        setFeedback('');
        setName('');
        setEmail('');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit feedback.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred while submitting feedback.');
    }
  };

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

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
            <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
              {/* Show name and email fields for non-logged-in users */}
              {!sessionStorage.getItem('username') && (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {/* Category Selection */}
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="select">Please Select a Category</option>
                  <option value="bug">Bug Report</option>
                  <option value="product">Faulty Product</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Feedback Text */}
              <div className="form-group">
                <label htmlFor="feedback">Your Feedback:</label>
                <textarea
                  id="feedback"
                  rows="5"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-button">
                Submit Feedback
              </button>
            </form>
          </div>
        );

      case 'report':
        return (
          <div className="content-section">
            <h2>Create A Report</h2>
            <form className="report-form">
              <div className="form-group">
                <label htmlFor="username">Username to Report:</label>
                <input type="text" id="username" />
              </div>
              <div className="form-group">
                <label htmlFor="reason">Type:</label>
                <select id="reason">
                  <option value="select">Please Select What Type of Report You are Making</option>
                  <option value="item-missing">Report a User</option>
                  <option value="payment">Issue with a Listing</option>
                  <option value="inappropriate">Inappropriate Review</option>
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
            <form className="contact-form" onSubmit={handleContactSubmit}>
            {!sessionStorage.getItem('username') && (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label htmlFor="reason">Reason:</label>
                <input
                  type="text"
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Send Message
              </button>
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
          Create a Report
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