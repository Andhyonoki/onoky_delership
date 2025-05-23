
import React from 'react';
import './CarCard.css';

const CarCard = ({ car }) => {
  return (
    <div className="car-card">
      <img src={car.image} alt={car.name} className="car-image" />
      <div className="car-info">
        <div className="car-title">
          <h4>{car.name}</h4>
          <span className="car-rating">⭐ {car.rating}</span>
        </div>
        <p className="car-description">{car.description}</p>
        <p className="car-price">Price<br />Rp. {Number(car.price).toLocaleString()}</p>
        <a href={`/car/${car.id}`} className="view-detail">View Detail</a>
      </div>
    </div>
  );
};

export default CarCard;
