import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./listing.css";
import uploadIcon from "./assets/photoupload.png";

const CreateListing = () => {
  const [image, setImage] = useState(uploadIcon);
  const [category, setCategory] = useState(""); // New state for category
  const [condition, setCondition] = useState(""); // New state for condition
  const [imageFile, setImageFile] = useState(null); // Store file for later upload
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl); // Show preview
      setImageFile(file); // Store file for upload
    }
  }

  // Simulated function to "upload" the image and get a URL
  const uploadImageAndGetURL = async () => {
    if (!imageFile) return null;
    
    // Simulate an image upload by returning a placeholder URL
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://example.com/uploads/${imageFile.name}`);
      }, 1000);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Upload the image first
    const imageURL = await uploadImageAndGetURL();
    if (!imageURL) {
      setSuccessMessage("Error uploading image.");
      return;
    }

    const listingData = {
      user_id: 1, // Static for now
      listing_name: name,
      image: imageURL, // Pass uploaded image URL
      price: price,
    };

    try {
      const response = await fetch("http://localhost:5000/create_listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });

      if (response.ok) {
        setSuccessMessage("Item uploaded successfully, redirecting to Dashboard...");
        
        // Wait 3 seconds then redirect to Profile.js
        setTimeout(() => {
          navigate("/profile");
        }, 3000);
      } else {
        setSuccessMessage("Error uploading item. Please try again.");
      }
    } catch (error) {
      setSuccessMessage("Failed to connect to server.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Create Your Listing</h1>
      <p className="subtitle">Click the image to upload a photo</p>

      {/* image upload */}
      <div className="image-upload-container">
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <img
          src={image}
          alt="Upload Icon"
          className="upload-image"
          onClick={() => document.getElementById("fileInput").click()}
        />
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        {/* name label and text box */}
        <div className="form-group">
          <label>Name</label>
          <input 
          type="text" placeholder="Enter the Item Name" className="input" 
          value = {name}
          onChange={(e) => setName(e.target.value)}
            required/>
        </div>

        {/* price label and text box */}
        <div className="form-group price">
          <label>Price</label>
          <input type="text" placeholder="e.g £5" className="input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required/>
        </div>

        {/* description label and text box */}
        <div className="form-group description">
          <label>Description</label>
          <textarea placeholder="Describe your item" className="textarea"></textarea>
        </div>

        {/* Category Dropdown */}
        <div className="form-group category">
          <label>Category</label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Condition Dropdown */}
        <div className="form-group condition">
          <label>Condition</label>
          <select className="input" value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="">Select a condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Used">Used</option>
            <option value="For Parts">For Parts</option>
          </select>
        </div>

        <div className="submit-button-container">
          <button className="submit-button" type="submit">Submit</button>
        </div>

        {/* Success Message */}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  )
}

export default CreateListing;
