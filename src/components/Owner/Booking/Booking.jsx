import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Booking.css';

const Booking = ({ stationId }) => {
    const [bookings, setBookings] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [newCost, setNewCost] = useState(0);
    const [isFetchingPending, setIsFetchingPending] = useState(false);

    useEffect(() => {
        if (stationId) {
            fetchBookings();
        }
    }, [stationId]);

    const fetchBookings = async () => {
        setIsFetchingPending(false);
        try {
            const response = await axios.get(`https://localhost:7080/api/Owner/station/${stationId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            
            const fetchedBookings = response.data.$values || [];
            setBookings(fetchedBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error("Failed to load bookings.");
        }
    };

    // New function to fetch pending bookings
    const fetchPendingBookings = async () => {
        setIsFetchingPending(true);
        try {
            const response = await axios.get(`https://localhost:7080/api/Owner/station/${stationId}/pending`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
    
            const fetchedPendingBookings = response.data.$values || [];
            setBookings(fetchedPendingBookings);
        } catch (error) {
            console.error('Error fetching pending bookings:', error);
            toast.error("Failed to load pending bookings.");
        }
    };
    

    const handleUpdate = async (bookingId) => {
        try {
            const response = await axios.put(`https://localhost:7080/api/Owner/${bookingId}`, {
                newStatus,
                newCost
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 204) {
                toast.success("Booking updated successfully!");
                fetchBookings(); // Refresh bookings after update
                closeModal(); // Close modal after update
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error("Failed to update booking.");
        }
    };

    const openModal = (booking) => {
        setSelectedBooking(booking);
        setNewStatus(booking.status); // Pre-fill current status
        setNewCost(booking.cost); // Pre-fill current cost
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedBooking(null);
        setNewStatus('');
        setNewCost(0);
    };

    return (
        <div className="booking-container">
            <h2 className="booking-title">Bookings for Station {stationId}</h2>
            <button onClick={isFetchingPending ? fetchBookings : fetchPendingBookings}>
                {isFetchingPending ? " All Bookings" : " Pending Bookings"}
            </button>
            {bookings.length > 0 ? (
                <ul className="booking-list">
                    {bookings.map(booking => (
                        <li key={booking.bookingId} className="booking-item">
                            <strong>Booking ID:</strong> {booking.bookingId} | 
                            <strong> Client ID:</strong> {booking.clientId} | 
                            <strong> Client Name:</strong> {booking.clientName} | 
                            <strong> Client Email:</strong> {booking.clientEmail} | 
                            <strong> Vehicle ID:</strong> {booking.vehicleId} | 
                            <strong> Vehicle Model:</strong> {booking.vehicleModel} | 
                            <strong> Start Time:</strong> {new Date(booking.startTime).toLocaleString()} | 
                            <strong> End Time:</strong> {new Date(booking.endTime).toLocaleString()} | 
                            <strong> Status:</strong> {booking.status} | 
                            <strong> Cost:</strong> ${booking.cost}
                            <button onClick={() => openModal(booking)}>Update Booking</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No bookings available for this station.</p>
            )}

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Update Booking</h2>
                        <input 
                            type="text" 
                            placeholder="New Status" 
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)} 
                        />
                        <input 
                            type="number" 
                            placeholder="New Cost" 
                            value={newCost}
                            onChange={(e) => setNewCost(e.target.value)} 
                        />
                        <button onClick={() => handleUpdate(selectedBooking.bookingId)}>Save Changes</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;