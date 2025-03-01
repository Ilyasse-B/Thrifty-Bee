import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/user_chats?username=${username}`);
        const data = await response.json();
        
        if (data.chats) {
          setChats(data.chats);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    if (username) {
      fetchChats();
    }
  }, [username]);

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">Your Chats</h2>
      <div className="chats-list">
        {chats.length === 0 ? (
          <p>No chats available.</p>
        ) : (
          chats.map((chat, index) => (
            <div
              key={index}
              className="chat-item"
              onClick={() => navigate('/chat')}
            >
              <img src={chat.listing_image} alt={chat.listing_name} className="chat-image" />
              <span className="chat-product-name">{chat.listing_name}</span>
              <span className="chat-user">Chat with {chat.other_person}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
