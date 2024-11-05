import React, { useState } from 'react';
import axios from 'axios';

const SendNotifications = () => {
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [responseMessage, setResponseMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const notificationData = {
      clientId: parseInt(clientId),
      title,
      message,
      date,
    };

    try {
         // Retrieve the token from localStorage
    const token = localStorage.getItem("token"); // Ensure this matches your token storage key

    const response = await axios.post(
      'https://localhost:7080/api/Servicer/ServicerNotifications',
      notificationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    setResponseMessage(`Notification sent: ${response.data}`);
    } catch (error) {
      console.error('Error sending notification:', error);
      setResponseMessage('Failed to send notification.');
    }
  };

  return (
    <div>
      <h2>Send Notification</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Client ID:</label>
          <input
            type="number"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="datetime-local"
            value={new Date(date).toISOString().slice(0, 16)}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Notification</button>
      </form>
      {responseMessage && <p>Sent suceesfully</p>}
    </div>
  );
};

export default SendNotifications;
