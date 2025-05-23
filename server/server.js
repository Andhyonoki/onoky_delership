// server/server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Endpoint root test
app.get('/', (req, res) => {
  res.send('Backend jalan! 🔥');
});

// Endpoint login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
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

    res.json({ message: 'Login sukses', user });
  });
});

// Endpoint register
app.post('/register', async (req, res) => {
  const { name, email, password, paymentMethod } = req.body;

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
      if (err) throw err;
      res.status(201).json({ message: 'Signup berhasil' });
    });

  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Endpoint simpan histori pencarian
app.post('/search', (req, res) => {
  const { userId, carType, minPrice, maxPrice, utility } = req.body;

  const sql = `
    INSERT INTO search_logs (user_id, car_type, min_price, max_price, utility)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, carType, minPrice, maxPrice, utility], (err, result) => {
    if (err) {
      console.error("❌ Error simpan search:", err);
      return res.status(500).json({ message: "Gagal menyimpan pencarian" });
    }
    res.status(201).json({ message: "Pencarian disimpan", searchId: result.insertId });
  });
});

app.listen(port, () => {
  console.log(`🌐 Server running: http://localhost:${port}`);
});
