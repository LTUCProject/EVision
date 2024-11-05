import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [message, setMessage] = useState('');

    const loadNotifications = async () => {
        try {
            const token = localStorage.getItem("token");
            const clientId = token ? JSON.parse(atob(token.split('.')[1])).id : null; // Ensure you extract the clientId correctly

            console.log('Fetching notifications for client ID:', clientId);

            const response = await axios.get(`https://localhost:7080/api/Clients/notifications/${clientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            // Check the response structure
            console.log('Notifications response:', response.data);
            
            // Access the array of notifications
            const notificationsArray = response.data?.$values || [];
            console.log('Raw notifications array:', notificationsArray); // Log raw notifications

            // Map through notifications and extract relevant properties
            const filteredNotifications = notificationsArray.map(notification => {
                console.log('Mapping notification:', notification); // Log each notification
                return {
                    notificationId: notification.notificationId,
                    title: notification.title,
                    message: notification.message,
                    date: notification.date
                };
            }).filter(notification => notification.title && notification.message && notification.date); // Filter valid notifications

            console.log('Filtered notifications:', filteredNotifications); // Log filtered notifications

            setNotifications(filteredNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
            setMessage('Failed to load notifications.');
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    return (
        <div className="notification-container">
            <h2>Notifications</h2>
            {message && <p className="error-message">{message}</p>}
            {notifications.length > 0 ? (
                <table className="notification-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Message</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map(notification => (
                            <tr key={notification.notificationId}>
                                <td>{notification.title}</td>
                                <td>{notification.message}</td>
                                <td>{new Date(notification.date).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No notifications available.</p>
            )}
        </div>
    );
};

export default Notification;