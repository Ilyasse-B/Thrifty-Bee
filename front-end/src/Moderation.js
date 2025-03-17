import React, { useState } from 'react';
import './moderation.css';

const Moderation = () => {
  const [activeSection, setActiveSection] = useState('reports');
  const [replies, setReplies] = useState({});

  const handleReplyChange = (id, value) => {
    setReplies((prevReplies) => ({ ...prevReplies, [id]: value }));
  };

  const handleReplySubmit = (id) => {
    alert(`Reply sent: ${replies[id] || 'No reply entered'}`);
    setReplies((prevReplies) => ({ ...prevReplies, [id]: '' }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'reports':
        return (
          <div className="content-section">
            <h2>Reports</h2>
            <p className="content-label">View & Manage user's reports</p>

            <div className="reports-sub-section">
              <h2 className='different-reports'>Review Reports</h2>
              <div className="report-item">
                <p><strong>Reported by:</strong> John Doe</p>
                <p><strong>Reported User:</strong> @badUser</p>
                <p><strong>Description:</strong> Inappropriate behavior in comments.</p>
              </div>
            </div>

            <div className="reports-sub-section">
              <h2 className='different-reports'>Listing Reports</h2>
              <div className="report-item">
                <p><strong>Reported by:</strong> Jane Smith</p>
                <p><strong>Reported User:</strong> @spammer</p>
                <p><strong>Description:</strong> Posting misleading listings.</p>
              </div>
            </div>

            <div className="reports-sub-section">
              <h2 className='different-reports'>User Reports</h2>
              <div className="report-item">
                <p><strong>Reported by:</strong> Alice Brown</p>
                <p><strong>Reported User:</strong> @troll123</p>
                <p><strong>Description:</strong> Harassment in private messages.</p>
              </div>
            </div>
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

            <div className="message-item">
              <p><strong>Name:</strong> Michael Johnson</p>
              <p><strong>Email:</strong> michael@email.com</p>
              <p><strong>Message:</strong> I need help with my account.</p>
              <textarea
                placeholder="Type your reply..."
                value={replies[1] || ''}
                onChange={(e) => handleReplyChange(1, e.target.value)}
              ></textarea>
              <button onClick={() => handleReplySubmit(1)}>Submit Reply</button>
            </div>

            <div className="message-item">
              <p><strong>Name:</strong> Sarah Lee</p>
              <p><strong>Email:</strong> sarah@email.com</p>
              <p><strong>Message:</strong> How can I reset my password?</p>
              <textarea
                placeholder="Type your reply..."
                value={replies[2] || ''}
                onChange={(e) => handleReplyChange(2, e.target.value)}
              ></textarea>
              <button onClick={() => handleReplySubmit(2)}>Submit Reply</button>
            </div>
          </div>
        );
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="moderation-page">
      <nav className="sidebar">
        <button className={`nav-button ${activeSection === 'reports' ? 'active' : ''}`} onClick={() => setActiveSection('reports')}>
          Reports
        </button>
        <button className={`nav-button ${activeSection === 'feedback' ? 'active' : ''}`} onClick={() => setActiveSection('feedback')}>
          Feedback
        </button>
        <button className={`nav-button ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => setActiveSection('messages')}>
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
