import React, { useState,useEffect } from 'react';
import ServerList from './ServerList';
import './home.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello!', sender: 'user' },
    { text: 'Hi there!', sender: 'bot' },
    { text: 'How are you?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
    }
  };
  useEffect(() => {
    console.log("Hello there");
  });
  return (
    <div className='baseClass'>
      <div className='serverList'>
        <ServerList/>
      </div>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'user' ? 'sent' : 'received'}`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <form className="message-form" onSubmit={handleMessageSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
