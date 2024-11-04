import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const username = localStorage.getItem('username');
        await axios.post(
          'https://localhost:7080/api/Account/Logout',
          { username },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        // Clear session data
        localStorage.clear();

        onLogout(); // Update authentication state
        console.log('Logging out and navigating to home...');
        navigate('/'); // Redirect to home page
   
      } catch (error) {
        alert('Logout failed: ' + (error.response?.data?.message || 'Server error'));
      }
    };

    handleLogout();
  }, [navigate, onLogout]);

  return null;
};

export default Logout;
