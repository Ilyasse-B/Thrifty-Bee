import React from 'react';
import './message.css';

const Message = ({ text, sender, timestamp, isCurrentUser }) => {
  return (
    <div className={`message-wrapper ${isCurrentUser ? 'current-user' : 'other-user'}`}>
      <p className="message-sender">{sender}</p>
      <div className={`message-bubble ${isCurrentUser ? 'current-user-bubble' : 'other-user-bubble'}`}>
        <p className="message-text">{text}</p>
        <p className="message-time">{timestamp}</p>
      </div>
    </div>
  );
};

export default Message;
