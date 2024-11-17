import React, { useState } from "react";
import ElectricCarsData from "./ElectricCarsData.json";
import "./ElectricCars.css";

const ElectricCars = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter cars by search term
  const filteredCategories = ElectricCarsData.ElectricCars.map((category) => ({
    ...category,
    Cars: category.Cars.filter((car) =>
      car.Name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((category) => category.Cars.length > 0);

  return (
    <div className="electric-cars-container">
      <h1 className="electric-cars-title">Electric Cars</h1>

      {/* Search Input */}
      <div className="electric-cars-search">
        <input
          type="text"
          placeholder="Search cars by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="electric-cars-search-input"
        />
      </div>

      {/* Electric Cars by Category */}
      {filteredCategories.map((category, index) => (
        <div key={index} className="electric-car-category">
          <h2 className="electric-car-category-title">
            Category: {category.Category}
          </h2>
          <div className="electric-car-list-container">
            <div className="electric-car-list">
              {category.Cars.map((car, carIndex) => (
                <div key={carIndex} className="electric-car-card">
                  <div className="electric-car-card-inner">
                    {/* Front Side */}
                    <div className="electric-car-card-front">
                      <h3 className="electric-car-name">{car.Name}</h3>
                      {car.ImageURL && (
                        <img
                          src={car.ImageURL}
                          alt={car.Name}
                          className="electric-car-image"
                        />
                      )}
                    </div>
                    {/* Back Side */}
                    <div className="electric-car-card-back">
                      <div className="electric-car-details">
                        <p><strong>Year:</strong> {car.Year}</p>
                        <p><strong>Range:</strong> {car.Range}</p>
                        <p><strong>Price:</strong> {car.Price}</p>
                        <p>
                          <strong>Performance:</strong>
                          <ul>
                            <li>Top Speed: {car.Performance.TopSpeed}</li>
                            <li>Acceleration: {car.Performance.Acceleration}</li>
                          </ul>
                        </p>
                        <p>
                          <strong>Charging:</strong>
                          <ul>
                            <li>Fast Charging: {car.Charging.FastCharging}</li>
                            <li>Port Type: {car.Charging.PortType}</li>
                          </ul>
                        </p>
                        <p><strong>Explanation:</strong> {car.Explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* No Results Message */}
      {filteredCategories.length === 0 && (
        <p className="electric-cars-no-results">
          No cars match your search criteria.
        </p>
      )}
    </div>
  );
};

export default ElectricCars;
