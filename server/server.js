const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Setup folder dan konfigurasi multer untuk upload gambar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Menghindari nama file duplikat dengan timestamp + nama asli
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

app.get('/api/cars', (req, res) => {
  const sql = 'SELECT * FROM cars';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error mengambil data mobil:', err);
      return res.status(500).json({ error: 'Gagal mengambil data mobil' });
    }
    res.json({ cars: results });
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Backend jalan! 🔥');
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error saat login:', err);
      return res.status(500).json({ message: 'Error di server' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Email tidak ditemukan' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const { password: pw, ...userWithoutPassword } = user;
    res.json({ message: 'Login sukses', user: userWithoutPassword });
  });
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password, paymentMethod } = req.body;
  if (!name || !email || !password || !paymentMethod) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  try {
    const emailExists = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0);
      });
    });

    if (emailExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (name, email, password, payment_method) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, paymentMethod],
      (err) => {
        if (err) {
          console.error('Error saat register:', err);
          return res.status(500).json({ message: 'Gagal mendaftar' });
        }
        res.status(201).json({ message: 'Signup berhasil' });
      }
    );
  } catch (err) {
    console.error('Error server register:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Fungsi bantu bikin query pencarian mobil
function buildCarQuery(filters) {
  let query = "SELECT * FROM cars WHERE 1=1";
  const params = [];

  if (filters.carType) {
    query += " AND type = ?";
    params.push(filters.carType);
  }
  if (filters.minPrice) {
    query += " AND price >= ?";
    params.push(filters.minPrice);
  }
  if (filters.maxPrice) {
    query += " AND price <= ?";
    params.push(filters.maxPrice);
  }
  if (filters.utility) {
    query += " AND utility LIKE ?";
    params.push(`%${filters.utility}%`);
  }

  return { query, params };
}

// Endpoint pencarian mobil + simpan histori pencarian
app.post('/search', (req, res) => {
  const { userId, carType, minPrice, maxPrice, utility } = req.body;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "userId wajib diisi dan harus angka" });
  }

  // Simpan histori pencarian
  const insertSql = `
    INSERT INTO search_logs (user_id, type, min_price, max_price, utility)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertSql, [userId, carType || null, minPrice || null, maxPrice || null, utility || null], (err, insertResult) => {
    if (err) {
      console.error('Error simpan histori pencarian:', err);
      return res.status(500).json({ message: "Gagal menyimpan pencarian" });
    }

    // Coba query dengan filter lengkap dulu, jika tidak ada hasil coba tanpa filter utility
    const filtersList = [
      { carType, minPrice, maxPrice, utility },
      { carType, minPrice, maxPrice, utility: null }
    ];

    function tryQuery(index = 0) {
      if (index >= filtersList.length) {
        return res.status(200).json({ searchId: insertResult.insertId, cars: [] });
      }

      const { query, params } = buildCarQuery(filtersList[index]);
      db.query(query, params, (err, results) => {
        if (err) {
          console.error('Error ambil data mobil:', err);
          return res.status(500).json({ message: "Gagal mengambil data mobil" });
        }
        if (results.length === 0) tryQuery(index + 1);
        else res.status(200).json({ searchId: insertResult.insertId, cars: results });
      });
    }

    tryQuery(0);
  });
});

// GET mobil dengan filter query
app.get('/cars', (req, res) => {
  const { type, minPrice, maxPrice, utility } = req.query;

  let sql = 'SELECT * FROM cars WHERE 1=1';
  const params = [];

  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }
  if (minPrice && !isNaN(minPrice)) {
    sql += ' AND price >= ?';
    params.push(minPrice);
  }
  if (maxPrice && !isNaN(maxPrice)) {
    sql += ' AND price <= ?';
    params.push(maxPrice);
  }
  if (utility) {
    sql += ' AND utility LIKE ?';
    params.push(`%${utility}%`);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error ambil data mobil:', err);
      return res.status(500).json({ message: 'Gagal mengambil data mobil' });
    }
    res.json(results);
  });
});

// Endpoint detail mobil by ID
app.get('/cars/:id', (req, res) => {
  const carId = req.params.id;
  if (!carId || isNaN(carId)) return res.status(400).json({ message: 'ID mobil wajib diisi dan angka' });

  db.query('SELECT * FROM cars WHERE id = ?', [carId], (err, results) => {
    if (err) {
      console.error('Error ambil detail mobil:', err);
      return res.status(500).json({ message: 'Gagal mengambil data mobil' });
    }
    if (results.length === 0) return res.status(404).json({ message: 'Mobil tidak ditemukan' });
    res.json(results[0]);
  });
});



// POST /tradein - tambah data trade-in
app.post('/tradein', upload.single('carImage'), (req, res) => {
  const { initialPrice, minBudget, maxBudget, description } = req.body;

  if (!initialPrice || isNaN(initialPrice) || !minBudget || isNaN(minBudget) || !maxBudget || isNaN(maxBudget)) {
    return res.status(400).json({ message: 'initialPrice, minBudget, dan maxBudget wajib diisi dan berupa angka' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Gambar mobil wajib diupload' });
  }

  const insertSql = `
    INSERT INTO tradeins (initial_price, min_budget, max_budget, description, car_image)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertSql,
    [initialPrice, minBudget, maxBudget, description || null, req.file.filename],
    (err, insertResult) => {
      if (err) {
        console.error('❌ Error insert trade-in:', err);
        return res.status(500).json({ message: 'Gagal menyimpan data trade-in' });
      }

      const tradeinId = insertResult.insertId;
      console.log('✅ Trade-in berhasil disimpan dengan ID:', tradeinId);

      const getTradeinSql = 'SELECT * FROM tradeins WHERE id = ?';
      db.query(getTradeinSql, [tradeinId], (err, results) => {
        if (err) {
          console.error('❌ Gagal mengambil trade-in setelah insert:', err);
          return res.status(500).json({ message: 'Gagal mengambil data trade-in setelah insert' });
        }
        if (results.length === 0) {
          console.warn('⚠️ Trade-in yang baru saja disimpan tidak ditemukan di DB');
          return res.status(404).json({ message: 'Trade-in yang baru saja disimpan tidak ditemukan' });
        }

        // Kembalikan data trade-in
        res.status(201).json({ tradein: results[0] });
      });
    }
  );
});

// GET /tradein/:id - ambil detail trade-in berdasarkan ID
app.get('/tradein/:id', (req, res) => {
  const tradeinId = req.params.id;

  if (!tradeinId || isNaN(tradeinId)) {
    return res.status(400).json({ message: 'ID trade-in tidak valid' });
  }

  const sql = 'SELECT * FROM tradeins WHERE id = ?';
  db.query(sql, [tradeinId], (err, results) => {
    if (err) {
      console.error('❌ Error mengambil trade-in:', err);
      return res.status(500).json({ message: 'Gagal mengambil data trade-in' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Trade-in tidak ditemukan' });
    }

    res.json({ tradein: results[0] });
  });
});

// ✅ Tambahan: GET /tradein/:id/suggestions - ambil rekomendasi mobil berdasarkan trade-in
app.get('/tradein/:id/suggestions', (req, res) => {
  const tradeinId = req.params.id;

  const getTradeinSql = 'SELECT * FROM tradeins WHERE id = ?';
  db.query(getTradeinSql, [tradeinId], (err, results) => {
    if (err) {
      console.error('❌ Error mengambil data trade-in:', err);
      return res.status(500).json({ message: 'Gagal mengambil data trade-in' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Data trade-in tidak ditemukan' });
    }

    const tradein = results[0];
    const { initial_price, min_budget, max_budget } = tradein;

    const getRecommendedCarsSql = `
      SELECT *, (price - ?) AS adjusted_price
      FROM cars
      WHERE price BETWEEN ? AND ?
    `;
    db.query(getRecommendedCarsSql, [initial_price, min_budget, max_budget], (err, cars) => {
      if (err) {
        console.error('❌ Error mengambil rekomendasi mobil:', err);
        return res.status(500).json({ message: 'Gagal mengambil rekomendasi mobil' });
      }

      res.json({ recommendedCars: cars });
    });
  });
});

// Ambil semua jadwal
app.get('/api/schedules', (req, res) => {
  const sql = 'SELECT user_id AS userId, schedule_date AS date FROM user_schedules';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Gagal ambil jadwal:', err);
      return res.status(500).json({ message: 'Gagal ambil jadwal' });
    }

    console.log('📤 Mengirim data jadwal:', results);
    res.json(results);
  });
});

// Ajukan jadwal (POST)
app.post('/api/schedules', (req, res) => {
  const { userId, date } = req.body;

  console.log('📥 Data diterima:', req.body);

  if (!userId || !date) {
    return res.status(400).json({ message: 'userId dan date wajib diisi.' });
  }

  const sql = 'INSERT INTO user_schedules (user_id, schedule_date) VALUES (?, ?)';
  db.query(sql, [userId, date], (err, result) => {
    if (err) {
      console.error('❌ Error saat menyimpan jadwal:', err);
      return res.status(500).json({ message: 'Gagal menyimpan jadwal.' });
    }

    console.log('✅ Jadwal berhasil disimpan:', result);
    res.status(201).json({ message: 'Jadwal berhasil disimpan', id: result.insertId });
  });
});

app.get('/admin/cars', (req, res) => {
  const sql = 'SELECT * FROM cars ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error mengambil data mobil:', err);
      return res.status(500).json({ message: 'Gagal mengambil data mobil' });
    }
    res.json({ cars: results });
  });
});

app.post('/admin/cars', (req, res) => {
  const { name, type, price, utility } = req.body;

  if (!name || !type || !price || !utility) {
    return res.status(400).json({ message: 'Mohon isi semua data kendaraan' });
  }

  const sql = 'INSERT INTO cars (name, type, price, utility) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, type, price, utility], (err, result) => {
    if (err) {
      console.error('❌ Error menambah mobil:', err);
      return res.status(500).json({ message: 'Gagal menambah kendaraan' });
    }
    res.status(201).json({ message: 'Kendaraan berhasil ditambahkan', id: result.insertId });
  });
});

app.delete('/admin/cars/:id', (req, res) => {
  const carId = req.params.id;
  const sql = 'DELETE FROM cars WHERE id = ?';

  db.query(sql, [carId], (err, result) => {
    if (err) {
      console.error('❌ Error menghapus mobil:', err);
      return res.status(500).json({ message: 'Gagal menghapus kendaraan' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kendaraan tidak ditemukan' });
    }

    res.json({ message: 'Kendaraan berhasil dihapus' });
  });
});


app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});

