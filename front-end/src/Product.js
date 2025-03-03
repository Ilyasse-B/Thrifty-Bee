import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import "./product.css"
import Heart from './Heart.js';
import FavHeart from './FavHeart.js';
const Product = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id, name, image, price, category, condition, description, user_id } = location.state || {};

    const [sellerInfo, setSellerInfo] = useState(null);
    const [buyNowError, setBuyNowError] = useState("");
    const [contactSellerError, setContactSellerError] = useState("");
    const [isFavorited, setIsFavorited] = useState(false); // State to track favorite status from backend
    const [redirecting, setRedirecting] = useState(false); // State for redirect message

    const username = sessionStorage.getItem("username");

    // Fetch seller info when the page loads
    useEffect(() => {
      const fetchSellerInfo = async () => {
          try {
              const response = await fetch(`http://127.0.0.1:5000/get_seller_info?username=${username}`);
              const data = await response.json();
              if (response.ok) {
                  setSellerInfo(data.seller);
              } else {
                  console.error("Error fetching seller info:", data.message);
              }
          } catch (error) {
              console.error("Error fetching seller info:", error);
          }
      };

      if (username) {
          fetchSellerInfo();
      }
  }, [username]);

  const handleBuyNow = () => {
    if (!username) {
        setBuyNowError("You must be logged in to buy an item");
        return;
    }
    setBuyNowError("");
    navigate("/purchase", {
        state: { id, name, price, image }
    });
};

const handleContactSeller = async () => {
  if (!username) {
      setContactSellerError("You must be logged in to contact this seller");
      return;
  }

  setContactSellerError("");
  setRedirecting(true); // Show redirect message

  try {
      const response = await fetch("http://127.0.0.1:5000/create_chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listing_id: id, username }),
      });

      const data = await response.json();
      if (response.ok) {
          setTimeout(() => {
              navigate("/chat", {
                  state: {
                      chatId: data.chat_id,
                      listingName: name,
                      otherPerson: sellerInfo?.first_name
                  }
              });
          }, 2000); // Wait 2 seconds before redirecting
      } else {
          setContactSellerError("Failed to start chat");
          setRedirecting(false); // Hide redirect message on error
      }
  } catch (error) {
      console.error("Error creating chat:", error);
      setRedirecting(false); // Hide redirect message on error
  }
};

    const handleFav=() =>{
      setIsFavorited(!isFavorited)
      {/*make a request to toggle the isfavorited   */}
    }

  return (
    <div id="product-main-con">
      <div id="image-con">
        <img src={image} alt={name} id="image" />
      </div>
      <div id="det-con">
        <h2 id="head">{name}</h2>
        <h4 id="sub">Category: {category} <br></br> Condition: {condition}</h4>
        <h3 id="price">£{price.toFixed(2)}</h3>
        <h4 id="desc">Sellers Description</h4>
        <p>{description}</p>

        <button type="button" className="buy-btn" onClick={handleBuyNow}>Buy Now</button>
        {buyNowError && <p style={{ color: 'red' }}>{buyNowError}</p>}
        <span>or</span>
        <button type="button" className="buy-btn contact" onClick={handleContactSeller}>Contact Seller</button>
        {contactSellerError && <p style={{ color: 'red' }}>{contactSellerError}</p>}
        {redirecting && <p style={{ color: 'green' }}>Redirecting you to the chat page...</p>}

        {/* Seller Information Always Visible */}
        {sellerInfo && (
          <div id="seller-info">
            <h4>Seller Information:</h4>
            <p><strong>Name:</strong> {sellerInfo.first_name}</p>
            <p><strong>Email:</strong> {sellerInfo.email || "Not Provided"}</p>
            <p><strong>Phone:</strong> {sellerInfo.phone_number || "Not Provided"}</p>
          </div>
        )}

        {/* Favorite Button */}
        {username && (
                    <button
                        type="button"
                        className="fav-btn"
                        onClick={handleFav}/*make a request to toggle the isfavorited   */


                    >
                       {!isFavorited ? <Heart/>:<FavHeart/>}


                    </button>
                )}
        <h6 id="note">Contact the seller by clicking the button above if you would like to offer a new price</h6>
      </div>

    </div>
  )
}


export default Product