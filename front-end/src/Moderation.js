import React, { useState, useEffect } from 'react';
import './moderation.css';

const Moderation = () => {
  const [activeSection, setActiveSection] = useState('reports'); // Set to feedback by default to show the section
  const [userReports, setUserReports] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [listingReports, setListingReports] = useState([]);
  const [reviewReports, setReviewReports] = useState([]);
  const [replies, setReplies] = useState({});
  const [contacts, setContacts] = useState([]);
  
  // State to trigger re-fetch after updating a contact
  const [refreshContacts, setRefreshContacts] = useState(false);
  // State to trigger re-fetch after marking feedback as read
  const [refreshFeedback, setRefreshFeedback] = useState(false);

  // Fetch feedback from the backend
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/fetch_feedback");
        const data = await response.json();
        if (data.Feedback) {
          setFeedback(data.Feedback);
        } else {
          setFeedback([]);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    if (activeSection === 'feedback' || refreshFeedback) {
      fetchFeedback();
      setRefreshFeedback(false);
    }
  }, [activeSection, refreshFeedback]);

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

  const handleMarkFeedbackAsRead = async (feedbackId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/edit_feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: "True" }),
      });
  
      if (response.ok) {
        alert("Feedback marked as read!");
        // Refresh feedback after marking as read
        setRefreshFeedback(true);
      } else {
        alert("Failed to mark feedback as read.");
      }
    } catch (error) {
      console.error("Error marking feedback as read:", error);
    }
  };

  const handleReplyChange = (id, value) => {
    setReplies((prevReplies) => ({ ...prevReplies, [id]: value }));
  };

  const handleMarkAsSolved = async (reportId, reportType) => {
    try {
      const endpoint =
        reportType === 'review'
        ? `http://127.0.0.1:5000/edit_review_report/${reportId}`
        : reportType === "listing"
        ? `http://127.0.0.1:5000/edit_listing_report/${reportId}`
        : `http://127.0.0.1:5000/edit_user_report/${reportId}`;
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solved: "True"
        }),
      });
  
      if (response.ok) {
        alert("Report marked as solved!");
        // Refresh window after action
        window.location.reload();
      } else {
        alert("Failed to mark as solved.");
      }
    } catch (error) {
      console.error("Error marking report as solved:", error);
    }
  };

  const handleDeleteReview = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this review? This action is permanent.")) {
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/edit_review_report/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solved: "True",
          delete: "True"
        }),
      });
  
      if (response.ok) {
        alert("Review deleted and report marked as solved.");
        // Refresh window after action
        window.location.reload();
      } else {
        alert("Failed to delete review.");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleDeleteListing = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this listing? This action is permanent.")) {
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/edit_listing_report/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solved: "True",
          delete: "True"
        }),
      });
  
      if (response.ok) {
        alert("Listing deleted and report marked as solved.");
        // Refresh window after action
        window.location.reload();
      } else {
        alert("Failed to delete listing.");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
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

                    {/* Buttons */}
                    <div className="moderation-actions">
                      <button className="mark-solved-btn" onClick={() => handleMarkAsSolved(report.report_id, "review")}>
                        Mark as Solved
                      </button>
                      <button className="delete-review-btn" onClick={() => handleDeleteReview(report.report_id)}>
                        Delete Review
                      </button>
                    </div>
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

                  {/* Buttons */}
                  <div className="moderation-actions">
                      <button className="mark-solved-btn" onClick={() => handleMarkAsSolved(report.report_id, "listing")}>
                        Mark as Solved
                      </button>
                      <button className="delete-review-btn" onClick={() => handleDeleteListing(report.report_id)}>
                        Delete Listing
                      </button>
                    </div>
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
                    <p><strong>Reported by:</strong> {report.reportee_name}</p>
                    <p><strong>Reported User:</strong> {report.reported_name}</p>
                    <p><strong>Offender's Email:</strong> {report.reported_email_address}</p>
                    <p><strong>Offender's Phone Number:</strong> {report.reported_number}</p>
                    <p><strong>Description:</strong> {report.reason}</p>

                    <div className="moderation-actions">
                      <button className="mark-solved-btn" onClick={() => handleMarkAsSolved(report.report_id, "user")}>
                        Mark as Solved
                      </button>
                    </div>
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
                      <div className={`user-type-label ${item.user_id ? "logged-in" : "external"}`}>
                        {item.user_id ? "Logged in user" : "An external user"}
                      </div>
                    </div>
                    <div className="feedback-details">
                      <p><strong>Email:</strong> {item.email}</p>
                      <p><strong>Category:</strong> <span className="feedback-category">{item.category}</span></p>  
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