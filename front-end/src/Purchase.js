import React, { useState } from "react";
import "./purchase.css"; // Import styles

const Purchase = () => {
  const [paymentMethod, setPaymentMethod] = useState("");

  return (
    <>

      <header className="header">
        <h1>Complete Your Purchase</h1>
      </header>


      <div className="purchase-container">
        <div className="purchase-content">

          <img
            src="https://cdn3.iconfinder.com/data/icons/photo-tools/65/upload-1024.png"
            alt="Product"
            className="product-image"
          />


          <div className="product-details">
            <h2>Product Name</h2>
            <p className="price">£</p>


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


            <button className="buy-button">Buy Now</button>
            <p className="info-text">
              Clicking Buy Now will take you to an external page where you can complete the purchase securely.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Purchase;
