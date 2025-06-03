const express = require('express');
const cors = require('cors');
const db = require('./db'); // Pastikan koneksi MySQL valid
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Root test endpoint
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
      console.error('❌ Query error:', err);
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
      const checkSql = 'SELECT * FROM users WHERE email = ?';
      db.query(checkSql, [email], (err, results) => {
        if (err) reject(err);
        else resolve(results.length > 0);
      });
    });

    if (emailExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertSql = `
      INSERT INTO users (name, email, password, payment_method)
      VALUES (?, ?, ?, ?)
    `;
    db.query(insertSql, [name, email, hashedPassword, paymentMethod], (err, result) => {
      if (err) {
        console.error('❌ Insert error:', err);
        return res.status(500).json({ message: 'Gagal mendaftar' });
      }
      res.status(201).json({ message: 'Signup berhasil' });
    });

  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Fungsi bantu buat bikin query pencarian
function buildCarQuery(filters) {
  let query = "SELECT * FROM cars WHERE 1=1";
  const params = [];

  if (filters.carType) {
    query += " AND type = ?";
    params.push(filters.carType);
  }
  if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== '') {
    query += " AND price >= ?";
    params.push(filters.minPrice);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== '') {
    query += " AND price <= ?";
    params.push(filters.maxPrice);
  }
  if (filters.utility && filters.utility.trim() !== "") {
    query += " AND utility LIKE ?";
    params.push(`%${filters.utility}%`);
  }

  return { query, params };
}

// Endpoint simpan histori pencarian dan cari mobil dengan fallback utility
app.post('/search', (req, res) => {
  const { userId, carType, minPrice, maxPrice, utility } = req.body;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "userId wajib diisi dan harus angka" });
  }

  const insertSql = `
    INSERT INTO search_logs (user_id, type, min_price, max_price, utility)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertSql, [userId, carType || null, minPrice || null, maxPrice || null, utility || null], (err, insertResult) => {
    if (err) {
      console.error("❌ Error simpan search:", err);
      return res.status(500).json({ message: "Gagal menyimpan pencarian" });
    }

    // Daftar filter untuk dicoba, fallback tanpa utility jika perlu
    const filtersList = [
      { carType, minPrice, maxPrice, utility },
      { carType, minPrice, maxPrice, utility: null }
    ];

    function tryQuery(index = 0) {
      if (index >= filtersList.length) {
        // Kalau semua gagal, balikin kosong
        return res.status(200).json({ searchId: insertResult.insertId, cars: [] });
      }

      const { query, params } = buildCarQuery(filtersList[index]);
      console.log(`🔍 Coba query dengan filter index ${index}:`, query, params);

      db.query(query, params, (err, results) => {
        if (err) {
          console.error("❌ Error ambil data mobil:", err);
          return res.status(500).json({ message: "Gagal mengambil data mobil" });
        }

        if (results.length === 0) {
          // Coba filter berikutnya (fallback)
          tryQuery(index + 1);
        } else {
          // Ada hasil, kirim balik
          res.status(200).json({ searchId: insertResult.insertId, cars: results });
        }
      });
    }

    tryQuery(0);
  });
});

// Endpoint cari mobil GET (mirip tapi tanpa simpan histori)
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
    params.push(parseFloat(minPrice));
  }

  if (maxPrice && !isNaN(maxPrice)) {
    sql += ' AND price <= ?';
    params.push(parseFloat(maxPrice));
  }

  if (utility && utility.trim() !== "") {
    sql += ' AND utility LIKE ?';
    params.push(`%${utility}%`);
  }

  console.log("📦 SQL Query:", sql);
  console.log("📌 Params:", params);

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('❌ Error fetch cars:', err);
      return res.status(500).json({ message: 'Gagal mengambil data mobil' });
    }
    res.json(results);
  });
});

// === TAMBAHAN: Endpoint detail mobil berdasarkan id ===
app.get('/cars/:id', (req, res) => {
  const carId = req.params.id;

  if (!carId) {
    return res.status(400).json({ message: 'ID mobil wajib diisi' });
  }

  const sql = 'SELECT * FROM cars WHERE id = ?';
  db.query(sql, [carId], (err, results) => {
    if (err) {
      console.error('❌ Error saat query detail mobil:', err);
      return res.status(500).json({ message: 'Gagal mengambil data mobil' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Mobil tidak ditemukan' });
    }

    res.json(results[0]);
  });
});

app.listen(port, () => {
  console.log(`🌐 Server running: http://localhost:${port}`);
});
