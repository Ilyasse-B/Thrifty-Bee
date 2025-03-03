//This is a single item component used in the search / home page
import React, { useState } from 'react'
import "./item.css"
import { useNavigate } from "react-router-dom";

const  Favorite= ({id, name, image, price, category, condition, description, user_id, toggleRender}) => {
  const navigate = useNavigate();


  const handleClick = () => {
  navigate("/product", {
    state: { id, name, image, price, category, condition, description, user_id },
  });
  };

  const delFav= async () =>{
    const username = sessionStorage.getItem('username')
    const csTick = sessionStorage.getItem('csTicket')
    const fullName = sessionStorage.getItem('fullName')

    const response = await fetch(`http://127.0.0.1:5000/delete_favourites/${username}/${id}?username=${username}&cs_ticket=${csTick}&full_name=${fullName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response.status)
      return response.text()


    })
    .then(text => {
      const data = JSON.parse(text.trim())
      console.log(data.message)
      toggleRender()




    })
    .catch(error => console.error(error))




  }
  return (
    <div className="item-main-container">
      <img src={image} alt={name} id="only-image"/>
      <h4 id="product-text">{name}</h4>
      <div className="item-main-container inner">
        <h5 className="Description-text">{category} | {condition}</h5>
        <div id="btnsdiv">
        <button type="button" id="see-more-btn" onClick={handleClick}>See more</button>
        <button type="button" id="see-more-btn" onClick={delFav}>Remove</button>  {/*this needs to make a delete request to delete the specific favorite for the user  */}

        </div>
        <h5 className="Description-text bold">£{price.toFixed(2)}</h5>
      </div>
    </div>
  );
};

export default Favorite;
