const express = require('express');
const router = express.Router();
const db = require('../db');

// GET jumlah pasien per bulan
router.get('/pasien-per-bulan', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE_FORMAT(tanggal, '%Y-%m') AS bulan, COUNT(*) AS jumlah_pasien
      FROM pemeriksaan
      GROUP BY bulan
      ORDER BY bulan
    `);
    res.json(rows); // ⬅️ PENTING: Harus kirim JSON meskipun rows = []
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data pasien per bulan' });
  }
});

module.exports = router;
