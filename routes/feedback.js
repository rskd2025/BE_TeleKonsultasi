const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ GET semua feedback konsul, termasuk data pasien dan peran user
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.id,
        f.pasien_id,
        f.feedback,
        f.tanggal,
        p.nama_lengkap,
        p.jenis_kelamin,
        TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) AS umur,
        p.role AS peran_pengguna,
        pr.diagnosa
      FROM feedback f
      JOIN pasien p ON f.pasien_id = p.id
      LEFT JOIN (
        SELECT pasien_id, diagnosa
        FROM pemeriksaan
        ORDER BY tanggal DESC
      ) pr ON pr.pasien_id = f.pasien_id
      GROUP BY f.id
      ORDER BY f.tanggal DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal mengambil data feedback:', err);
    res.status(500).json({ error: 'Gagal mengambil data feedback' });
  }
});

// ✅ POST feedback baru
router.post('/', async (req, res) => {
  const { pasien_id, feedback, tanggal } = req.body;
  if (!pasien_id || !feedback || !tanggal) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO feedback (pasien_id, feedback, tanggal) VALUES (?, ?, ?)',
      [pasien_id, feedback, tanggal]
    );
    res.status(201).json({ message: '✅ Feedback berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    console.error('❌ Gagal menyimpan feedback:', err);
    res.status(500).json({ error: 'Gagal menyimpan feedback' });
  }
});

module.exports = router;
