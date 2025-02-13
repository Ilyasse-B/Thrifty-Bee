import React from 'react';
import { useLocation } from "react-router-dom";
import "./product.css"


const Product = () => {
    const location = useLocation();
    const { id, name, image, price } = location.state || {};
  return (
    <div id="product-main-con">
      <div id="image-con">
        <img src={image} alt={name} id="image" />
      </div>
      <div id="det-con">
        <h2 id="head">{name}</h2>
        <h4 id="sub">Subheading here will show category and condition</h4>
        <h3 id="price">£{price.toFixed(2)}</h3>
        <h4 id="desc">Sellers Description</h4>
        <button type="button" className="buy-btn">Buy Now</button>
        <a>or</a>
        <button type="button" className="buy-btn contact">Contact Seller</button>
        <h6 id="note">This button (for now) cold display the seller's phone number and email address. You can contact the seller to offer a new price</h6>
      </div>
    </div>
  )
}

export default Product