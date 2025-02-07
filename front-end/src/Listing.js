import React, { useState } from "react";
import "./CreateListing.css";
import uploadIcon from "../assets/photoupload.png";

const CreateListing = () => {
  const [image, setImage] = useState(uploadIcon);

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

        {/* category label and text box */}
        <div className="form-group category">
          <label>Category</label>
          <input type="text" placeholder="e.g Clothing" className="input" />
        </div>

        {/* condition label and text box */}
        <div className="form-group condition">
          <label>Condition</label>
          <input type="text" placeholder="e.g Used" className="input" />
        </div>

        <div className="submit-button-container">
          <button className="submit-button">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default CreateListing;
