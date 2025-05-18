// server/server.js
const express = require('express');
const cors    = require('cors');
const db      = require('./db');

const app  = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // supaya bisa req.body

// Test endpoint
app.get('/', (req, res) => {
  res.send('Backend jalan! 🔥');
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('❌ Query error:', err);
      return res.status(500).json({ message: 'Error di server' });
    }
    if (results.length > 0) {
      res.json({ message: 'Login sukses', user: results[0] });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  });
});

app.listen(port, () => {
  console.log(`🌐 Server running: http://localhost:${port}`);
});
