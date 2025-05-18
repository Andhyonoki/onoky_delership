// const mysql = require('mysql');

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',         // default user XAMPP
//   password: '',         // password kosong default
//   database: 'onoky_dealership'  // <-- GANTI dengan nama database kamu
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Koneksi Database Gagal:', err);
//   } else {
//     console.log('Berhasil konek ke Database!');
//   }
// });

// module.exports = db;
// server/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host:     'localhost',
  user:     'root',      // default XAMPP
  password: '',          // default kosong
  database: 'onoky_dealership' // ganti sesuai DB-mu
});

db.connect(err => {
  if (err) {
    console.error('❌ Koneksi DB gagal:', err);
  } else {
    console.log('✅ Berhasil konek ke Database!');
  }
});

module.exports = db;
