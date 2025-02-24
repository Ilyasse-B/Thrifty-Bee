import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./purchase.css"; // Import styles

const Purchase = () => {
  const location = useLocation();
  const { id, name, price, image } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("");

  const getInfoText = () => {
    if (paymentMethod === "Card") {
      return "Clicking Buy Now will prompt you to securely enter your card details.";
    } else if (paymentMethod === "Cash") {
      return "Clicking Buy Now will create a new chat with the seller where you can organise a cash payment.";
    } else {
      return "Select a payment option above to continue.";
    }
  };

  return (
    <>
      <header className="header">
        <h1>Complete Your Purchase</h1>
      </header>

      <div className="purchase-container">
        <div className="purchase-content">

          <img
            src= {image}
            alt={name}
            className="product-image"
          />

          <div className="product-details">
            <h2>{name || "Product Name"}</h2>
            <p className="price">£{price ? price.toFixed(2) : ""}</p>

            <label>Select Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-dropdown"
            >
              <option value="">Select Method</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>

            <button className="buy-button" disabled={!paymentMethod}>Buy Now</button>
            <p className="info-text">{getInfoText()}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Purchase;
