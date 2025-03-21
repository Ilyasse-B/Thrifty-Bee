import React from 'react';
import {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import './help.css';
import { useNavigate } from 'react-router-dom';

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
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [reportTypeUser, setReportTypeUser] = useState('');
  const [reportTypeListing, setReportTypeListing] = useState('');
  const [reportTypeReview, setReportTypeReview] = useState('');
  const [reportType, setReportType] = useState('');

  const [FirstNameField, setFirstNameField] = useState('');
  const [listingNameField, setListingNameField] = useState('');
  const [sellersNameField, setSellersNameField] = useState('');
  const [ReviwersNameFiled, setReviwersNameField] = useState('');
  const [ReviwedNameFiled, setReviwedNameField] = useState('');
  const [detailsField, setDetailsField] = useState('');

  const navigate = useNavigate();



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

  const checkLogin = async() => {
    const csTicket = sessionStorage.getItem('csTicket');
    const username = sessionStorage.getItem('username');
    const fullName = sessionStorage.getItem('fullName');

    const first_name = fullName.split(' ')[0]
    const last_name = fullName.split(' ')[1]
    try {
    const response = await fetch('http://127.0.0.1:5000/protected?cs_ticket=' + csTicket + '&username=' + username + '&full_name=' + first_name + '+' + last_name);

    if (response.ok) {
      // Successful response
      setIsLogedIn(true)

    }else{
      setIsLogedIn(false)
    }
   } catch (error) {
      console.error('Error during authentication:', error);
    }

  }

  const postReport = async() => {
    let result = confirm('Are all the Details Correct?');
    if (!result){

    }
    else{
      let request_body = {}
      switch (reportType) {
        case 'user':
            request_body = {
              user_who_reported_username: sessionStorage.getItem('username'),
              reported_user_firstname: FirstNameField,
              details: detailsField,

            }
            break;
        case 'listing':
          request_body = {
            user_who_reported_username: sessionStorage.getItem('username'),
           listing_name: listingNameField,
           sellers_firstname:sellersNameField,
            details: detailsField,

          }
            break;
        case 'review':
          request_body = {
            user_who_reported_username: sessionStorage.getItem('username'),
            reviewer_firstname: ReviwersNameFiled,
            reviewed_firstname: ReviwedNameFiled,
            details: detailsField,

          }
            break;
        default:
            // Code to be executed if expression doesn't match any case
    }
    const csTicket = sessionStorage.getItem('csTicket');
    const username = sessionStorage.getItem('username');
    const fullName = sessionStorage.getItem('fullName');
    const first_name = fullName.split(' ')[0]
    const last_name = fullName.split(' ')[1]
    try {

    const response = await fetch('http://127.0.0.1:5000/create_' + reportType + '_report' + '?cs_ticket=' + csTicket + '&username=' + username + '&full_name=' + first_name + '+' + last_name,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json', // Send data as JSON
    },
    body: JSON.stringify(request_body),
  }


    );

    if (response.ok) {
      // Successful response
      console.log('http://127.0.0.1:5000/create_' + reportType + '_report')








    }else{
      console.log('Report Unsucessful',reportType, request_body)
    }
   } catch (error) {
      console.error('Error during authentication:', error);
    }
  }

  }

  useEffect(() => {
    if (activeSection == 'report'){
      checkLogin()

    }
  }, [activeSection]);

  const setForReport = (e) => {
    const reportType = e.target.value
    setReportType(reportType)

    if (reportType == 'user'){
      setReportTypeUser('user')
      setReportTypeListing('')
      setReportTypeReview('')
    }else if (reportType == 'listing'){
      setReportTypeListing('listing')
      setReportTypeUser('')
      setReportTypeReview('')
    }else if(reportType == 'review'){
      setReportTypeReview('review')
      setReportTypeListing('')
      setReportTypeUser('')
    }else{
      console.log(reportType)
    }


  }

  const getFirstName = (e) => {
    setFirstNameField(e.target.value)

  }
  const getListingName = (e) => {
    setListingNameField(e.target.value)

  }
  const getSellersName = (e) => {
    setSellersNameField(e.target.value)

  }

  const getReviwedName = (e) => {
    setReviwedNameField(e.target.value)

  }

  const getReviwerName = (e) => {
    setReviwersNameField(e.target.value)

  }

  const getDetails = (e) => {
    setDetailsField(e.target.value)

  }



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
            isLogedIn ? (
              <div className="content-section">
                <h2>Create A Report</h2>
                <form className="report-form" onSubmit={postReport}>

                  <div className="form-group select">
                    <label htmlFor="reason">Type:</label>
                    <select id="reason" onChange={setForReport} required name='reason'>
                      <option value="">Please Select What Type of Report You are Making</option>
                      <option value="user">Report a User</option>
                      <option value="listing">Issue with a Listing</option>
                      <option value="review">Inappropriate Review</option>

                    </select>
                  </div>

                  {reportTypeUser && (
                  <div className="form-group">
                    <label htmlFor="firstName">First name of person to report:</label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      onChange={getFirstName}
                      name="firstName"
                    />
                  </div>
                  )}

                  {reportTypeListing && (
                    <div className="form-group">
                      <label htmlFor="listingName">Listing name:</label>
                      <input type="text" id="listing-name" required onChange={getListingName} name="listingName" />
                    </div>
                  )}

                  {reportTypeListing && (
                   <div className={`form-group ${reportTypeListing}`}>
                   <label htmlFor="sellersName">Sellers name:</label>
                   <input type="text" id="sellers-name" required onChange={getSellersName} name='sellersName'/>
                 </div>
                  )}

                  {reportTypeReview && (
                   <div className={`form-group ${reportTypeReview}`}>
                   <label htmlFor="nameOfReviewer">FirstName of reviewer:</label>
                   <input type="text" id="reviwer-name" required onChange={getReviwerName} name='nameOfReviwer'/>
                 </div>
                  )}

                  {reportTypeReview && (
                   <div className={`form-group ${reportTypeReview}`}>
                   <label htmlFor="nameOfReviewed">FirstName of user reviewed:</label>
                   <input type="text" id="reviwed-name" required onChange={getReviwedName} name='nameOfReviwed'/>
                 </div>
                  )}

                  <div className="form-group details">
                    <label htmlFor="details">Additional Details:</label>
                    <textarea id="details" rows="5" required onChange={getDetails} name='details'></textarea>
                  </div>
                  <button type="submit" className="submit-button">Submit Report</button>
                </form>
              </div>
            ) : (
              <p>Please login</p>
            ) // <-- Change made: Removed unnecessary parentheses here, the ternary is now directly followed by JSX content
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