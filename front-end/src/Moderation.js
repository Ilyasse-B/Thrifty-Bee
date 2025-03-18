import React, { useState, useEffect } from 'react';
import './moderation.css';

const Moderation = () => {
  const [activeSection, setActiveSection] = useState('reports');
  const [userReports, setUserReports] = useState([]);
  const [listingReports, setListingReports] = useState([]);
  const [replies, setReplies] = useState({});

  // Fetch user reports
  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/fetch_user_reports");
        const data = await response.json();

        if (data.Users) {
          setUserReports(data.Users);
        } else {
          setUserReports([]);
        }
      } catch (error) {
        console.error("Error fetching user reports:", error);
      }
    };

    if (activeSection === 'reports') {
      fetchUserReports();
    }
  }, [activeSection]);

  // Fetch listing reports
  useEffect(() => {
    const fetchListingReports = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/fetch_listing_reports");
        const data = await response.json();

        if (data.Listings) {
          setListingReports(data.Listings);
        } else {
          setListingReports([]);
        }
      } catch (error) {
        console.error("Error fetching listing reports:", error);
      }
    };

    if (activeSection === 'reports') {
      fetchListingReports();
    }
  }, [activeSection]);

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

            {/* Listing Reports Section */}
          <div className="reports-sub-section">
            <h2 className='different-reports'>Listing Reports</h2>
            {listingReports.length > 0 ? (
              listingReports.map((report) => (
                <div className="report-item" key={report.report_id}>
                  <p><strong>Reported by:</strong> {report.user_who_reported_name}</p>
                  <p><strong>Listing Name:</strong> {report.listing_name}</p>
                  <img src={report.listing_image} alt={report.listing_name} className="report-image" />
                  <p><strong>Listing Description:</strong> {report.listing_description}</p>
                  <p><strong>Listing Price:</strong> £{report.listing_price}</p>
                  <p><strong>Reason:</strong> {report.reason}</p>
                </div>
              ))
            ) : (
              <p>No listing reports found.</p>
            )}
          </div>

            {/* User Reports Section */}
            <div className="reports-sub-section">
              <h2 className='different-reports'>User Reports</h2>
              {userReports.length > 0 ? (
                userReports.map((report) => (
                  <div className="report-item" key={report.report_id}>
                    <p><strong>Reported by:</strong> {report.user_who_reported_name}</p>
                    <p><strong>Reported User:</strong> {report.user_name}</p>
                    <p><strong>Offender's Email:</strong> {report.email}</p>
                    <p><strong>Offender's Phone Number:</strong> {report.phone}</p>
                    <p><strong>Description:</strong> {report.reason}</p>
                  </div>
                ))
              ) : (
                <p>No user reports found.</p>
              )}
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
