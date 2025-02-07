import React, { useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./AuthContext.js"; //import global auth state
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import "./profile.css";
import CuttingBoard from "./assets/Image.png";
import { useDispatch } from "react-redux";
import { toggle } from "./redux/slices/booleanSlice";
import { useSelector } from 'react-redux';


const Profile = ({GlobalState}) => {
  const dispatch = useDispatch();
  const booleanValue = useSelector((state) => state.boolean.value);

  //const { toggleLogin, isLoggedIn, updateEncryptedCsTicket, updateUserCredentials, username, fullName, encryptedCsTicket } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const secretKey = process.env.REACT_APP_APP_SECRET
  const {auth, setAuth} = GlobalState

  const fullNa = searchParams.get("fullname");
  const userNa = searchParams.get("username");
  const returnedCsTicket = searchParams.get('csticket') ?? 'default-value';
  const app_secret = searchParams.get("app_secret")

  const user = {
    name: fullNa,
    email: "example.user@manchester.ac.uk",
  };

  useEffect(() => {
     checkCredentials()

  },[])

  const checkCredentials =  async () => {
    try {
      if (!auth){
        const csTicketSession = sessionStorage.getItem("encryptedCsTicket")
        if (typeof csTicketSession != 'string'){
          throw new Error('session ticket not of type String')
        }
        const decryptedCsTicket = CryptoJS.AES.decrypt(csTicketSession, secretKey).toString(CryptoJS.enc.Utf8);
        const csTick = decryptedCsTicket

        if (csTick != returnedCsTicket){
          console.log(csTick)
          console.log(returnedCsTicket)
          console.log(secretKey,'here is secret')
          navigate('/')
          throw new Error('The csticket stored in session does not match')
       }
       setAuth(true)
     }  
     
      // console.log(returnedCsTicket)
      // console.log(secretKey,'here is secret')
      // toggleLogin() // Here we toggle login so that in all our other components we check if isLoggedIn is true if not we navigate them to the home page to lock them out
      // updateUserCredentials(userNa,fullNa)

      
    }catch (error){
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