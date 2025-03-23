import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [activeChats, setActiveChats] = useState([]);
  const [inactiveChats, setInactiveChats] = useState([]);
  const [moderatorReplies, setModeratorReplies] = useState([]);
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

    const fetchModeratorReplies = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/fetch_contacts_user?username=${username}`);
        const data = await response.json();
        
        if (data.Contacts) {
          setModeratorReplies(data.Contacts);
        }
      } catch (error) {
        console.error("Error fetching moderator replies:", error);
      }
    };

    if (username) {
      fetchChats();
      fetchModeratorReplies();
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

      {/* Moderator Replies */}
      <h2 className="notifications-title">Moderator Replies</h2>
      <p className="moderator-description">See replies from moderators to your Contact Us submissions</p>
      <div className="moderator-replies">
        {moderatorReplies.length === 0 ? (
          <p>No replies from moderators yet.</p>
        ) : (
          moderatorReplies.map((reply, index) => (
            <div key={index} className="moderator-reply-container">
              <p className="moderator-subtitle">You told us:</p>
              <p className="moderator-reason">"{reply.reason}"</p>
              <p className="moderator-subtitle">And a moderator has replied:</p>
              <p className="moderator-response">"{reply.moderator_response}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
