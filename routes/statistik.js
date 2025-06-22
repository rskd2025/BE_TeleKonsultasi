const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔹 Total pasien, faskes, user
router.get('/total', async (req, res) => {
  try {
    const [[{ total_pasien }]] = await db.query('SELECT COUNT(*) AS total_pasien FROM pasien');
    const [[{ total_faskes }]] = await db.query('SELECT COUNT(*) AS total_faskes FROM faskes');
    const [[{ total_user }]] = await db.query('SELECT COUNT(*) AS total_user FROM pengguna');

    res.json({
      pasien: total_pasien,
      faskes: total_faskes,
      user: total_user,
    });
  } catch (err) {
    console.error('❌ Gagal ambil total statistik:', err);
    res.status(500).json({ error: 'Gagal ambil statistik' });
  }
});

// 🔹 Statistik pasien per hari
router.get('/perhari', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE(tanggal) as tanggal, COUNT(*) as jumlah
      FROM pemeriksaan
      GROUP BY DATE(tanggal)
      ORDER BY tanggal ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal ambil statistik harian:', err);
    res.status(500).json({ error: 'Gagal ambil statistik per hari' });
  }
});

module.exports = router;
