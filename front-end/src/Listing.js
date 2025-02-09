import React, { useState } from "react";
import "./listing.css";
import uploadIcon from "./assets/photoupload.png";

const CreateListing = () => {
  const [image, setImage] = useState(uploadIcon);
  const [category, setCategory] = useState(""); // New state for category
  const [condition, setCondition] = useState(""); // New state for condition

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  }

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

      <form className="form-container">
        {/* name label and text box */}
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Enter the Item Name" className="input" />
        </div>

        {/* price label and text box */}
        <div className="form-group price">
          <label>Price</label>
          <input type="text" placeholder="e.g £5" className="input" />
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
          <button className="submit-button">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default CreateListing;
