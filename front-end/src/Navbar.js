//This will be a navigation bar component used on all pages
import "./navbar.css";
// import { useAuth } from "./AuthContext.js"; //import global auth state
import React, {useState, useEffect} from 'react'
import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./assets/logo.png";




const Navbar = () => {
  const [auth, setAuth] = useState(false)
  const navigate = useNavigate();


  // The useEffect hook make sure that the function inside of it runs only on the first render and any time auth
  // changes because the dependency array contains auth
  useEffect(() => {
    const fullName = sessionStorage.getItem('fullName') || 'Name';
    const username = sessionStorage.getItem('username') || 'username'
    const csTicket = sessionStorage.getItem('csTicket') || 'csticket';
    fetchData(fullName,username,csTicket)


  },[auth]) // ---> DEPENDENCY ARRAY-contains auth so that when at any point if auth changes we check whether the person
            //      is logged in.

  const fetchData =  async (fullName,username,csTicket) => {

    // This function will run when the user clicks the login btn and will take them to the manchester login page
    // I request to the protected rout because if it comes back successul then I know the user is logged in
    try {
      const response = await fetch(`http://127.0.0.1:5000/protected?full_name=${fullName}&username=${username}&cs_ticket=${csTicket}`)
      if (response.status == 401){
        setAuth(false) // set auth to be false because this means the user is not logged in
        throw new Error('User Not Authorised')

      }
      if (response.status == 500){
        setAuth(false) // set auth to be false because this means the user is not logged in
        throw new Error('Internal Server Error: Try again later') // This should not happen and debugging on the backend would need to be done
                                                                  // on the server
      }

      const data = await response.text();
      setAuth(true)
      navigate(`/profile`)






    }catch (error){
      navigate('/')
      console.error(error)
    }

  };





  const location = useLocation(); // Get current page


  // Function to force reload to a given page
  const handleNavigation = (path) => {
    if (location.pathname === path) {
      navigate(path, { replace: true }); // Force reload Home
    } else {
      navigate(path);
    }
  };

  const authenticateViaCAS =  async () => {
    // This function will run when the user clicks the login btn and will take them to the manchester login page
    try {
      const response = await fetch("http://127.0.0.1:5000/intiate_login")
      if (!response.ok){

        throw new Error('Failed to authenticate user, check the flask server because this is not meant to happen')

      }

      const data = await response.json();
      const redirect_url = data.auth_url



      window.location = redirect_url

    }catch (error){
      console.error(error)
    }

  };

  return (
    <nav className = "navbar">
      {/* Left Side - Brand */}
      <div className="nav-left">
        <img src={logo} alt="Thrifty Bee Logo" className="logo" />
        <span className="brand">Thrifty Bee</span>
      </div>

      {/* Right Side - Navigation Links */}
      <div className="nav-right">
        <button className="nav-button">Help</button>
        <button className="nav-button" onClick={() => handleNavigation("/listing")}>Listing (Temporary)</button>
        <button className="nav-button" onClick={() => handleNavigation("/")}>Search</button>
        <button className="login-button" onClick={() => {
          if (!auth){ // The login button should authenticate the user(send them to uom's login page) only when auth is false
            authenticateViaCAS()
            // toggleLogin(); I have removed this so that we only toggle when the person has successfuly loged in. Look at Profile.js line 25
          } else{
            navigate(`/profile`)
          }

          }}>
          {auth ? "Dashboard" : "Login"}
        </button>
      </div>

    </nav>
  )
}

export default Navbar