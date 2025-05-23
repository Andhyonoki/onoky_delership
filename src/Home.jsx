// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import CarCard from './component/CarCard';
import './Home.css'; // style halaman home

const Home = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Ganti ini dengan pengambilan data dari database-mu
    fetch('/api/cars') // contoh endpoint API
      .then(res => res.json())
      .then(data => setCars(data));
  }, []);

  return (
    <div className="home-container">
      <h2>New Model</h2>
      <div className="car-grid">
        {cars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default Home;
