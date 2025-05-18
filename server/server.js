// // server/server.js
// const express = require('express');
// const cors    = require('cors');
// const db      = require('./db');

// const app  = express();
// const port = 5000;

// app.use(cors());
// app.use(express.json()); // supaya bisa req.body

// // Test endpoint
// app.get('/', (req, res) => {
//   res.send('Backend jalan! 🔥');
// });

// // Login endpoint
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;
//   const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

//   db.query(sql, [email, password], (err, results) => {
//     if (err) {
//       console.error('❌ Query error:', err);
//       return res.status(500).json({ message: 'Error di server' });
//     }
//     if (results.length > 0) {
//       res.json({ message: 'Login sukses', user: results[0] });
//     } else {
//       res.status(401).json({ message: 'Email atau password salah' });
//     }
//   });
// });


// app.listen(port, () => {
//   console.log(`🌐 Server running: http://localhost:${port}`);
// });



const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Login endpoint
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
    const isMatch = await bcrypt.compare(password, user.password); // bandingkan hash

    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    res.json({ message: 'Login sukses', user });
  });
});

// Signup endpoint
app.post('/register', async (req, res) => {
  const { name, email, password, paymentMethod } = req.body;

  try {
    // cek email sudah ada atau belum
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

    // hash password sebelum simpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user baru
    await new Promise((resolve, reject) => {
      const insertSql = `
        INSERT INTO users (name, email, password, payment_method)
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertSql, [name, email, hashedPassword, paymentMethod], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    res.status(201).json({ message: 'Signup berhasil' });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

app.listen(port, () => {
  console.log(`🌐 Server running: http://localhost:${port}`);
});
