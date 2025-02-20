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
        alt="about image"
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
              A campus-focused marketplace for students​.
            Enables students to buy, sell, or swap items directly with each other​.
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
            <div id="details">“Thrifty Bee" reflects affordability and community buzz as well as linking to Manchester’s Bee​</div>
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


      </div>
    </div>
  )
}

export default About