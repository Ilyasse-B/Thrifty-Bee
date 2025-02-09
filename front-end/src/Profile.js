import React, {useState, useEffect} from 'react';
import "./profile.css";

const Profile = () => {
  // Example user data - will need to be updated with information from CAS login
  const user = {
    id: 1,
    name: "John Smith",
    email: "john.smith@student.manchester.ac.uk",
  };

  //Example listings 
  const [listings, setListings] = useState([]);

  // Fetch user listings dynamically
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/user_listings?user_id=${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.listings) {
          setListings(data.listings);
        } else {
          console.error("No listings found");
        }
      })
      .catch((error) => console.error("Error fetching listings:", error));
  }, [user.id]);

  // Ability to delete listings on the profile page
  const deleteListing = (id) => {
    fetch(`http://127.0.0.1:5000/delete_listing/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setListings(listings.filter((listing) => listing.id !== id));
      })
      .catch((error) => console.error("Error deleting listing:", error));
  };

  return (
    <div className = "profile-container">
    <div className = "user-info">
      <h2>Profile</h2>
      <p><strong>Name: </strong>{user.name}</p>
      <p><strong>Email: </strong>{user.email}</p>
    </div>


    <div className = "listing-section">
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