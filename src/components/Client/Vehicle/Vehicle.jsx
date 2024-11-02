// components/Vehicles/Vehicles.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    licensePlate: "",
    model: "",
    year: "",
    batteryCapacity: "",
    electricType: "",
  });
  const userId = 1; // Replace this with the actual logged-in user ID

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to submit the vehicle data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7080/api/Clients/vehicle", {
        vehicleId: 0, // Assuming vehicleId is auto-generated
        clientId: userId, // Use the actual clientId
        ...formData,
      });
      setVehicles((prevVehicles) => [...prevVehicles, response.data]);
      setFormData({
        licensePlate: "",
        model: "",
        year: "",
        batteryCapacity: "",
        electricType: "",
      }); // Reset form
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  // Function to fetch vehicles from the API
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`https://localhost:7080/api/Clients/vehicles/${userId}`);
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  // Function to delete a vehicle
  const handleDelete = async (vehicleId) => {
    try {
      await axios.delete(`https://localhost:7080/api/Clients/vehicles/${vehicleId}`);
      setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle.vehicleId !== vehicleId));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [userId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Vehicles</h1>

      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Add New Vehicle</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="licensePlate"
            placeholder="License Plate"
            value={formData.licensePlate}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="batteryCapacity"
            placeholder="Battery Capacity (kWh)"
            value={formData.batteryCapacity}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="electricType"
            placeholder="Electric Type"
            value={formData.electricType}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Add Vehicle
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Your Vehicles</h2>
      {vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {vehicles.map((vehicle) => (
            <li key={vehicle.vehicleId} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
              <strong>License Plate:</strong> {vehicle.licensePlate} <br />
              <strong>Model:</strong> {vehicle.model} <br />
              <strong>Year:</strong> {vehicle.year} <br />
              <strong>Battery Capacity:</strong> {vehicle.batteryCapacity} kWh <br />
              <strong>Electric Type:</strong> {vehicle.electricType} <br />
              <button
                onClick={() => handleDelete(vehicle.vehicleId)}
                className="mt-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-200"
              >
                Delete Vehicle
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default Vehicles;