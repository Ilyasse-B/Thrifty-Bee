import React, {useState} from 'react'
import Chat from './Chat'
import "./chat.css"
import StarContainer from './StarContainer'

const ChatPage = () => {
    const [text, setText] = useState("");
    const [starArray, setStarArray] = useState([false,false,false,false,false])


    const handleChange = (event) => {
        setText(event.target.value); // Updates state with user input
      };
    const handleSubmit = () => {
    console.log("Submitted Text:", text); // Logs the textarea value
    alert(`Submitted Text: ${text}`); // Optional: Show alert with submitted text
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


                })


            }

        }



    }
  return (


    <div id="chat-page-container">
        <Chat/>
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

    </div>
  )
}

export default ChatPage