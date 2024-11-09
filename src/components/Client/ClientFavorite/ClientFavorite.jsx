import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiRequest = async (method, url, data = null) => {
  const options = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    data,
  };

  try {
    const response = await axios(options);
    return response.data.$values;
  } catch (error) {
    console.error('Error with API request:', error);
    toast.error(error.response?.data?.message || "Server error");
    throw error;
  }
};

const ClientFavorite = ({ stationId, onClose }) => {
  const [chargingStations, setChargingStations] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await apiRequest('GET', 'https://localhost:7080/api/Clients/ChargingStationsFavorites');
        setChargingStations(data || []);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      }
    };
    fetchFavorites();
  }, []);

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      await apiRequest('DELETE', `https://localhost:7080/api/Clients/ChargingStationFavorites/${favoriteId}`);
      toast.success("Favorite removed");
      // Remove the station from the local state list to update the UI
      setChargingStations(prevStations => prevStations.filter(station => station.favoriteId !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div>
      <h2>Your Favorite Charging Stations</h2>
      <ul>
        {chargingStations.map((station) => (
          <li key={station.favoriteId}>
            <strong>{station.chargingStationName}</strong>
            <p>{station.stationLocation}</p>
            <p>Status: {station.status}</p>
            <p>Payment Method: {station.paymentMethod}</p>
            <button onClick={() => handleDeleteFavorite(station.favoriteId)}>Remove from Favorites</button>
          </li>
        ))}
      </ul>

      <h3>Add Charging Station to Favorites</h3>
      <button onClick={() => handleAddFavorite(stationId)}>Add Station</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ClientFavorite;
