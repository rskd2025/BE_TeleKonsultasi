require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// ✅ Parsing body request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Daftar asal yang diizinkan
const allowedOrigins = [
  'http://localhost:3000',
  'https://telekonsultasi.vercel.app',
  'https://2884-36-83-213-135.ngrok-free.app' // ganti sesuai ngrok aktif
];

// ✅ Konfigurasi CORS final
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('❌ CORS ditolak untuk origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Tambahan header untuk response (optional tapi aman)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ✅ Logger (debug)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} dari ${req.headers.origin}`);
  next();
});

// ✅ Tes koneksi
app.get('/', (req, res) => {
  res.send('✅ Backend Telekonsultasi Aktif');
});

// ✅ Semua route
app.use('/api/users', require('./routes/users'));
app.use('/api/pengguna', require('./routes/pengguna'));
app.use('/api/faskes', require('./routes/faskes'));
app.use('/api/pasien', require('./routes/pasien'));
app.use('/api/pemeriksaan', require('./routes/pemeriksaan'));
app.use('/api/feedback', require('./routes/feedback'));

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});
