import React from 'react'
import "./about.css"
import aboutframe from "./assets/aboutframe.png"
import icon1 from "./assets/icon1.png"
import icon2 from "./assets/icon2.png"
import icon3 from "./assets/icon3.png"
import icon4 from "./assets/icon4.png"

const About = () => {
  return (
    <div id="mainContainer">
      <div id="aboutimagecon">
        <img
        src={aboutframe}
        alt="about"
        id="aboutimage"
        />
      </div>

      <div id="desc-con">
        <div id="desc-inner">
          <img
          src={icon1}
          alt='icon1'
          id="icon" />
          <div id="content">
            <div id="header">The Concept:</div>
            <div id="details">
              A campus-focused marketplace for students
            Enables students to buy, sell, or swap items directly with each other.
            </div>
          </div>
        </div>

        <div id="desc-inner">
          <div id="content">
            <div id="header">Key Features:</div>
            <div id="details">Listings for furniture, gadgets, and more​.
              Secure peer-to-peer communication and payments​.
              Easy-to-use platform designed with students in mind​</div>
          </div>
          <img
            src={icon2}
            alt='icon2'
            id="icon" />
        </div>

        <div id="desc-inner">
          <img
            src={icon3}
            alt='icon3'
            id="icon" />
            <div id="content">
              <div id="header">The Name:</div>
              <div id="details">"Thrifty Bee" reflects affordability and community buzz as well as linking to Manchester's Bee​</div>
            </div>
        </div>

        <div id="desc-inner">
          <div id="content">
              <div id="header">Vision:</div>
              <div id="details">To create a platform that's accessible, sustainable, and community-driven</div>
          </div>
          <img
            src={icon4}
            alt='icon4'
            id="icon" />
        </div>

        {/* Selling Section */}
        <div id="selling-section">
          <div id="selling-header">
            <h2>Selling on Thrifty Bee</h2>
          </div>
          
          <div id="selling-content">
            <div id="selling-guidelines">
              <h3>Community Guidelines:</h3>
              <ul>
                <li>Be honest about item condition and defects</li>
                <li>Use clear and well-lit photos of actual items</li>
                <li>Honor agreed-upon prices and meeting arrangements</li>
                <li>Meet in safe, public locations such as University Buildings for item/cash exchanges</li>
                <li>Respect other community members</li>
                <li>No selling of prohibited items (see below)</li>
              </ul>
            </div>
            
            <div id="seller-requirements">
              <h3>Seller Requirements:</h3>
              <ul>
                <li>Must be a verified student with a valid university email</li>
                <li>Complete profile with accurate contact information</li>
                <li>Agree to our terms of service and community standards</li>
                <li>Maintain a minimum seller rating of 3 stars after a minimum of 10 items sold</li>
                <li>Report any issues or inappropriate behavior to our moderator team</li>
              </ul>
            </div>
            
            <div id="prohibited-items">
              <h3>Prohibited Items:</h3>
              <ul>
                <li>Weapons, explosives, or dangerous/illegal items</li>
                <li>Prescription medications or drugs</li>
                <li>Counterfeit or stolen items</li>
                <li>Adult content</li>
                <li>Animals</li>
                <li>Items that violate intellectual property rights</li>
              </ul>
            </div>
            
            <div id="getting-started">
              <h3>Getting Started:</h3>
              <p>Ready to sell? Click the "Create New Listing" button in your profile to create your first listing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About