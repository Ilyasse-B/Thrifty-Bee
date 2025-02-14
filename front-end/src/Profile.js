import { useSearchParams } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  // This is where a user will be brought to after logging in since it this page is spceified as the location
  // to bring the users credentials when they have logged in successfully

  const navigate = useNavigate(); // Initialize navigation
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState(null); // Store user ID for listing retrieval

  const [listings, setListings] = useState([]);

  // The useEffect hook make sure that the function inside of it runs only on the first render because
  // the dependecy array is empty
  useEffect(() => {
  //We get the users credentials that we will give to the server from sessionStorage only if any of the query parameters
  // when entering this page are null
  //--> So in this case we are making sure that the session data we have is correct according to the university API
    if (searchParams.get("fullname") === null || searchParams.get("username") === null || searchParams.get('csticket') === null) {
    const fullName = sessionStorage.getItem('fullName') || 'Name';
    const username = sessionStorage.getItem('username') || 'username'
    const csTicket = sessionStorage.getItem('csTicket') || 'csticket';

    fetchData(fullName, username, csTicket);}

    //--> In this case we assume the user is comming from the uni api, the api gives user data in query parameters
    else{
      const fullName = searchParams.get("fullname") || "Full Name";
      const username = searchParams.get("username") || "Username";
      const csTicket = searchParams.get('csticket') || 'default-value';

      sessionStorage.setItem('fullName', fullName)
      sessionStorage.setItem('username', username)
      sessionStorage.setItem('csTicket', csTicket)

      fetchData(fullName,username,csTicket);
    }},[]) // ---> DEPENDENCY ARRAY-empty so that we only check on the initial  data

  // This function is mimicking(it is just an example; fetch to the route you want) a fetch to a protected route; if it goes through successfuly we know that the
  // the user is logged in
  const fetchData =  async (fullName,username,csTicket) => {
    try {
      const authResponse = await fetch(`http://127.0.0.1:5000/protected?full_name=${fullName}&username=${username}&cs_ticket=${csTicket}`)
      if (authResponse.status == 401){ // 401 means not authorised so jump
        throw new Error('User Not Authorised') // jump to catch skip the rest of the code

      }
      if (authResponse.status == 500){
        throw new Error('Internal Server Error: Try again later') // This should not happen and debugging on the backend would need to be done
                                                                  // on the server
      }

      // Fetch user profile details (email, phone)
      const profileResponse = await fetch(
        `http://127.0.0.1:5000/get_profile?username=${username}&first_name=${fullName.split(" ")[0]}&last_name=${fullName.split(" ")[1]}`
      );

      if (!profileResponse.ok) {
        throw new Error("Error fetching user profile");
      }

      const profileData = await profileResponse.json();

      if (profileData.user && profileData.user.length > 0) {
        const user = profileData.user[0];
        setEmail(profileData.user[0].email_address || "Not Provided");
        setPhone(profileData.user[0].phone_number || "Not Provided");
        setUserId(user.user_id);
      }
    }catch (error){
      // Take the user back to the home page they are not authorised
      navigate('/')
      console.error(error)
    }

  };

  // Fetch user listings dynamically
  useEffect(() => {
    if (userId){
      fetch(`http://127.0.0.1:5000/user_listings?user_id=${userId}&full_name=${sessionStorage.getItem('fullName')}&username=${sessionStorage.getItem('username')}&cs_ticket=${sessionStorage.getItem('csTicket')}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.listings) {
          setListings(data.listings);
        } else {
          console.error("No listings found");
        }
      })
      .catch((error) => console.error("Error fetching listings:", error));
    }
  }, [userId]);

  // Ability to delete listings on the profile page
  const deleteListing = (id) => {
    fetch(`http://127.0.0.1:5000/delete_listing/${id}?full_name=${sessionStorage.getItem('fullName')}&username=${sessionStorage.getItem('username')}&cs_ticket=${sessionStorage.getItem('csTicket')}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setListings(listings.filter((listing) => listing.id !== id));
      })
      .catch((error) => console.error("Error deleting listing:", error));
  };

  return (
    // Profile section
    <div className = "profile-container">
    <div className = "user-info">
      <h2>Profile</h2>
      <div className="user-details-grid">
        <div className="user-detail"><strong>Name:</strong> {sessionStorage.getItem('fullName')}</div>
        <div className="user-detail"><strong>Username:</strong> {sessionStorage.getItem('username')}</div>
        <div className="user-detail"><strong>Email:</strong> {email}</div>
        <div className="user-detail"><strong>Phone Number:</strong> {phone}</div>
      </div>
      <div className="edit-button-container">
        <button className="edit-details-button">Edit Details</button>
      </div>
    </div>

    {/* Listing Section */}
    <div className = "listing-section">
      <div className="listing-header">  {/* New flex container for title & button */}
      <h2 className="listing-title">Manage Your Listings</h2>
      <button className="create-listing-button" onClick={() => navigate(`/listing?user_id=${userId}`)}>
        Create New Listing
      </button>
      </div>

      {listings.length > 0? (
        <div className= "listing-grid">
        {listings.map((listing) => (
          <div key={listing.id} className="listing-card">
            <img src={listing.image} alt={listing.title}/>
          <h3>{listing.title}</h3>
          <p>{listing.price.toFixed(2)}</p>
          <div className="button-group">
          <button className="delete-button" onClick={() => deleteListing(listing.id)}>
          Delete
          </button>
          <button className="edit-button">
          Edit
          </button>
          </div>
          </div>
        ))}
        </div>
      ) : (
        <p>No listings yet!</p>
      )}
    </div>
  </div>
  );
};

export default Profile;