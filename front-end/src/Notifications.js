import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [activeChats, setActiveChats] = useState([]);
  const [inactiveChats, setInactiveChats] = useState([]);
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/user_chats?username=${username}`);
        const data = await response.json();

        if (data.chats) {
          const active = data.chats.filter(chat => chat.active);
          const inactive = data.chats.filter(chat => !chat.active);
          setActiveChats(active);
          setInactiveChats(inactive);
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
        {activeChats.length === 0 ? (
          <p>No chats available.</p>
        ) : (
          activeChats.map((chat, index) => (
            <div
              key={index}
              className="chat-item"
              onClick={() => navigate(`/chat`, { state: { 
                chatId: chat.chat_id,
                listingId: chat.listing_id,
                listingName: chat.listing_name, 
                otherPerson: chat.other_person,
                active: chat.active,
                just_contacting: chat.just_contacting
              }})}
            >
              <img src={chat.listing_image} alt={chat.listing_name} className="chat-image" />
              <span className="chat-product-name">{chat.listing_name}</span>
              <span className="chat-user">Chat with {chat.other_person}</span>
            </div>
          ))
        )}
      </div>
      <h2 className="notifications-title">Inactive Chats</h2>
      <div className="chats-list">
        {inactiveChats.length === 0 ? (
          <p>No inactive chats available.</p>
        ) : (
          inactiveChats.map((chat, index) => (
            <div
              key={index}
              className="chat-item inactive"
              onClick={() => navigate(`/chat`, { state: { 
                chatId: chat.chat_id,
                listingId: chat.listing_id,
                listingName: chat.listing_name, 
                otherPerson: chat.other_person,
                active: chat.active,
                just_contacting: chat.just_contacting
              }})}
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
