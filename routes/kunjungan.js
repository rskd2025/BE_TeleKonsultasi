// routes/kunjungan.js
const express = require('express');
const router = express.Router();
const db = require('../db');

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
