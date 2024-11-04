import React, { useEffect, useState } from 'react';

const Notifications = ({ clientId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`https://localhost:7080/api/Clients/notifications/${clientId}`, {
          method: 'GET',
          headers: {
            'Accept': 'text/plain',
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Replace with your actual token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data.$values);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [clientId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  
  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification.notificationId}>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <p><strong>Date:</strong> {new Date(notification.date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
