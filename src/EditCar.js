import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddCar.css";

export default function EditCar() {
  const { id } = useParams();
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

  // Ambil data mobil saat mount
  useEffect(() => {
    axios
      .get(`https://4b61-140-213-74-72.ngrok-free.app/cars/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => {
        console.error("Gagal mengambil data mobil:", err);
        setError("Data mobil tidak ditemukan.");
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.put(`https://4b61-140-213-74-72.ngrok-free.app/cars/${id}`, formData);
      alert("Mobil berhasil diperbarui!");
      navigate("/admin");
    } catch (err) {
      console.error("Gagal memperbarui mobil:", err);
      setError("Terjadi kesalahan saat update data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-car-form">
      <h2>Edit Mobil</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleUpdate}>
        <label>
          Nama Mobil
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Deskripsi
          <input type="text" name="description" value={formData.description} onChange={handleChange} />
        </label>
        <label>
          Harga
          <input type="number" name="price" value={formData.price} onChange={handleChange} />
        </label>
        <label>
          Tipe Mobil
          <input type="text" name="type" value={formData.type} onChange={handleChange} />
        </label>
        <label>
          Rating
          <input type="number" name="rating" step="0.1" value={formData.rating} onChange={handleChange} />
        </label>
        <label>
          URL Gambar
          <input type="text" name="image" value={formData.image} onChange={handleChange} />
        </label>
        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "💾 Simpan Perubahan"}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/admin")}
          >
            ❌ Batalkan
          </button>
        </div>
      </form>
    </div>
  );
}
