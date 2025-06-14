import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './TradeInResult.css';

const TradeInResult = () => {
  const { tradeinId } = useParams();
  const navigate = useNavigate();

  const [tradein, setTradein] = useState(null);
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [loadingTradein, setLoadingTradein] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tradeinId) {
      setError("ID trade-in tidak ditemukan.");
      setLoadingTradein(false);
      setLoadingRecommendations(false);
      return;
    }

    const fetchTradein = async () => {
      try {
        const res = await fetch(`https://4b61-140-213-74-72.ngrok-free.app/tradein/${tradeinId}`);
        if (!res.ok) {
          throw new Error("Data trade-in tidak ditemukan.");
        }

        const data = await res.json();
        if (!data || !data.tradein || Object.keys(data.tradein).length === 0) {
          throw new Error("Data trade-in tidak ditemukan.");
        }

        setTradein(data.tradein); // ✅ Ambil objek tradein di dalam response
      } catch (err) {
        setError(err.message || "Gagal mengambil data trade-in.");
      } finally {
        setLoadingTradein(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`https://4b61-140-213-74-72.ngrok-free.app/tradein/${tradeinId}/suggestions`);
        if (!res.ok) {
          throw new Error("Gagal mengambil rekomendasi mobil.");
        }
        const data = await res.json();
        setRecommendedCars(data.recommendedCars || []);
      } catch (err) {
        setError(err.message || "Gagal mengambil rekomendasi mobil.");
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchTradein();
    fetchRecommendations();
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

  const potonganMin = minBudget - initialPrice;
  const potonganMax = maxBudget - initialPrice;

  const imageUrl =
    tradein.car_image && typeof tradein.car_image === "string"
      ? `https://4b61-140-213-74-72.ngrok-free.app/uploads/${tradein.car_image}`
      : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1>Hasil Trade-In</h1>

      <div className="car-card" style={{ marginBottom: "2rem" }}>
        <img
          src={imageUrl}
          alt="Gambar Mobil Trade-In"
          style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
          onError={(e) => (e.target.src = "https://via.placeholder.com/400x300?text=No+Image")}
        />
        <p>
          <strong>Deskripsi:</strong> {tradein.description || "-"}
        </p>

        <hr />

        <p>
          <strong>Harga Awal (Input User):</strong>{" "}
          Rp {isNaN(initialPrice) ? "-" : initialPrice.toLocaleString("id-ID")}
        </p>
        <p>
          <strong>Budget Minimum:</strong>{" "}
          Rp {isNaN(minBudget) ? "-" : minBudget.toLocaleString("id-ID")}
        </p>
        <p>
          <strong>Budget Maksimum:</strong>{" "}
          Rp {isNaN(maxBudget) ? "-" : maxBudget.toLocaleString("id-ID")}
        </p>

        <p>
          <strong>Harga setelah dipotong dengan harga awal:</strong>
        </p>
        <p>
          Minimum: Rp {isNaN(potonganMin) ? "-" : potonganMin.toLocaleString("id-ID")}
        </p>
        <p>
          Maksimum: Rp {isNaN(potonganMax) ? "-" : potonganMax.toLocaleString("id-ID")}
        </p>

        <button onClick={() => navigate(-1)}>Kembali</button>
      </div>

      <h2>Rekomendasi Mobil Sesuai Budget</h2>

      {recommendedCars.length === 0 ? (
        <p>Tidak ada rekomendasi mobil sesuai budget.</p>
      ) : (
        <div
          className="recommended-cars"
          style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
        >
          {recommendedCars.map((car) => {
            const carImageUrl =
              car.image && typeof car.image === "string"
                ? `https://4b61-140-213-74-72.ngrok-free.app/uploads/${car.image}`
                : "https://via.placeholder.com/250x150?text=No+Image";

            return (
              <div
                key={car.id}
                className="car-card"
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  width: "250px",
                  borderRadius: "8px",
                }}
              >
                <img
                  src={carImageUrl}
                  alt={`Gambar mobil ${car.name || "rekomendasi"}`}
                  style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "4px" }}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/250x150?text=No+Image")}
                />
                <h3>{car.name || "-"}</h3>
                <p>{car.description || "-"}</p>
                <p>
                  <strong>Harga:</strong>{" "}
                  Rp {car.price ? Number(car.price).toLocaleString("id-ID") : "-"}
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
