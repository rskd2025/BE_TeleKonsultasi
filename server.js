// server.js
require('dotenv').config(); // ⬅️ Load .env di awal

const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

// ✅ Daftar asal yang diizinkan untuk CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https://telekonsultasi.vercel.app',
  'https://3954-36-83-213-135.ngrok-free.app', // ganti saat ngrok berubah
];

if (process.env.NGROK_URL) {
  allowedOrigins.push(process.env.NGROK_URL);
}

// ✅ Middleware CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin: ' + origin));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Route test
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Import semua routes
app.use('/api/users', require('./routes/users'));
app.use('/api/pengguna', require('./routes/pengguna'));
app.use('/api/faskes', require('./routes/faskes'));
app.use('/api/pemeriksaan', require('./routes/pemeriksaan'));
app.use('/api/feedback', require('./routes/feedback'));

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});
