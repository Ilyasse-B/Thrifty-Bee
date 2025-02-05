import React from 'react'
import "./home.css"
import Item from "./Item";






export const Home = () => {
  return (
    <div >
        {/* <h1>Thrifty Bee</h1> */}
        <h1>Search Page</h1>
        <div id="all-product-container">
        <Item />
        <Item />
        <Item />
        <Item />
        </div>



    </div>

  )


}

export default Home


