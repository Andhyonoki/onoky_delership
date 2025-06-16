import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./component/Navbar";
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
  const [userToggled, setUserToggled] = useState(false);

  const navigate = useNavigate();

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

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    setUserToggled(true);
  };

  const handleSearch = async () => {
    if (!user) {
      alert("⚠️ Anda belum login.");
      return;
    }

    // Prepare data dengan tipe yang tepat dan null jika kosong
    const searchData = {
      userId: user.id,
      carType: selectedType || null,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      utility: utility.trim() !== "" ? utility : null,
    };

    try {
      const response = await fetch("https://childish-polydactyl-baritone.glitch.me/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      if (!response.ok) {
        // jika error dari server, baca pesan errornya
        const errorData = await response.json();
        alert("❌ Gagal mencari: " + (errorData.message || response.statusText));
        return;
      }

      const results = await response.json();
      console.log("Search results:", results);

      // Cek apakah backend mengirim objek atau langsung array
      // Misal backend kirim { cars: [...] }
      const cars = Array.isArray(results) ? results : results.cars || [];

      if (cars.length === 0) {
        alert("⚠️ Tidak ada hasil ditemukan.");
      }

      // Navigasi ke halaman hasil dengan data mobil yang benar
      navigate("/results", { state: { results: cars } });
    } catch (error) {
      alert("❌ Error koneksi ke server.");
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="search-container">
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
          <div class="search-page">
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
