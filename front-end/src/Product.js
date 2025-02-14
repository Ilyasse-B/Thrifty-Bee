import React, {useState} from 'react';
import { useLocation } from "react-router-dom";
import "./product.css"


const Product = () => {
    const location = useLocation();
    const { id, name, image, price, category, condition, description, user_id } = location.state || {};

    const [sellerInfo, setSellerInfo] = useState(null);
    const [showSeller, setShowSeller] = useState(false);

    const fetchSellerInfo = async () => {
      if (!showSeller) {
          try {
              const response = await fetch(`http://127.0.0.1:5000/get_seller_info?user_id=${user_id}`);
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

        <button type="button" className="buy-btn">Buy Now</button>
        <span>or</span>
        <button type="button" className="buy-btn contact" onClick={fetchSellerInfo}>Contact Seller</button>

        {/* Display Seller Info */}
        {showSeller && sellerInfo && (
          <div id="seller-info">
            <h4>Seller Information:</h4>
            <p><strong>Name:</strong> {sellerInfo.first_name}</p>
            <p><strong>Email:</strong> {sellerInfo.email || "Not Provided"}</p>
            <p><strong>Phone:</strong> {sellerInfo.phone_number || "Not provided"}</p>
          </div>)}
        <h6 id="note">Contact the seller by clicking the button above</h6>
      </div>
    </div>
  )
}

export default Product