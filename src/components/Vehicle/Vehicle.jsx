// components/Vehicles/Vehicles.js
import React, { useState, useEffect } from "react";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    licensePlate: "",
    model: "",
    year: "",
    batteryCapacity: "",
    electricType: "",
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to submit the vehicle data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://localhost:7080/api/Clients/vehicle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        vehicleId: 0, // Assuming vehicleId is auto-generated
        clientId: 1, // Replace with actual clientId
        ...formData,
      }),
    });

    if (response.ok) {
      const newVehicle = await response.json();
      setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
      setFormData({
        licensePlate: "",
        model: "",
        year: "",
        batteryCapacity: "",
        electricType: "",
      }); // Reset form
    } else {
      console.error("Error adding vehicle");
    }
  };

  useEffect(() => {
    // Fetch existing vehicles on component mount (optional)
    const fetchVehicles = async () => {
      const response = await fetch("https://localhost:7080/api/Clients/vehicles"); // Adjust endpoint if necessary
      const data = await response.json();
      setVehicles(data);
    };
    fetchVehicles();
  }, []);

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

      <h2 className="text-xl font-semibold mb-2">Existing Vehicles</h2>
      <table className="min-w-full bg-white border rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">License Plate</th>
            <th className="py-2 px-4 border-b">Model</th>
            <th className="py-2 px-4 border-b">Year</th>
            <th className="py-2 px-4 border-b">Battery Capacity</th>
            <th className="py-2 px-4 border-b">Electric Type</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <tr key={vehicle.vehicleId}>
                <td className="py-2 px-4 border-b">{vehicle.licensePlate}</td>
                <td className="py-2 px-4 border-b">{vehicle.model}</td>
                <td className="py-2 px-4 border-b">{vehicle.year}</td>
                <td className="py-2 px-4 border-b">{vehicle.batteryCapacity} kWh</td>
                <td className="py-2 px-4 border-b">{vehicle.electricType}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No vehicles found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Vehicles;
