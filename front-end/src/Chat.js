import React, { useState, useRef, useEffect } from 'react';
import './chat.css';
import { useLocation } from 'react-router-dom';
import Message from './Message';
import CreateReview from './CreateReview';
import Review from './Review';

const Chat = ({ currentUser }) => {
  const location = useLocation();
  const { chatId, listingId, listingName, otherPerson, active = true, autoMessage, just_contacting = false } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [otherPersonId, setOtherPersonId] = useState(null);
  const [isBuyer, setIsBuyer] = useState(null);
  const [buyerConfirmed, setBuyerConfirmed] = useState(false);
  const [sellerConfirmed, setSellerConfirmed] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const autoMessageSent = useRef(false);
  const username = sessionStorage.getItem("username");

  // Fetch user and other person IDs
  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/get_chat_users?username=${username}&other_person_name=${otherPerson}`
        );
        const data = await response.json();

        if (data.user_id && data.other_person_id) {
          setUserId(data.user_id);
          setOtherPersonId(data.other_person_id);
        }
      } catch (error) {
        console.error("Error fetching user IDs:", error);
      }
    };

    if (username && otherPerson) {
      fetchUserIds();
    }
  }, [username, otherPerson]);

  // Fetch if user has already reviewed
  useEffect(() => {
    const checkIfReviewed = async () => {
      if (userId !== null && otherPersonId !== null) {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/see_if_reviewed?user_who_reviewed_id=${userId}&user_review_about_id=${otherPersonId}`
          );
          const data = await response.json();

          if (data.message === "Already Reviewed") {
            setAlreadyReviewed(true);
          }
        } catch (error) {
          console.error("Error checking review status:", error);
        }
      }
    };

    checkIfReviewed();
  }, [userId, otherPersonId]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/get_message_chat?chat_id=${chatId}`
        );
        const data = await response.json();

        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  // Sends auto message passed from Purchase.js into chat
  useEffect(() => {
    if (autoMessage && !autoMessageSent.current) {
      sendMessage(autoMessage);
      autoMessageSent.current = true;
    }
  }, [autoMessage]);

  const sendMessage = async (messageText) => {
    const timestamp = new Date().toISOString();
    const messageData = {
      chat_id: chatId,
      username: username,
      content: messageText,
      timestamp: timestamp,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/create_message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const updatedMessages = await fetch(`http://127.0.0.1:5000/get_message_chat?chat_id=${chatId}`);
        const data = await updatedMessages.json();
        if (data.messages) setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Check if user is buyer or seller
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        if (chatId) {
          const response = await fetch(
            `http://127.0.0.1:5000/get_chat_role?chat_id=${chatId}&username=${username}`
          );
          const data = await response.json();

          // Set isBuyer based on response
          if (data.status === 'success') {
            setIsBuyer(data.is_buyer);
            setBuyerConfirmed(data.buyer_confirmed);
            setSellerConfirmed(data.seller_confirmed);
          }
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };

    if (username && chatId) {
      checkUserRole();
    }
  }, [username, chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim() === '') return;

    // Create a timestamp in ISO format
    const timestamp = new Date().toISOString();

    const messageData = {
      chat_id: chatId,
      username: username,
      content: newMessage,
      timestamp: timestamp
    };

    try {
      // Send message to Flask backend
      const response = await fetch("http://127.0.0.1:5000/create_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Fetch messages again to update the chat with the new message
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/get_message_chat?chat_id=${chatId}`
          );
          const data = await response.json();

          if (data.messages) {
            setMessages(data.messages);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      await fetchMessages(); // Refresh chat after sending message

      setNewMessage(""); // Clear input field

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleConfirm = async () => {
    try {
      const confirmationType = isBuyer ? "item_received" : "payment_received";
      const response = await fetch("http://127.0.0.1:5000/edit_chat", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          username: username,
          confirmation_type: confirmationType
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Construct confirmation message
        const confirmationMessage = {
          chat_id: chatId,
          username: username, // Sender
          content: isBuyer
            ? "Buyer has confirmed that item has been received"
            : "Seller has confirmed that payment has been received",
          timestamp: new Date().toISOString()
        };

        // Send confirmation message to backend
      await fetch("http://127.0.0.1:5000/create_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmationMessage),
      });

      // Fetch updated messages to include confirmation message
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/get_message_chat?chat_id=${chatId}`
          );
          const data = await response.json();

          if (data.messages) {
            setMessages(data.messages);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      await fetchMessages(); // Refresh chat after sending confirmation message

        // If transaction is complete, send a final system message
      if (data.transaction_complete) {
        const completeMessage = {
          chat_id: chatId,
          username: "System", // This could be handled as a system message
          content: "Item sale complete.",
          timestamp: new Date().toISOString()
        };

        await fetch("http://127.0.0.1:5000/create_message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(completeMessage),
        });

        await fetchMessages(); // Refresh chat again to include final system message
      }

  } else {
      console.error("Confirmation failed:", data.message);
  }
} catch (error) {
  console.error("Error confirming transaction:", error);
}
  };

  return (
    <div className="chat-container">
      {/* Chat header */}
      <div className="chat-header">
        <h1>Chat with {otherPerson} for {listingName}</h1>
        {isBuyer !== undefined && (!just_contacting) && (
          (!isBuyer && !sellerConfirmed) || (isBuyer && !buyerConfirmed) ? (
          <button onClick={handleConfirm} className="confirm-button">
            {isBuyer ? "Confirm Item Received" : "Confirm Payment Received"}
          </button>
  ) : null
)}
      </div>

      {/* Messages container */}
      <div className="messages-container">
        {messages.map((message) => {
          const isCurrentUser = message.user_id === userId;

          return (
            <div
              key={message.id}
              className={`message-wrapper ${isCurrentUser ? 'current-user' : 'other-user'}`}
            >
              <Message
                text={message.content}
                sender={isCurrentUser ? "You" : otherPerson}
                timestamp={new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                isCurrentUser={isCurrentUser}
              />
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="message-input-container">
        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={active ? "Type a message..." : "This chat is now inactive"}
            className="message-input"
            disabled={!active}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!active}
          >
            Send
          </button>
        </form>
      </div>
      {!alreadyReviewed && (
        <CreateReview user_being_reviewed_id={otherPersonId} isBuyer={isBuyer}/>
      )}
      {listingId && otherPersonId !== null && isBuyer == false && (
        <Review listingId={listingId} userId={otherPersonId} isBuyerReview={true} />
      )}
    </div>
  );
};


export default Chat;
