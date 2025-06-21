require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

// ✅ Daftar asal yang diizinkan
const allowedOrigins = [
  'http://localhost:3000',
  'https://telekonsultasi.vercel.app',
  'https://3954-36-83-213-135.ngrok-free.app', // ganti sesuai ngrok aktif
];

// ✅ Konfigurasi CORS yang fleksibel
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('❌ CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ Tambahkan route test jika perlu
app.get('/', (req, res) => {
  res.send('Backend Telekonsultasi Aktif');
});

// ✅ ROUTES kamu
app.use('/api/users', require('./routes/users'));
app.use('/api/pengguna', require('./routes/pengguna'));
// dst...

app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});
