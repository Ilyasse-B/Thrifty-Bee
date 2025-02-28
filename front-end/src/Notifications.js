import React from 'react';
import { useNavigate } from 'react-router-dom';
import './notifications.css';

const Notifications = () => {
  const navigate = useNavigate();

  // Sample chat data (will be replaced with database data later)
  const chats = [
    {
      id: 1,
      productImage: 'https://via.placeholder.com/50', // Placeholder image
      productName: 'Vintage Leather Bag',
      userName: 'Alice Johnson',
    },
    {
      id: 2,
      productImage: 'https://via.placeholder.com/50', // Placeholder image
      productName: 'Wireless Headphones',
      userName: 'Michael Smith',
    },
  ];

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">Your Chats</h2>
      <div className="chats-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="chat-item"
            onClick={() => navigate('/chat')}
          >
            <img src={chat.productImage} alt={chat.productName} className="chat-image" />
            <span className="chat-product-name">{chat.productName}</span>
            <span className="chat-user">Chat with {chat.userName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
