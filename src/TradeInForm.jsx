import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from "./component/Navbar";
import { useNavigate } from 'react-router-dom';
import './TradeInForm.css';

const TradeInForm = () => {
  const navigate = useNavigate();

  const [carImageFile, setCarImageFile] = useState(null);
  const [initialPriceRaw, setInitialPriceRaw] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [description, setDescription] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [user] = useState({ name: 'Guest' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCarImageFile(file || null);
  };

  const handleInitialPriceChange = (e) => {
    const angkaOnly = e.target.value.replace(/\D/g, "");
    setInitialPriceRaw(angkaOnly);
  };

  const handleReview = () => {
    if (!carImageFile || !initialPriceRaw || !minBudget || !maxBudget || !description) {
      return alert("Harap lengkapi semua data.");
    }
    if (parseInt(minBudget) > parseInt(maxBudget)) {
      return alert("Minimum budget tidak boleh lebih besar dari maksimum budget.");
    }
    setIsPreview(true);
  };

  const handleBack = () => setIsPreview(false);

  const handleSubmit = async () => {
    if (!carImageFile || !initialPriceRaw || !minBudget || !maxBudget || !description) {
      return alert("Data tidak lengkap. Harap isi semua field.");
    }

    const formData = new FormData();
    formData.append('carImage', carImageFile);
    formData.append('initialPrice', initialPriceRaw);
    formData.append('minBudget', minBudget);
    formData.append('maxBudget', maxBudget);
    formData.append('description', description);

    try {
      const response = await axios.post('http://localhost:5000/tradein', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Trade-in berhasil disimpan');

      // ✅ Perbaikan: gunakan response.data.tradein.id untuk redirect
      navigate(`/tradein-result/${response.data.tradein.id}`);

    } catch (error) {
      alert('Gagal menyimpan trade-in');
      console.error('Error saat submit trade-in:', error.response?.data || error.message);
    }
  };

  const priceOptions = ['', '50000000', '100000000', '150000000', '200000000', '250000000', '300000000', '400000000', '500000000'];

  return (
    <div className="search-container1">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="search-content" style={{ marginLeft: sidebarOpen ? "250px" : "0px" }}>
        <div className="topbar">
          <p>Hello, {user ? user.name : "Guest"} 👤</p>
        </div>

        <div className="tradein-container">
          {isPreview ? (
            <div className="preview-container">
              <h2>Pratinjau Mobil Anda</h2>
              <p><strong>Nama File Gambar:</strong> {carImageFile.name}</p>
              <img src={URL.createObjectURL(carImageFile)} alt="Preview Mobil" className="preview-image" />
              <p><strong>Harga Awal:</strong> Rp {parseInt(initialPriceRaw).toLocaleString('id-ID')}</p>
              <p><strong>Budget Anda:</strong> Rp {parseInt(minBudget).toLocaleString('id-ID')} - Rp {parseInt(maxBudget).toLocaleString('id-ID')}</p>
              <p><strong>Deskripsi Mobil:</strong></p>
              <p>{description}</p>
              <button onClick={handleBack} style={{ marginRight: '10px' }}>Kembali ke Form</button>
              <button onClick={handleSubmit}>Submit Trade-In</button>
            </div>
          ) : (
            <>
              <h2 className="tradein-title">Form Trade-in Mobil</h2>

              <div className="form-group">
                <label>Upload Gambar Mobil</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {carImageFile && <img src={URL.createObjectURL(carImageFile)} alt="Preview Mobil" className="preview-image" />}
              </div>

              <div className="form-group">
                <label>Harga Awal Mobil</label>
                <input type="text" placeholder="Masukkan harga awal kendaraan" value={initialPriceRaw} onChange={handleInitialPriceChange} />
              </div>

              <div className="form-group">
                <h3>Price Range</h3>
                <div className="price-range">
                  <select value={minBudget} onChange={(e) => setMinBudget(e.target.value)}>
                    <option value="">Minimum Price</option>
                    {priceOptions.map((price, idx) => (
                      <option key={idx} value={price}>
                        {price ? `Rp ${parseInt(price).toLocaleString('id-ID')}` : ""}
                      </option>
                    ))}
                  </select>

                  <span style={{ margin: '0 10px' }}>To</span>

                  <select value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)}>
                    <option value="">Maximum Price</option>
                    {priceOptions.map((price, idx) => (
                      <option key={idx} value={price}>
                        {price ? `Rp ${parseInt(price).toLocaleString('id-ID')}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Deskripsi Mobil</label>
                <textarea placeholder="Jelaskan deskripsi kendaraan" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>

              <button className="review-button" onClick={handleReview}>Review</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeInForm;
