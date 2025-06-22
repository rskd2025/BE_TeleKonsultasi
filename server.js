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
  'https://cf93-36-83-213-135.ngrok-free.app' // GANTI jika pakai ngrok lain
];

// ✅ Konfigurasi CORS yang benar
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

// ✅ Terapkan middleware CORS global
app.use(cors(corsOptions));

// ✅ Tambahan header manual untuk semua response (wajib agar tidak wildcard)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// ✅ Logger
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} dari ${req.headers.origin}`);
  next();
});

// ✅ Tes koneksi
app.get('/', (req, res) => {
  res.send('✅ Backend Telekonsultasi Aktif');
});

// ✅ Semua route dengan CORS lagi (ekstra aman di ngrok/Vercel)
const routes = [
  ['/api/users', './routes/users'],
  ['/api/pengguna', './routes/pengguna'],
  ['/api/faskes', './routes/faskes'],
  ['/api/pasien', './routes/pasien'],
  ['/api/pemeriksaan', './routes/pemeriksaan'],
  ['/api/feedback', './routes/feedback'],
];

routes.forEach(([path, routePath]) => {
  app.use(path, cors(corsOptions), require(routePath));
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});
