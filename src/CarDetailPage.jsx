import React, { useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import Sidebar from "./component/Navbar";
import './CarDetailPage.css';

export default function CarDetail() {
  const location = useLocation();
  const { car } = location.state || {};
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Ambil data user dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  if (!car) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div style={{ marginLeft: sidebarOpen ? "250px" : "80px", padding: 20 }}>
          <h2>Mobil dengan ID {id} tidak ditemukan.</h2>
          <p>Data tidak tersedia. Silakan kembali ke halaman hasil pencarian.</p>
          <Link to="/">← Kembali ke hasil pencarian</Link>
        </div>
      </>
    );
  }

  // Parsing colors dari JSON string ke array
  let colors = [];
  try {
    colors = car.colors ? JSON.parse(car.colors) : [];
  } catch (error) {
    colors = [];
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="main-content1"
        style={{ marginLeft: sidebarOpen ? "250px" : "0px", transition: "margin-left 0.3s ease" }}
      >
        {/* Header bar tetap di luar container gambar+deskripsi */}
        <div className="topbar">
          <p>Hello, {user ? user.name : "Guest"} 👤</p>
        </div>

        {/* Grup gambar dan deskripsi */}
        <div className="car-info-wrapper">
          <img src={car.image || "/default-car.png"} alt={car.name} className="car-image" />
          <div className="car-details">
            <h1>{car.name}</h1>
            <p className="description">{car.description}</p>

            <div className="available-color">
              <h4>Available Color</h4>
              <div className="color-options">
                {colors.length === 0 ? (
                  <p>Tidak ada warna tersedia</p>
                ) : (
                  colors.map((color, index) => (
                    <div
                      key={index}
                      className="color-circle"
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))
                )}
              </div>
            </div>

            <div className="price-section">
              <div className="new-price">
                Rp.{car.price?.toLocaleString("id-ID")}
              </div>
            </div>

            <button className="tradein-button">Trade-in</button>
          </div>
        </div>
      </div>
    </>
  );
}
