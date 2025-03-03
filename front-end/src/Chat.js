import React, { useState, useRef, useEffect } from 'react';
import './chat.css';
import { useLocation } from 'react-router-dom';
import Message from './Message';

const Chat = ({ currentUser }) => {
  const location = useLocation();
  const { chatId, listingName, otherPerson } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // This is mock messages, will need to be connected to messaging database in the future
    const mockMessages = [
      { id: 1, text: 'Hi. I am interested in buying your item', sender: 'example_user', timestamp: new Date(Date.now() - 100000) },
      { id: 2, text: 'Hi! How can I help? ', sender: 'example_user_two', timestamp: new Date(Date.now() - 80000) },
      { id: 3, text: 'I think you have priced the item too high. Can I offer £5', sender: 'example_user', timestamp: new Date(Date.now() - 60000) },
      { id: 4, text: 'Yes that is fine. Where should we meet to arrange payment?', sender: 'example_user_two', timestamp: new Date(Date.now() - 40000) }
    ];

    setMessages(mockMessages);
  }, []);

  // Setting to auto-scroll to the bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim() === '') return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: currentUser?.id || 'current_user', // Provide a fallback if currentUser is undefined
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  // formatting the time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      {/* Chat header */}
      <div className="chat-header">
        <h1>Chat with {otherPerson} for {listingName}</h1>
      </div>
      
      {/* Messages container */}
      <div className="messages-container">
        {messages.map((message) => {
          // Safe check if currentUser exists before accessing id
          const isCurrentUser = currentUser ? message.sender === currentUser.id : false;
          
          return (
            <Message 
              key={message.id}
              text={message.text}
              sender={message.sender}
              timestamp={formatTime(message.timestamp)}
              isCurrentUser={isCurrentUser}
            />
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
            placeholder="Type a message..."
            className="message-input"
          />
          <button 
            type="submit"
            className="send-button"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;