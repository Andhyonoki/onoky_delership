import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TradeInResult.css";

const TradeInResult = () => {
  const { tradeinId } = useParams();
  const navigate = useNavigate();

  const [tradein, setTradein] = useState(null);
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [loadingTradein, setLoadingTradein] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:5000";
  const PLACEHOLDER = "https://via.placeholder.com/250x150?text=No+Image";

  // Helper untuk membangun URL gambar
  const buildImageUrl = (value) => {
    if (!value) return PLACEHOLDER;
    if (value.startsWith("http")) {
      const m = value.match(/^https?:\/\/drive\.google\.com\/file\/d\/([\w-]+)\//);
      if (m) return `https://drive.google.com/uc?export=view&id=${m[1]}`;
      return value;
    }
    return `${API_BASE}/uploads/${value.replace(/^\\+/, "")}`;
  };

  // Fetch data trade‑in & rekomendasi
  useEffect(() => {
    if (!tradeinId) {
      setError("ID trade-in tidak ditemukan.");
      setLoadingTradein(false);
      setLoadingRecommendations(false);
      return;
    }

    const getTradein = async () => {
      try {
        const res = await fetch(`${API_BASE}/tradein/${tradeinId}`);
        if (!res.ok) throw new Error("Data trade-in tidak ditemukan.");
        const data = await res.json();
        if (!data?.tradein) throw new Error("Data trade-in tidak ditemukan.");
        setTradein(data.tradein);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTradein(false);
      }
    };

    const getRecommendations = async () => {
      try {
        const res = await fetch(`${API_BASE}/tradein/${tradeinId}/suggestions`);
        if (!res.ok) throw new Error("Gagal mengambil rekomendasi mobil.");
        const data = await res.json();
        setRecommendedCars(data.recommendedCars || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    getTradein();
    getRecommendations();
  }, [tradeinId]);

  if (loadingTradein || loadingRecommendations) return <p>Loading...</p>;

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate(-1)}>Kembali</button>
      </div>
    );
  }

  if (!tradein) return <p>Data trade-in tidak ditemukan.</p>;

  const initialPrice = Number(tradein.initial_price);
  const minBudget = Number(tradein.min_budget);
  const maxBudget = Number(tradein.max_budget);
  const imageUrl = buildImageUrl(tradein.car_image);

  return (
    <div className="container">
      <h1>Hasil Trade-In</h1>

      {/* ---------- Kartu hasil trade‑in ---------- */}
      <div className="car-card tradein-card">
        <img
          src={imageUrl}
          alt="Gambar Mobil Trade-In"
          className="tradein-image"
          onError={(e) => (e.target.src = PLACEHOLDER)}
        />

        <p>
          <strong>Deskripsi:</strong> {tradein.description || "-"}
        </p>
        <hr />
        <p>
          <strong>Harga Awal:</strong> Rp {initialPrice.toLocaleString("id-ID")}
        </p>
        <p>
          <strong>Budget Minimum:</strong> Rp {minBudget.toLocaleString("id-ID")}
        </p>
        <p>
          <strong>Budget Maksimum:</strong> Rp {maxBudget.toLocaleString("id-ID")}
        </p>

        <button onClick={() => navigate(-1)}>Kembali</button>
      </div>

      {/* ---------- Rekomendasi ---------- */}
      <h2>Rekomendasi Mobil Sesuai Budget</h2>

      {recommendedCars.length === 0 ? (
        <p>Tidak ada rekomendasi mobil sesuai budget.</p>
      ) : (
        <div className="recommended-cars">
          {recommendedCars.map((car) => {
            const originalPrice = Number(car.price);
            const newPrice = originalPrice - initialPrice;

            return (
              <div key={car.id} className="car-card">
                <img
                  src={buildImageUrl(car.image)}
                  alt={car.name || "rekomendasi"}
                  onError={(e) => (e.target.src = PLACEHOLDER)}
                />
                <h3>{car.name || "-"}</h3>
                <p>{car.description || "-"}</p>
                <p>
                  <span className="price-strike">
                    Rp {originalPrice.toLocaleString("id-ID")}
                  </span>
                  <br />
                  <span className="price-new">
                    Rp {newPrice.toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TradeInResult;
