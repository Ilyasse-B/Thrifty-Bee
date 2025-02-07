import React, { useEffect } from 'react'
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./AuthContext.js"; //import global auth state
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';


const Profile = () => {
  const { toggleLogin, isLoggedIn, updateEncryptedCsTicket, updateUserCredentials, username, fullName, encryptedCsTicket } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const secretKey = process.env.REACT_APP_APP_SECRET

  const fullNa = searchParams.get("fullname");
  const userNa = searchParams.get("username");
  const returnedCsTicket = searchParams.get('csticket')

  useEffect(() => {
     checkCredentials()

  },[])

  const checkCredentials =  async () => {
    try {
      if (returnedCsTicket == null){
        console.log(returnedCsTicket)
        console.log(secretKey,'here is secret')
        navigate('/')
        throw new Error('csTicket Not provided')
     }





      const decryptedCsTicket = CryptoJS.AES.decrypt(sessionStorage.getItem("encryptedCsTicket"), secretKey).toString(CryptoJS.enc.Utf8);
      const csTick = decryptedCsTicket


      if (csTick != returnedCsTicket){
         console.log(csTick)
         console.log(returnedCsTicket)
         console.log(secretKey,'here is secret')
         navigate('/')
         throw new Error('The csticket stored in session does not match')
      }


      console.log(returnedCsTicket)
      console.log(secretKey,'here is secret')
        toggleLogin() // Here we toggle login so that in all our other components we check if isLoggedIn is true if not we navigate them to the home page to lock them out
        updateUserCredentials(userNa,fullNa)




    }catch (error){
      console.error(error)
    }

  };

  return (
    <div>
        {returnedCsTicket + 'hello'}
        Profile

    </div>
  )
}

export default Profile