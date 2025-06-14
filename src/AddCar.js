import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddCar.css";

export default function AddCar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    type: "",
    rating: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/cars", formData);
      alert("Mobil berhasil ditambahkan!");
      navigate("/admin");
    } catch (error) {
      console.error("Gagal menambahkan mobil:", error);
      setError("Terjadi kesalahan saat menambahkan mobil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-car-form">
      <h2>Tambah Mobil Baru</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nama Mobil
          <input type="text" name="name" required onChange={handleChange} />
        </label>
        <label>
          Deskripsi
          <input type="text" name="description" onChange={handleChange} />
        </label>
        <label>
          Harga
          <input type="number" name="price" required onChange={handleChange} />
        </label>
        <label>
          Tipe Mobil
          <input type="text" name="type" onChange={handleChange} />
        </label>
        <label>
          Rating
          <input
            type="number"
            step="0.1"
            name="rating"
            onChange={handleChange}
          />
        </label>
        <label>
          URL Gambar
          <input type="text" name="image" onChange={handleChange} />
        </label>

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Menambahkan..." : "+ Tambahkan"}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/admin")}
          >
            Batalkan
          </button>
        </div>
      </form>
    </div>
  );
}
