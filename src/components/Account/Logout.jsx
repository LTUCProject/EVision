import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const username = localStorage.getItem('username'); // Ensure you save the username during login
        await axios.post('https://localhost:7080/api/Account/Logout', { username }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        localStorage.removeItem('token'); // Clear token
        localStorage.removeItem('username'); // Clear username
        localStorage.removeItem('roles'); // Clear roles

        onLogout(); // Call the logout function passed as a prop
        navigate('/'); // Redirect to home or any other page
        window.location.reload(); // Refresh the page
      } catch (error) {
        alert('Logout failed: ' + (error.response?.data?.message || 'Server error'));
      }
    };

    handleLogout();
  }, [navigate, onLogout]);

  return null; // No UI needed, just redirecting
};

export default Logout;
