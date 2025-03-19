import React, { useState, useEffect } from 'react';
import './moderation.css';

const Moderation = () => {
  const [activeSection, setActiveSection] = useState('reports');
  const [userReports, setUserReports] = useState([]);
  const [listingReports, setListingReports] = useState([]);
  const [reviewReports, setReviewReports] = useState([]);
  const [replies, setReplies] = useState({});
  const [contacts, setContacts] = useState([]);

  // Fetch Contact Us submissions
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/fetch_contacts_moderator");
        const data = await response.json();
  
        if (data.Contacts) {
          setContacts(data.Contacts);
        } else {
          setContacts([]);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
  
    if (activeSection === 'messages') {
      fetchContacts();
    }
  }, [activeSection]);

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

  // Fetch review reports
  useEffect(() => {
    const fetchReviewReports = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/fetch_review_reports");
        const data = await response.json();
        
        if (data.reviews) {
          setReviewReports(data.reviews);
        } else {
          setReviewReports([]);
        }
      } catch (error) {
        console.error("Error fetching review reports:", error);
      }
    };

    if (activeSection === 'reports') {
      fetchReviewReports();
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

            {/* Review Reports Section */}
            <div className="reports-sub-section">
              <h2 className='different-reports'>Review Reports</h2>
              {reviewReports.length > 0 ? (
                reviewReports.map((report) => (
                  <div className="report-item" key={report.report_id}>
                    <p><strong>Reported by:</strong> {report.reporter_name}</p>
                    <p><strong>Reviewer:</strong> {report.reviewer_name}</p>
                    <p><strong>Reviewed:</strong> {report.reviewed_name}</p>
                    <p><strong>Rating:</strong> {report.review_rating} Stars</p>
                    <p><strong>Description:</strong> {report.review_description}</p>
                    <p><strong>Reason for Report:</strong> {report.reason}</p>
                  </div>
                ))
              ) : (
                <p>No review reports found.</p>
              )}
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

            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <div className="message-item" key={contact.contact_id}>
                  {contact.user_contacted == null ? (<p>This is an external user, please respond to them through the email provided</p>) : (<p>This is a logged in user, enter an in-app reply below</p>)}
                  <p><strong>Name:</strong> {contact.name}</p>
                  <p><strong>Email:</strong> {contact.email}</p>
                  <p><strong>Reason:</strong> {contact.reason}</p>
                  <p><strong>Timestamp:</strong> {new Date(contact.timestamp).toLocaleString()}</p>

                  {contact.user_contacted ? (
                    <>
                      <textarea
                        placeholder="Type your reply..."
                        value={replies[contact.contact_id] || ''}
                        onChange={(e) => handleReplyChange(contact.contact_id, e.target.value)}
                      ></textarea>
                      <button onClick={() => handleReplySubmit(contact.contact_id)}>Submit Reply</button>
                    </>
                  ) : (
                    <button className="externally-responded-btn">Mark as Externally Responded</button>
                  )}
                </div>
              ))
            ) : (
              <p>No messages found.</p>
            )}

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
