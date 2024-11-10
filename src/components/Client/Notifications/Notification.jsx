import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationDropdown = ({ clientId }) => {
    const [notifications, setNotifications] = useState([]);
    const [message, setMessage] = useState('');

    const loadNotifications = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`https://localhost:7080/api/Clients/notifications/${clientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const notificationsArray = response.data?.$values || [];
            const filteredNotifications = notificationsArray.map(notification => ({
                notificationId: notification.notificationId,
                title: notification.title,
                message: notification.message,
                date: notification.date
            })).filter(notification => notification.title && notification.message && notification.date);
            setNotifications(filteredNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
            setMessage('Failed to load notifications.');
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://localhost:7080/api/Clients/notification/${notificationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            // Update the notifications state after successful deletion
            setNotifications(prevNotifications => 
                prevNotifications.filter(notification => notification.notificationId !== notificationId)
            );
            setMessage('Notification deleted successfully!');
        } catch (error) {
            console.error('Error deleting notification:', error);
            setMessage('Failed to delete notification.');
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [clientId]);

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg z-10 max-h-64 overflow-y-auto p-4">
            <h3 className="font-semibold text-lg mb-2">Notifications</h3>
            {message && <p className="text-red-500">{message}</p>}
            {notifications.length > 0 ? (
                notifications.map(notification => (
                    <div key={notification.notificationId} className="p-2 border-b">
                        <p className="font-bold">{notification.title}</p>
                        <p>{notification.message}</p>
                        <span className="text-gray-500 text-sm">{new Date(notification.date).toLocaleString()}</span>
                        <button 
                            className="text-red-500 mt-2"
                            onClick={() => deleteNotification(notification.notificationId)}
                        >
                            Delete
                        </button>
                    </div>
                ))
            ) : (
                <p>No notifications available.</p>
            )}
        </div>
    );
};

export default NotificationDropdown;
