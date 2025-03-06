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
  const [isBuyer, setIsBuyer] = useState(null);
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
      
      const response = await fetch("http://127.0.0.1:5000/confirm_transaction", {
        method: "POST",
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
        // Add a system message to the chat
        const systemMessage = {
          id: Date.now(), // Temporary ID
          user_id: null, // System message has no user ID
          content: isBuyer 
            ? `${username} confirmed item was received.` 
            : `${username} confirmed payment was received.`,
          timestamp: new Date().toISOString(),
          is_system: true // Flag to style it differently if needed
        };
        
        setMessages(prevMessages => [...prevMessages, systemMessage]);
        
        // Disable the button after confirmation
        setIsBuyer(undefined);
      } else {
        console.error("Confirmation failed:", data.message);
        // You might want to show an error message to the user
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
        {isBuyer !== undefined && (
        <button onClick={handleConfirm} className="confirm-button">
            {isBuyer ? "Confirm Payment Received" : "Confirm Item Received"}
        </button>
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