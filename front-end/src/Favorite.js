//This is a single item component used in the search / home page
import React, { use } from 'react'
import "./item.css"
import { useNavigate } from "react-router-dom";

const  Favorite= ({id, name, image, price, category, condition, description, user_id}) => {
  const navigate = useNavigate();

  const handleClick = () => {
  navigate("/product", {
    state: { id, name, image, price, category, condition, description, user_id },
  });
  };
  return (
    <div className="item-main-container">
      <img src={image} alt={name} id="only-image"/>
      <h4 id="product-text">{name}</h4>
      <div className="item-main-container inner">
        <h5 className="Description-text">{category} | {condition}</h5>
        <div id="btnsdiv">
        <button type="button" id="see-more-btn" onClick={handleClick}>See more</button>
        <button type="button" id="see-more-btn" >Remove</button>  {/*this needs to make a delete request to delete the specific favorite for the user  */}

        </div>
        <h5 className="Description-text bold">£{price.toFixed(2)}</h5>
      </div>
    </div>
  );
};

export default Favorite;
