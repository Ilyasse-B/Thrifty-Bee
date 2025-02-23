import React, {useState} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import "./product.css"


const Product = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id, name, image, price, category, condition, description, user_id } = location.state || {};

    const [sellerInfo, setSellerInfo] = useState(null);
    const [showSeller, setShowSeller] = useState(false);
    const [buyNowError, setBuyNowError] = useState("");
    const [contactSellerError, setContactSellerError] = useState("");


    const fetchSellerInfo = async () => {
      const username = sessionStorage.getItem("username");
      if (!username) {
        setContactSellerError("You must be logged in to contact this seller");
        return;
      }
      
      setContactSellerError("");
      if (!showSeller) {
          try {
              const response = await fetch(`http://127.0.0.1:5000/get_seller_info?username=${sessionStorage.getItem('username')}`);
              const data = await response.json();
              if (response.ok) {
                  setSellerInfo(data.seller);
                  setShowSeller(true);
              } else {
                  console.error("Error fetching seller info:", data.message);
              }
          } catch (error) {
              console.error("Error fetching seller info:", error);
          }
      }
    };

    const handleBuyNow = () => {
      const username = sessionStorage.getItem("username");
      if (!username) {
        setBuyNowError("You must be logged in to Buy an item");
        return;
      }

      setBuyNowError("");
      navigate("/purchase", {
        state: {id, name, price, image}
      });
    };

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
        <button type="button" className="buy-btn contact" onClick={fetchSellerInfo}>Contact Seller</button>
        {contactSellerError && <p style={{ color: 'red' }}>{contactSellerError}</p>}

        {/* Display Seller Info */}
        {showSeller && sellerInfo && (
          <div id="seller-info">
            <h4>Seller Information:</h4>
            <p><strong>Name:</strong> {sellerInfo.first_name}</p>
            <p><strong>Email:</strong> {sellerInfo.email || "Not Provided"}</p>
            <p><strong>Phone:</strong> {sellerInfo.phone_number || "Not provided"}</p>
          </div>)}
        <h6 id="note">Contact the seller by clicking the button above if you would like to offer a new price</h6>
      </div>
    </div>
  )
}

export default Product