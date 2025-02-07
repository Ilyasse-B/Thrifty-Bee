//This is a single item component used in the search / home page
import React from 'react'
import "./item.css"
import item_image from './assets/Image.png';
const Item = () => {
  return (
    <div className="item-main-container">
      <img src={item_image} alt="item image" id="only-imgage"/>
      <h4 id="product-text">
        Product
      </h4>
      <div className="item-main-container inner">
      <h5 className="Description-text">
        Description
      </h5>
      <button type="button" id="see-more-btn">
        See more

      </button>
      <h5 className="Description-text bold" >
       £7.50
      </h5>
      </div>



    </div>
  );
};

export default Item;
