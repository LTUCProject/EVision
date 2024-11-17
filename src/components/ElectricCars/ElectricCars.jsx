import React from "react";
import ElectricCarsData from "./ElectricCarsData.json";
import "./ElectricCars.css";

const ElectricCars = () => {
  return (
    <div className="electric-cars-container">
      <h1 className="electric-cars-title">Electric Cars</h1>
      {ElectricCarsData.ElectricCars.map((category, index) => (
        <div key={index} className="electric-car-category">
          <h2 className="electric-car-category-title">
            Category: {category.Category}
          </h2>
          {category.Cars.map((car, carIndex) => (
            <div key={carIndex} className="electric-car-card">
              <h3 className="electric-car-name">{car.Name}</h3>
              {car.ImageURL && (
                <img
                  src={car.ImageURL}
                  alt={car.Name}
                  className="electric-car-image"
                />
              )}
              <p className="electric-car-year"><strong>Year:</strong> {car.Year}</p>
              <p className="electric-car-range"><strong>Range:</strong> {car.Range}</p>
              <p className="electric-car-price"><strong>Price:</strong> {car.Price}</p>
              <p className="electric-car-performance">
                <strong>Performance:</strong>
                <ul>
                  <li>Top Speed: {car.Performance.TopSpeed}</li>
                  <li>Acceleration: {car.Performance.Acceleration}</li>
                </ul>
              </p>
              <p className="electric-car-charging">
                <strong>Charging:</strong>
                <ul>
                  <li>Fast Charging: {car.Charging.FastCharging}</li>
                  <li>Port Type: {car.Charging.PortType}</li>
                </ul>
              </p>
              <p className="electric-car-explanation">
                <strong>Explanation:</strong> {car.Explanation}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ElectricCars;
