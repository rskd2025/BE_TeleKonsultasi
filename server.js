require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// ✅ Middleware parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Daftar origin yang diizinkan
const allowedOrigins = [
  'http://localhost:3000',
  'https://telekonsultasi.vercel.app',
  'https://9aee-36-83-213-135.ngrok-free.app', // Ganti sesuai ngrok aktif
];

// ✅ Preflight CORS handler
app.options('*', cors({
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

// ✅ CORS utama
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

// ✅ Logger untuk cek origin masuk
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} dari origin: ${req.headers.origin}`);
  next();
});

// ✅ Tes koneksi
app.get('/', (req, res) => {
  res.send('✅ Backend Telekonsultasi Aktif');
});

// ✅ Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/pengguna', require('./routes/pengguna'));
app.use('/api/faskes', require('./routes/faskes'));
app.use('/api/pasien', require('./routes/pasien'));
app.use('/api/pemeriksaan', require('./routes/pemeriksaan'));
app.use('/api/feedback', require('./routes/feedback'));

// ✅ Jalankan server
app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});
