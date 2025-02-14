import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./editproduct.css";

const EditProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { listing } = location.state || {};
  const {
    id: listing_id,
    title: listing_name,
    image,
    price,
    description,
    condition,
    category,
  } = listing || {};

  const [newImage, setNewImage] = useState(image);
  const [name, setName] = useState(listing_name);
  const [newPrice, setNewPrice] = useState(price);
  const [newDescription, setNewDescription] = useState(description);
  const [newCondition, setNewCondition] = useState(condition);
  const [newCategory, setNewCategory] = useState(category);
  const [statusMessage, setStatusMessage] = useState("");

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "thriftybee_temp"); // Cloudinary preset
    formData.append("cloud_name", "dcyac4u2x");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dcyac4u2x/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setNewImage(data.secure_url); // Store public image URL
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSaveChanges = async () => {
    const updatedData = {
      listing_name: name,
      listing_image: newImage,
      listing_price: newPrice,
    };

    try {
      const response = await fetch(`http://127.0.0.1:5000/edit_listing/${listing_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      setStatusMessage("Item details updated, re-directing you to your Dashboard");

      setTimeout(() => {
        navigate("/profile");
      }, 3000); // Redirect after 3 seconds

    } catch (error) {
      console.error("Error updating listing:", error);
      setStatusMessage("Failed to update item. Please try again.");
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>

      {/* Image Preview */}
      <div className="image-container">
        <img src={newImage} alt="Product" className="product-image" />
        <label htmlFor="image-upload" className="change-image-button">
          Change Image
        </label>
        <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} />
      </div>

      {/* Editable Fields */}
      <div className="form-group">
        <label>Item Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Furniture">Furniture</option>
          <option value="Books">Books</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Condition</label>
        <select value={newCondition} onChange={(e) => setNewCondition(e.target.value)}>
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Used">Used</option>
          <option value="For Parts">For Parts</option>
        </select>
      </div>

      {/* Save Button */}
      <button className="save-changes-button" onClick={handleSaveChanges}>Save Changes</button>
      {statusMessage && <p className="success-message">{statusMessage}</p>}
    </div>
  );
};

export default EditProduct;
