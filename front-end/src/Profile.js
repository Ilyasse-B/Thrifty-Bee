import React, {useState} from 'react';
import "./profile.css";
import CuttingBoard from "./assets/Image.png";

const Profile = () => {
  // Example user data - will need to be updated with information from CAS login
  const user = {
    name: "Example User",
    email: "example.user@manchester.ac.uk",
  };

  //Example listings 
  const [listings, setListings] = useState([
    {id: 1, title: "Item One", price: "£0.00", image: CuttingBoard},
    {id: 2, title: "Item Two", price: "£0.00", image: CuttingBoard },
    {id: 3, title: "Item Three", price: "£0.00", image: CuttingBoard},
  ]);

  // Ability to delete listings on the profile page
  const deleteListing = (id) => {
    setListings(listings.filter((listing) => listing.id !== id));
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
          <p>{listing.price}</p>
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