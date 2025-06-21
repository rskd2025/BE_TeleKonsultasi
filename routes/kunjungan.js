// routes/kunjungan.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Ambil daftar kunjungan pasien (status: menunggu), disaring berdasarkan role
router.get('/kunjungan', (req, res) => {
  const role = req.query.role?.toLowerCase();
  let bidang = null;

  if (!['superadmin', 'admin', 'administrator'].includes(role)) {
    bidang = role === 'psikolog' ? 'Psikolog'
          : role === 'psikiater' ? 'Psikiater'
          : role === 'perawat jiwa' ? 'Perawat Jiwa'
          : null;
  }

  let query = 'SELECT * FROM pemeriksaan WHERE status = "menunggu"';
  let params = [];

  if (bidang) {
    query += ' AND tujuan_konsul = ?';
    params.push(bidang);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Gagal mengambil data kunjungan:', err);
      return res.status(500).json({ error: 'Gagal mengambil data kunjungan' });
    }
    res.json(results);
  });
});

module.exports = router;
