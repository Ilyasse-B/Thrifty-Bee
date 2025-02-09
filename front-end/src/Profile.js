import React, { useEffect, useState, useRef} from 'react'
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import CuttingBoard from "./assets/Image.png";








const Profile = () => {
     // This is where a user will be brought to after logging in since it this page is spceified as the location
     // to bring the users credentials when they have logged in successfully


      const [searchParams] = useSearchParams();
      const navigate = useNavigate();






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

      fetchData(fullName, username, csTicket);


  }
  //--> In this case we assume the user is comming from the uni api, the api gives user data in query parameters
  else{
    const fullName = searchParams.get("fullname") || "Full Name";
    const username = searchParams.get("username") || "Username";
    const csTicket = searchParams.get('csticket') || 'default-value';

    sessionStorage.setItem('fullName', fullName)
    sessionStorage.setItem('username', username)
    sessionStorage.setItem('csTicket', csTicket)

    fetchData(fullName,username,csTicket);
  }


  },[]) // ---> DEPENDENCY ARRAY-empty so that we only check on the initial  data


  // This function is mimicking(it is just an example; fetch to the route you want) a fetch to a protected route; if it goes through successfuly we know that the
  // the user is logged in
  const fetchData =  async (fullName,username,csTicket) => {


    try {
      const response = await fetch(`http://127.0.0.1:5000/protected?full_name=${fullName}&username=${username}&cs_ticket=${csTicket}`)
      if (response.status == 401){ // 401 means not authorised so jump
        throw new Error('User Not Authorised') // jump to catch skip the rest of the code

      }
      if (response.status == 500){
        throw new Error('Internal Server Error: Try again later') // This should not happen and debugging on the backend would need to be done
                                                                  // on the server
      }

      const data = await response.text();






    }catch (error){
      // Take the user back to the home page they are not authorised
      navigate('/')
      console.error(error)
    }

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
      <p><strong>Name: </strong>{sessionStorage.getItem('fullName')}</p>
      <p><strong>Email: </strong>firstName.lastname@student.manchester.ac.uk</p>
      Are you
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