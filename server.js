// server.js
require('dotenv').config(); // ⬅️ Load .env di awal

const express = require('express');
const cors = require('cors');
const app = express();

// Gunakan PORT dari .env atau default 5000
const port = process.env.PORT || 5000;

// ✅ Daftar asal yang diizinkan untuk CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https://telekonsultasi.vercel.app',
  'https://3954-36-83-213-135.ngrok-free.app', // Ganti saat ngrok berubah,
];

// Tambahkan ngrok URL jika tersedia di .env
if (process.env.NGROK_URL) {
  allowedOrigins.push(process.env.NGROK_URL);
}

// ✅ Middleware CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Tidak diizinkan oleh CORS: ' + origin));
    }
  },
  credentials: true,
}));

// ✅ Middleware JSON body
app.use(express.json());

// ✅ Routes
app.use('/api/pemeriksaan', require('./routes/pemeriksaan'));
app.use('/api/faskes', require('./routes/faskes'));
app.use('/api/pengguna', require('./routes/pengguna'));
app.use('/api/users', require('./routes/users'));
app.use('/api/pasien', require('./routes/pasien'));
app.use('/api/feedback', require('./routes/feedback'));

// ✅ Default test endpoint
app.get('/', (req, res) => {
  res.send('🩺 Mental Health API berjalan!');
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
