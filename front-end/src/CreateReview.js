import React, {useState} from 'react'
import Chat from './Chat'
import "./createreview.css"
import StarContainer from './StarContainer'
import {useNavigate } from "react-router-dom";

const CreateReview = ({isBuyer, user_being_reviewed_id}) => {
    const [text, setText] = useState("");
    const [starArray, setStarArray] = useState([false,false,false,false,false])
    const navigate = useNavigate();

    const handleChange = (event) => {
        setText(event.target.value); // Updates state with user input
      };

    const getStars = () => {
        const count = starArray.filter(item => item === true).length;
        console.log(count)
        return count


    }



      const postReview = async () => {
        try {
            const response = await fetch(
                'http://127.0.0.1:5000/create_review',
                {
                    method: 'POST', // Use POST since you're creating a review
                    headers: {
                        'Content-Type': 'application/json',


                    },
                    body: JSON.stringify({
                        user_made_review_username: sessionStorage.getItem('username'),
                        rating: getStars(),
                        user_was_reviewed_id: user_being_reviewed_id,
                        description: text,
                        is_seller: isBuyer





                })
                }
            ).then(response => {
                if (response.ok){
                    const data = response.json()
                    console.log(data.message)

                }


            })

        } catch (error) {
            console.error(error);
        }
    };
    const handleSubmit = () => {
    postReview()
    alert(`Submitted Text: ${text}`); // Optional: Show alert with submitted text
    window.location.reload();
    };

    const starClick = (number) => {
        for (let index in starArray) {
            let star_val = starArray[index]

            if (index <= number){
                star_val = true
                setStarArray((prevStarArray)=>{
                    const newArray = [...prevStarArray];

                    // Modify the element at the specified index
                    newArray[index] = star_val;
                    console.log(newArray)

                    // Return the new array to update the state
                    return newArray;
                })
            }
            else  {
                star_val = false
                setStarArray((prevStarArray)=>{
                    const newArray = [...prevStarArray];

                    // Modify the element at the specified index
                    newArray[index] = star_val;
                    console.log(newArray)

                    // Return the new array to update the state
                    return newArray;
                })}}}

  return (
    <div id="chat-page-container">
        <div id="review-container">
            <h2>Rate John</h2>
            <div id="stars-container">
                <StarContainer number={0} starClick={starClick} fillStar={starArray[0]}/>
                <StarContainer number={1} starClick={starClick} fillStar={starArray[1]}/>
                <StarContainer number={2} starClick={starClick} fillStar={starArray[2]} />
                <StarContainer number={3} starClick={starClick} fillStar={starArray[3]}/>
                <StarContainer number={4} starClick={starClick} fillStar={starArray[4]}/>
            </div>
            <div id="input-container">
            <textarea id="description-input-field" placeholder="Type your description here!" value={text} onChange={handleChange}></textarea>
            </div>
            <button onClick={handleSubmit} id="review-submit-button">Submit</button>
        </div>
    </div>)}

export default CreateReview