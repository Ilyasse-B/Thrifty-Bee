import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./listing.css";
import uploadIcon from "./assets/photoupload.png";
import { useSearchParams } from "react-router-dom";

const CreateListing = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id"); // Extract user_id

  const [image, setImage] = useState(uploadIcon);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "thriftybee_temp"); // Set up in Cloudinary
    formData.append("cloud_name", "dcyac4u2x");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dcyac4u2x/image/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      setImage(data.secure_url); // Store public image URL
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image || image === uploadIcon) {
      setSuccessMessage("Please upload an image.");
      return;
    }

    const listingData = {
      username: sessionStorage.getItem('username'),
      listing_name: name,
      image: image,
      price: price,
      condition: condition,
      category: category,
      description: description,
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
          <textarea placeholder="Describe your item" className="textarea" value={description}
            onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>

        {/* Category Dropdown */}
        <div className="form-group category">
          <label>Category</label>
          <select className="input" value={category} onChange={(e) => {
            console.log("Selected Category:", e.target.value);
            setCategory(e.target.value)}}>
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
