const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔹 Total pasien, faskes, user (untuk kotak info statistik umum)
router.get('/total', async (req, res) => {
  try {
    const [[{ total_pasien }]] = await db.query('SELECT COUNT(*) AS total_pasien FROM pasien');
    const [[{ total_faskes }]] = await db.query('SELECT COUNT(*) AS total_faskes FROM faskes');
    const [[{ total_user }]] = await db.query('SELECT COUNT(*) AS total_user FROM pengguna');

    res.json({
      pasien: total_pasien,
      faskes: total_faskes,
      user: total_user
    });
  } catch (err) {
    console.error('❌ Gagal ambil total statistik:', err);
    res.status(500).json({ error: 'Gagal ambil statistik' });
  }
});

// 🔹 Pemeriksaan (untuk dashboard)
router.get('/pemeriksaan', async (req, res) => {
  try {
    const [[{ total_pasien }]] = await db.query('SELECT COUNT(*) AS total_pasien FROM pasien');
    const [[{ sudah_diperiksa }]] = await db.query('SELECT COUNT(DISTINCT pasien_id) AS sudah_diperiksa FROM pemeriksaan');

    const belum_diperiksa = total_pasien - sudah_diperiksa;

    res.json({
      total_pasien,
      sudah_diperiksa,
      belum_diperiksa
    });
  } catch (err) {
    console.error('❌ Gagal ambil data pemeriksaan:', err);
    res.status(500).json({ error: 'Gagal ambil data pemeriksaan' });
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

// 🔹 Statistik pasien per bulan
router.get('/perbulan', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(tanggal, '%Y-%m') AS bulan, 
        COUNT(*) AS jumlah 
      FROM pemeriksaan 
      GROUP BY bulan 
      ORDER BY bulan ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal ambil statistik bulanan:', err);
    res.status(500).json({ error: 'Gagal ambil statistik per bulan' });
  }
});

// 🔹 Statistik pasien per tahun
router.get('/pertahun', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        YEAR(tanggal) AS tahun, 
        COUNT(*) AS jumlah 
      FROM pemeriksaan 
      GROUP BY tahun 
      ORDER BY tahun ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal ambil statistik tahunan:', err);
    res.status(500).json({ error: 'Gagal ambil statistik per tahun' });
  }
});

module.exports = router;
