import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.scss';
import { marked } from 'marked';
import { Tooltip } from 'react-tooltip';

const API_URL = import.meta.env.VITE_API_URL;

const Chatbot = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there 👋\nHow can I help you today?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatBoxRef = useRef(null);

  // Check quiz status
  const quizStatus = JSON.parse(localStorage.getItem('quizDetails') || null)?.status;
  if (quizStatus === 'Ongoing') {
    return null; // Hide chatbot if quiz is ongoing
  }

  // Auto-scroll chatbox when a new message is added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle('show-chatbot', !isOpen);
  };

  // Send user message and handle backend response
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const trimmedMessage = inputMessage.trim();

    // Prevent sending empty messages
    if (!trimmedMessage) return;

    // Add user message to chat
    const userMessage = { sender: 'user', text: trimmedMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Send message to backend
      const response = await fetch(`${API_URL}/api/v1/questions/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (!response.ok) throw new Error('Failed to fetch chatbot response');

      const data = await response.json();
      const botReply = data.reply || "Sorry, I couldn't understand that.";
      const formattedReply = marked.parse(botReply);

      // Add bot message to chat
      const botMessage = { sender: 'bot', text: formattedReply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='chatbot-container'>
      <button id='toggle-bot' className='chatbot-toggler' onClick={toggleChatbot}>
        <span className='material-symbols-rounded'>mode_comment</span>
        <span className='material-symbols-outlined'>close</span>
      </button>
      <Tooltip anchorSelect='#toggle-bot' place='top' content='Chat with our AI Chatbot' />

      {isOpen && (
        <div className='chatbot'>
          <header>
            <span id='go-full' className='material-symbols-rounded go-full'>open_in_full</span>
            <h2>Chatbot</h2>
            <span id='close-bot' className='close-btn material-symbols-outlined' onClick={toggleChatbot}>close</span>
          </header>
          <Tooltip anchorSelect='#go-full' place='top' content='Open chatbot in full screen' />
          <Tooltip anchorSelect='#close-bot' place='top' content='Close chatbot' />

          <ul className='chatbox' ref={chatBoxRef}>
            {messages.map((msg, index) => (
              <li key={index} className={`chat ${msg.sender === 'user' ? 'outgoing' : 'incoming'}`}>
                {msg.sender === 'bot' && <span className='material-symbols-outlined'>smart_toy</span>}
                <p dangerouslySetInnerHTML={{ __html: msg.text }} />
              </li>
            ))}
            {loading && (
              <li className='chat incoming'>
                <span className='material-symbols-outlined'>smart_toy</span>
                <p><span className='loader-chatbot'></span></p>
              </li>
            )}
          </ul>

          <div className='chat-input'>
            <textarea
              placeholder='Enter a message...'
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
              required
            />
            <span id='send-btn' className='material-symbols-rounded' onClick={handleSendMessage}>send</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
