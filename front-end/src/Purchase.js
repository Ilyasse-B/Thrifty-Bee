import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./purchase.css"; // Import styles

const Purchase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, name, price, image, sellerName } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("");


  const [fullName, setFullName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const getInfoText = () => {
    if (paymentMethod === "Card") {
      return "Please enter your card details above to proceed.";
    } else if (paymentMethod === "Cash") {
      return "Clicking Buy Now will create a new chat with the seller where you can organise a cash payment.";
    } else {
      return "Select a payment option above to continue.";
    }
  };

  const handleBuyNow = async () => {
    if (paymentMethod !== "Cash" && paymentMethod!== "Card") return; // Do nothing if no valid payment method

    try {
      // Create payment info
      const paymentResponse = await fetch("http://127.0.0.1:5000/create_payment_info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: id,
          username_bought: sessionStorage.getItem("username"),
          payment_type: paymentMethod,
        }),
      });
  
      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        console.error("Error creating payment:", errorData.message);
        return; // Stop execution if payment fails
      }

      // Create Chat
      const response = await fetch("http://127.0.0.1:5000/create_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: id, username: sessionStorage.getItem("username"), set_pending: true, just_contacting: false }),
      });

      const data = await response.json();
      if (response.ok && data.chat_id) {
        const autoMessage = paymentMethod === "Cash"
        ? "Hi, I'd like to buy this item with cash, when and where can we meet to pick up and pay for the item?"
        : "Hi, I've paid for this item with card, please confirm if you have received the payment. When and where can we meet to pick up the item?";

      // Redirect to chat page with autoMessage
      navigate("/chat", {
        state: {
          chatId: data.chat_id,
          listingId: id,
          listingName: name,
          otherPerson: sellerName,
          autoMessage: autoMessage,
          just_contacting: false
        },
      });
    } else {
      console.error("Error creating chat:", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <>
      <header className="header">
        <h1>Complete Your Purchase</h1>
      </header>

      <div className="purchase-container">
        <div className="purchase-content">
          <img src={image} alt={name} className="product-image" />

          <div className="product-details">
            <h2>{name || "Product Name"}</h2>
            <p className="info-text">Item by {sellerName}</p>
            <p className="price">£{price ? price.toFixed(2) : ""}</p>

            <label>Select Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="payment-dropdown">
              <option value="">Select Method</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>

            {/* Show card details form */}
            {paymentMethod === "Card" && (
              <div className="card-details">
                <label>Full Name (On Card):</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required />

                <label>Card Number:</label>
                <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" required />

                <div className="card-info">
                  <div>
                    <label>Expiry Date:</label>
                    <input type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="MM/YY" required />
                  </div>

                  <div>
                    <label>CVV:</label>
                    <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123"  required />
                  </div>
                </div>
              </div>
            )}

            <button className="buy-button" disabled={!paymentMethod} onClick={handleBuyNow}>
              Buy Now
            </button>
            <p className="info-text">{getInfoText()}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Purchase;