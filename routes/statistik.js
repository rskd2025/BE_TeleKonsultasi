const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔹 Statistik per hari (misalnya 7 hari terakhir)
router.get('/perhari', async (req, res) => {
  const [rows] = await db.query(`
    SELECT DATE(tanggal) as tanggal, COUNT(*) as total
    FROM pemeriksaan
    GROUP BY DATE(tanggal)
    ORDER BY tanggal DESC
    LIMIT 7
  `);
  res.json(rows);
});

// 🔹 Statistik per bulan (dalam tahun ini)
router.get('/perbulan', async (req, res) => {
  const [rows] = await db.query(`
    SELECT MONTH(tanggal) as bulan, COUNT(*) as total
    FROM pemeriksaan
    WHERE YEAR(tanggal) = YEAR(CURDATE())
    GROUP BY MONTH(tanggal)
    ORDER BY bulan
  `);
  res.json(rows);
});

// 🔹 Statistik per tahun
router.get('/pertahun', async (req, res) => {
  const [rows] = await db.query(`
    SELECT YEAR(tanggal) as tahun, COUNT(*) as total
    FROM pemeriksaan
    GROUP BY YEAR(tanggal)
    ORDER BY tahun
  `);
  res.json(rows);
});

module.exports = router;
