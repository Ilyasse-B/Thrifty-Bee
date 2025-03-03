import React, { useState, useRef, useEffect } from 'react';
import './chat.css';
import { useLocation } from 'react-router-dom';
import Message from './Message';

const Chat = ({ currentUser }) => {
  const location = useLocation();
  const { chatId, listingName, otherPerson } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [otherPersonId, setOtherPersonId] = useState(null);
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

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  return (
    <div className="chat-container">
      {/* Chat header */}
      <div className="chat-header">
        <h1>Chat with {otherPerson} for {listingName}</h1>
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