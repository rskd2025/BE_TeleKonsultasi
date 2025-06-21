require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

// ✅ Middleware body parser WAJIB
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Daftar asal yang diizinkan (CORS)
const allowedOrigins = [
  'http://localhost:3000',
  'https://telekonsultasi.vercel.app',
  'https://3954-36-83-213-135.ngrok-free.app', // ganti sesuai ngrok aktif
];

// ✅ Middleware CORS dinamis
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

// ✅ Rute tes
app.get('/', (req, res) => {
  res.send('✅ Backend Telekonsultasi Aktif');
});

// ✅ Import semua routes
const pasienRoutes = require('./routes/pasien'); // ⬅️ Tambahkan ini
app.use('/api/pasien', pasienRoutes);

app.use('/api/users', require('./routes/users'));
app.use('/api/pengguna', require('./routes/pengguna'));
app.use('/api/faskes', require('./routes/faskes'));
app.use('/api/pemeriksaan', require('./routes/pemeriksaan'));
app.use('/api/feedback', require('./routes/feedback'));

// ✅ Jalankan server
app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});
