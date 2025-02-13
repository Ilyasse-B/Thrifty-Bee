import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import "./product.css"
import logo from "./assets/logo.png";


const Product = () => {
    const [searchParams] = useSearchParams();
    const [id, setId] = useState(searchParams.get('id'))
  return (
    <div id ="product-main-con">
       <div id="image-con">
        <img src={logo} alt="product_image" id="image"/>
       </div>
       <div id="det-con">
        <h2 id="head">Product name</h2>
        <h4 id="sub">Sub Heading</h4>
        <h3 id="price">$10.99</h3>
        <h4 id="desc">Sellers Description</h4>
        <button type="button" className="buy-btn" >Buy Now</button>
        <a >or</a>
        <button type="button" className="buy-btn contact" >Contact Seller</button>
        <h6 id="note" >You can contact the seller to offer a new price</h6>
       </div>
    </div>
  )
}

export default Product