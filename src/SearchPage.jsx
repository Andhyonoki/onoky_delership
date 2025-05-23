import React, { useState, useEffect } from "react";
import Sidebar from "./component/Navbar";  // Pastikan komponen Sidebar menerima toggleSidebar dan isOpen props
import "./SearchPage.css";

const carTypes = [
  { label: "SUV", icon: "🚙" },
  { label: "Sedan", icon: "🚗" },
  { label: "Coupe", icon: "🚘" },
  { label: "Convertible", icon: "🏎️" },
  { label: "Van", icon: "🚐" },
  { label: "Truck", icon: "🚚" },
];

export default function SearchPage() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [selectedType, setSelectedType] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [utility, setUtility] = useState("");
  const [user, setUser] = useState(null);

  // Jangan langsung override sidebarOpen saat resize kalau user sudah toggle manual
  // Kita pakai ref untuk menyimpan apakah user sudah toggle manual
  const [userToggled, setUserToggled] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const handleResize = () => {
      if (!userToggled) {
        setSidebarOpen(window.innerWidth > 768);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [userToggled]);

  // Toggle sidebar dan set flag userToggled = true supaya resize tidak override
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    setUserToggled(true);
  };

  const handleSearch = async () => {
    if (!user) {
      alert("⚠️ Anda belum login.");
      return;
    }

    const searchData = {
      userId: user.id, // pastikan user punya properti 'id'
      carType: selectedType,
      minPrice: parseFloat(minPrice),
      maxPrice: parseFloat(maxPrice),
      utility,
    };

    try {
      const res = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Pencarian berhasil disimpan ke histori!");
      } else {
        alert("❌ Gagal menyimpan: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error koneksi:", err);
      alert("❌ Tidak bisa terhubung ke server.");
    }
  };

  return (
    <div className="search-container">
      {/* Pass toggleSidebar dan isOpen ke Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="search-content"
        style={{
          marginLeft: sidebarOpen ? "250px" : "0px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div className="topbar">
          <p>Hello, {user ? user.name : "Guest"} 👤</p>
        </div>

        <h1>Find most fit Car</h1>

        <div className="section">
          <h3>Car Type</h3>
          <div className="car-types">
            {carTypes.map((type) => (
              <button
                key={type.label}
                onClick={() => setSelectedType(type.label)}
                className={`car-type-btn ${
                  selectedType === type.label ? "selected" : ""
                }`}
              >
                <div className="car-icon">{type.icon}</div>
                <div className="car-label">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Price Range</h3>
          <div className="price-range">
            <input
              type="number"
              placeholder="Minimum Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Maximum Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="section">
          <h3>Utility</h3>
          <textarea
            value={utility}
            onChange={(e) => setUtility(e.target.value)}
            placeholder="Describe how the vehicle will be used."
          />
        </div>

        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
    </div>
  );
}
