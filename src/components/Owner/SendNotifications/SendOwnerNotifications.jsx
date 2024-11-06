import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SendNotifications = ({ clientId, closeModal }) => {
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
      const token = localStorage.getItem("token");
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
      closeModal(); // Close the modal after sending notification
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
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default SendNotifications;