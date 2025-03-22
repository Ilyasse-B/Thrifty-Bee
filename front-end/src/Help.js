import React, {useState, useEffect} from 'react';
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
  const [details, setDetails] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // For reporting users
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // For reporting listings
  const [listings, setListings] = useState([]);
  const [listingSearchTerm, setListingSearchTerm] = useState('');
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState(null);

  // For reporting reviews
  const [reviews, setReviews] = useState([]);
  const [reviewSearchTerm, setReviewSearchTerm] = useState('');
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);  
  
  // Fetch all users when "Report a User" is selected
  useEffect(() => {
    if (reason === 'user') {
      const fetchUsers = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/all_users');
          if (response.ok) {
            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data);
          } else {
            console.error('Failed to fetch users');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      fetchUsers();
    }
  }, [reason]);

  // Filter users dynamically based on search term
  useEffect(() => {
    const filtered = users.filter(user =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Fetch all listings when "Report a Listing" is selected
  useEffect(() => {
    if (reason === 'listing') {
      const fetchListings = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/all_listings');
          if (response.ok) {
            const data = await response.json();
            setListings(data);
            setFilteredListings(data);
          } else {
            console.error('Failed to fetch listings');
          }
        } catch (error) {
          console.error('Error fetching listings:', error);
        }
      };
      fetchListings();
    }
  }, [reason]);

  // Filter listings dynamically based on search term
  useEffect(() => {
    const filtered = listings.filter(listing =>
      listing.listing_name.toLowerCase().includes(listingSearchTerm.toLowerCase())
    );
    setFilteredListings(filtered);
  }, [listingSearchTerm, listings]);

  // Fetch all Reviews when "Report a Review" is selected
  useEffect(() => {
    if (reason === 'listing') {
      const fetchReviews = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/all_reviews');
          if (response.ok) {
            const data = await response.json();
            setReviews(data);
            setFilteredReviews(data);
          } else {
            console.error('Failed to fetch reviews');
          }
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
      fetchReviews();
    }
  }, [reason]);

  // Filter reviews dynamically based on search term
  useEffect(() => {
    const filtered = reviews.filter(review =>
      review.reviewer_first_name.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
      review.description.toLowerCase().includes(reviewSearchTerm.toLowerCase())
    );
    setFilteredReviews(filtered);
  }, [reviewSearchTerm, reviews]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const username = sessionStorage.getItem('username');

    if (!username) {
      alert('You must be logged in to submit a report.');
      return;
    }

    if (reason === 'user' && !selectedUserId) {
      alert('Please select a user to report.');
      return;
    }

    if (reason === 'listing' && !selectedListingId) {
      alert('Please select a listing to report.');
      return;
    }

    if (reason === 'review' && !selectedReviewId) {
      alert('Please select a review to report.');
      return;
    }

    if (!details) {
      alert('Please provide additional details.');
      return;
    }

    try {
      const endpoint =
        reason === 'user'
          ? 'http://127.0.0.1:5000/create_user_report'
          : reason === 'listing' ?
          'http://127.0.0.1:5000/create_listing_report'
          : 'http://127.0.0.1:5000/create_review_report';
      
      const payload =
        reason === 'user'
          ? {
              user_who_reported_username: username,
              reported_user_id: selectedUserId,
              details,
            }
          : reason === 'listing' ?
            {
              user_who_reported_username: username,
              listing_id: selectedListingId,
              details,
            }
          : {
              user_who_reported_username: username,
              review_id: selectedReviewId,
              details,
            };
            
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setConfirmationMessage('Report submitted');
        setReason('');
        setDetails('');
        setSearchTerm('');
        setSelectedUserId(null);
        setListingSearchTerm('');
        setSelectedListingId(null);
        setSelectedReviewId(null);
        setReviewSearchTerm('');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('An error occurred while submitting the report.');
    }
  };

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
            <form className="report-form" onSubmit={handleReportSubmit}>
              {/* Report Type Selection */}
              <div className="form-group">
                <label htmlFor="reason">Type:</label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                >
                  <option value="">Please Select Report Type</option>
                  <option value="user">Report a User</option>
                  <option value="listing">Report a Listing</option>
                  <option value="review">Report a Review</option>
                </select>
              </div>

              {/* Dynamic User Reporting Section */}
              {reason === 'user' && (
                <div className="user-report-section">
                  {/* Search Box */}
                  <div className="form-group">
                    <label htmlFor="searchUser">Search User:</label>
                    <input
                      type="text"
                      id="searchUser"
                      placeholder="Start typing a name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* User List */}
                  <div className="user-list">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`user-item ${selectedUserId === user.id ? 'selected' : ''}`}
                          onClick={() => setSelectedUserId(user.id)}
                        >
                          {user.first_name} {user.last_name}
                        </div>
                      ))
                    ) : (
                      <p>No users found</p>
                    )}
                  </div>
                </div>
              )}

              {/* Dynamic Listing Reporting Section */}
              {reason === 'listing' && (
                <div className="search-section">
                  <input
                    type="text"
                    placeholder="Search Listing..."
                    value={listingSearchTerm}
                    onChange={(e) => setListingSearchTerm(e.target.value)}
                  />
                  <div className="user-list">
                    {filteredListings.map((listing) => (
                      <div
                        key={listing.id}
                        className={`user-item ${selectedListingId === listing.id ? 'selected' : ''}`}
                        onClick={() => setSelectedListingId(listing.id)}
                      >
                        {listing.listing_name} (Seller: {listing.seller_first_name})
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Dynamic Review Reporting Section */}
              {reason === 'review' && (
                <div className="search-section">
                  <input
                    type="text"
                    placeholder="Search Review..."
                    value={reviewSearchTerm}
                    onChange={(e) => setReviewSearchTerm(e.target.value)}
                  />
                  <div className="user-list">
                    {filteredReviews.map((review) => (
                      <div
                        key={review.id}
                        className={`user-item ${selectedReviewId === review.id ? 'selected' : ''}`}
                        onClick={() => setSelectedReviewId(review.id)}
                      >
                        {review.description} (Reviewer Name: {review.reviewer_first_name})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="form-group">
                <label htmlFor="details">Additional Details:</label>
                <textarea
                  id="details"
                  rows="5"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-button">
                Submit Report
              </button>

              {/* Confirmation Message */}
              {confirmationMessage && (
                <p className="confirmation-message">{confirmationMessage}</p>
              )}
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