import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SendNotifications.css';

const SendNotifications = ({ clientId, closeNotificationModal }) => {
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
        'https://localhost:7080/api/Owner/OwnerNotifications',
        notificationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponseMessage(`Notification sent: ${response.data}`);
      closeNotificationModal(); // Close the modal after sending notification
    } catch (error) {
      console.error('Error sending notification:', error);
      setResponseMessage('Failed to send notification.');
    }
  };

  return (
    <div>
      <h2 className='TiTeL'>Send Notification</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className='LabEle'>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className='LabEle'>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <div>
          <label className='LabEle'>Date:</label>
          <input
            type="datetime-local"
            value={new Date(date).toISOString().slice(0, 16)}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submitttt">Send Notification</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default SendNotifications;
