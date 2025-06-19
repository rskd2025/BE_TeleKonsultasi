require('dotenv').config(); // ⬅️ Tambahkan ini di baris paling atas

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// ✅ Allowed origins termasuk Vercel & ngrok
const allowedOrigins = [
  'http://localhost:3000',
  'https://telekonsultasi.vercel.app',
  process.env.NGROK_URL,
];

// ✅ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());

// ✅ Import Routes
const pemeriksaanRoutes = require('./routes/pemeriksaan');
const faskesRoutes = require('./routes/faskes');
const penggunaRoutes = require('./routes/pengguna');
const userRoutes = require('./routes/users');
const pasienRoutes = require('./routes/pasien');
const feedbackRoutes = require('./routes/feedback');

// ✅ Gunakan Routes
app.use('/api/pemeriksaan', pemeriksaanRoutes);
app.use('/api/faskes', faskesRoutes);
app.use('/api/pengguna', penggunaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pasien', pasienRoutes);
app.use('/api/feedback', feedbackRoutes);

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('🩺 Mental Health API berjalan!');
});

// ✅ Jalankan Server
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
