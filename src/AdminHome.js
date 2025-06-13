import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminHome = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data mobil dari backend
  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/cars');
      setCars(response.data.cars);
      setLoading(false);
    } catch (error) {
      console.error('Gagal mengambil data mobil:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Mobil</h1>
      {loading ? (
        <p>Memuat data mobil...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className="border p-4 rounded shadow bg-white"
            >
              <h2 className="text-lg font-semibold">{car.name}</h2>
              <p className="text-sm">Tipe: {car.type}</p>
              <p className="text-sm">Harga: Rp {car.price.toLocaleString()}</p>
              <p className="text-sm">Kegunaan: {car.utility}</p>
              <button
                onClick={() => console.log(`Hapus mobil id: ${car.id}`)}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminHome;
