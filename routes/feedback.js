// routes/feedback.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ GET semua feedback konsul lengkap
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.id,
        p.nama_lengkap,
        TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) AS umur,
        pr.faskes_asal,
        f.tujuan_konsul,
        f.tanggal,
        pr.diagnosa,
        pr.anamnesis,
        f.jawaban_konsul
      FROM feedback f
      JOIN pasien p ON f.pasien_id = p.id
      LEFT JOIN (
        SELECT a.*
        FROM pemeriksaan a
        INNER JOIN (
          SELECT pasien_id, MAX(tanggal) AS latest
          FROM pemeriksaan
          GROUP BY pasien_id
        ) b ON a.pasien_id = b.pasien_id AND a.tanggal = b.latest
      ) pr ON pr.pasien_id = f.pasien_id
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
  const { pasien_id, tanggal, tujuan_konsul, jawaban_konsul } = req.body;

  if (!pasien_id || !tanggal || !tujuan_konsul) {
    return res.status(400).json({ error: 'Field wajib tidak boleh kosong' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO feedback (pasien_id, tanggal, tujuan_konsul, jawaban_konsul)
       VALUES (?, ?, ?, ?)`,
      [pasien_id, tanggal, tujuan_konsul, jawaban_konsul || null]
    );
    res.status(201).json({ message: '✅ Feedback berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    console.error('❌ Gagal menyimpan feedback:', err);
    res.status(500).json({ error: 'Gagal menyimpan feedback' });
  }
});

module.exports = router;
