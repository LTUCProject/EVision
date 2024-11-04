import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationDropdown = ({ clientId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadClientNotifications = async () => {
    try {
      const response = await axios.get(`https://localhost:7080/api/Clients/notifications/${clientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
          "Content-Type": "application/json",
        },
      });
      setNotifications(response.data.$values || []); // Adjust according to your API response structure
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientNotifications();
  }, [clientId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-20">
      <div className="p-4">
        <h3 className="font-bold">Notifications</h3>
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.notificationId} className="p-2 border-b">
              <h4 className="font-semibold">{notification.title}</h4>
              <p>{notification.message}</p>
              <small>{new Date(notification.date).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
