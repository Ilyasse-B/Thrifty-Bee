import React, { useState } from 'react';
import './moderation.css';

const Moderation = () => {
  const [activeSection, setActiveSection] = useState('reports');

  const renderContent = () => {
    switch (activeSection) {
      case 'reports':
        return (
          <div className="content-section">
            <h2>Reports</h2>
            <p className="content-label">View & Manage user's reports</p>
          </div>
        );
      case 'feedback':
        return (
          <div className="content-section">
            <h2>Feedback</h2>
            <p className="content-label">View & Manage feedback made by users</p>
          </div>
        );
      case 'messages':
        return (
          <div className="content-section">
            <h2>User Messages</h2>
            <p className="content-label">View & Manage messages from users submitted from the Contact Us page</p>
          </div>
        );
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="moderation-page">
      <nav className="sidebar">
        <button 
          className={`nav-button ${activeSection === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveSection('reports')}
        >
          Reports
        </button>
        <button 
          className={`nav-button ${activeSection === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveSection('feedback')}
        >
          Feedback
        </button>
        <button 
          className={`nav-button ${activeSection === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveSection('messages')}
        >
          Messages
        </button>
      </nav>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default Moderation;
