// routes/kunjungan.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Ambil daftar kunjungan pasien (status: menunggu), disaring berdasarkan role
router.get('/kunjungan', (req, res) => {
  const role = req.query.role?.toLowerCase();

  let query = 'SELECT * FROM pemeriksaan WHERE status = "menunggu"';
  let params = [];

  if (role && !['superadmin', 'admin', 'administrator'].includes(role)) {
    query += ' AND LOWER(tujuan_konsul) = ?';
    params.push(role);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Gagal mengambil data kunjungan:', err);
      return res.status(500).json({ error: 'Gagal mengambil data kunjungan' });
    }
    res.json(results);
  });
});

// ✅ TERIMA PASIEN + jawaban_konsul
router.post('/:id/terima', (req, res) => {
  const id = req.params.id;
  const { jawaban_konsul } = req.body;

  const query = `UPDATE pemeriksaan SET status = 'diterima', jawaban_konsul = ? WHERE id = ?`;
  db.query(query, [jawaban_konsul, id], (err, result) => {
    if (err) {
      console.error('❌ Gagal menerima pasien:', err);
      return res.status(500).json({ error: 'Gagal menerima pasien' });
    }
    res.json({ message: '✅ Pasien diterima dan jawaban konsul disimpan' });
  });
});

// ❌ BATALKAN PASIEN
router.post('/:id/batal', (req, res) => {
  const id = req.params.id;
  const query = `UPDATE pemeriksaan SET status = 'batal' WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('❌ Gagal membatalkan pasien:', err);
      return res.status(500).json({ error: 'Gagal membatalkan pasien' });
    }
    res.json({ message: '✅ Pasien dibatalkan' });
  });
});

module.exports = router;
