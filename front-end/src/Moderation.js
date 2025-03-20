import React, { useState, useEffect } from 'react';
import './moderation.css';

const Moderation = () => {
  const [activeSection, setActiveSection] = useState('feedback'); // Set to feedback by default to show the section
  const [userReports, setUserReports] = useState([]);
  const [listingReports, setListingReports] = useState([]);
  const [reviewReports, setReviewReports] = useState([]);
  const [replies, setReplies] = useState({});
  const [contacts, setContacts] = useState([]);
  
  // Mock feedback data. Need to be connected to back end
  const [feedback, setFeedback] = useState([
    {
      feedback_id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      category: "Bug Report",
      feedback: "The order confirmation page crashes whenever I try to access it through the email link. This started happening after the latest update.",
      timestamp: "2025-03-18",
      user_id: 123, // Logged in user
      is_read: false
    },
    {
      feedback_id: 2,
      name: "Sarah Johnson",
      email: "sarahjohnson@gmail.com",
      category: "Faulty Product",
      feedback: "The charger I received with order #45872 stopped working after only three days of use. The cable shows no visible damage but doesn't charge my device anymore.",
      timestamp: "2025-03-17",
      user_id: null, // External user
      is_read: false
    },
    {
      feedback_id: 3,
      name: "Michael Wong",
      email: "michael.w@company.org",
      category: "Other",
      feedback: "I'd like to suggest adding a dark mode option to the website. It would be much easier on the eyes when browsing at night.",
      timestamp: "2025-03-18",
      user_id: 456, // Logged in user
      is_read: true
    },
    {
      feedback_id: 4,
      name: "Emily Rodriguez",
      email: "emilyr@example.net",
      category: "Bug Report",
      feedback: "There seems to be an issue with the search function. When I search for products with hyphens in the name, no results show up even though I know they exist.",
      timestamp: "2025-03-18",
      user_id: null, // External user
      is_read: false
    }
  ]);
  
  // State to trigger re-fetch after updating a contact
  const [refreshContacts, setRefreshContacts] = useState(false);
  // State to trigger re-fetch after marking feedback as read
  const [refreshFeedback, setRefreshFeedback] = useState(false);

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
  
    if (activeSection === 'messages' || refreshContacts) {
      fetchContacts();
      setRefreshContacts(false);
    }
  }, [activeSection, refreshContacts]);

  // In real implementation, this would fetch from the backend
  useEffect(() => {
    // This effect would fetch actual feedback data in production
    // Since we're using mock data now, we don't need to make an actual fetch
    console.log("Feedback section active");
  }, [activeSection, refreshFeedback]);

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

  const handleContactUpdate = async (contactId, isLoggedIn) => {
    const payload = {
      is_logged_in: isLoggedIn
    };
  
    // Add moderator response if the user was logged in
    if (isLoggedIn) {
      payload.moderator_response = replies[contactId] || "";
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/edit_contact/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert("Contact updated successfully!");
        // Refresh contacts after the update
        setRefreshContacts(true);
      } else {
        alert("Failed to update contact.");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  // Mock function for marking feedback as read
  const handleMarkFeedbackAsRead = (feedbackId) => {
    // Update local state to mark as read
    setFeedback(prevFeedback => 
      prevFeedback.map(item => 
        item.feedback_id === feedbackId ? {...item, is_read: true} : item
      )
    );
    
    
    alert("Feedback marked as read!");
  };

  const handleReplyChange = (id, value) => {
    setReplies((prevReplies) => ({ ...prevReplies, [id]: value }));
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
            
            {/* Feedback Items Section */}
            <div className="feedback-container">
              {feedback.length > 0 ? (
                feedback.map((item) => (
                  <div className="feedback-item" key={item.feedback_id}>
                    <div className="feedback-header">
                      <h3>{item.name}</h3>
                      <span className={`user-type-label ${item.user_id ? "logged-in" : "external"}`}>
                        {item.user_id ? "Logged in user" : "An external user"}
                      </span>
                    </div>
                    <div className="feedback-details">
                      <p><strong>Email:</strong> {item.email}</p>
                      <p><strong>Category:</strong> <span className="feedback-category">{item.category}</span></p>
                      <p><strong>Submitted:</strong> {new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="feedback-content">
                      <p>{item.feedback}</p>
                    </div>
                    <div className="feedback-actions">
                      {!item.is_read ? (
                        <button 
                          className="mark-read-btn"
                          onClick={() => handleMarkFeedbackAsRead(item.feedback_id)}
                        >
                          Mark as Read
                        </button>
                      ) : (
                        <div className="read-status">✓ Read</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No feedback submissions found.</p>
              )}
            </div>
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
                      <button onClick={() => handleContactUpdate(contact.contact_id, true)}>Submit Reply</button>
                    </>
                  ) : (
                    <button className="externally-responded-btn" onClick={() => handleContactUpdate(contact.contact_id, false)}>Mark as Externally Responded</button>
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