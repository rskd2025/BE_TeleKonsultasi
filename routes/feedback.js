const express = require('express');
const router = express.Router();
const db = require('../db');

// GET semua feedback konsul lengkap
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.id,
        p.nama_lengkap,
        TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) AS umur,
        fk.nama AS faskes_asal,
        pr.tujuan_konsul,
        f.tanggal,
        pr.diagnosa,
        pr.anamnesis,
        f.jawaban AS jawaban_konsul
      FROM feedback f
      JOIN pemeriksaan pr ON f.pemeriksaan_id = pr.id
      JOIN pasien p ON pr.pasien_id = p.id
      LEFT JOIN faskes fk ON pr.faskes_asal = fk.kode
      ORDER BY f.tanggal DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal mengambil data feedback:', err);
    res.status(500).json({ error: 'Gagal mengambil data feedback' });
  }
});

// POST feedback baru
router.post('/', async (req, res) => {
  const { pemeriksaan_id, user_id, jawaban, tanggal } = req.body;

  if (!pemeriksaan_id || !jawaban) {
    return res.status(400).json({ error: 'Field wajib tidak boleh kosong' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO feedback (pemeriksaan_id, user_id, jawaban, tanggal)
       VALUES (?, ?, ?, ?)`,
      [pemeriksaan_id, user_id || null, jawaban, tanggal || new Date()]
    );
    res.status(201).json({ message: '✅ Feedback berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    console.error('❌ Gagal menyimpan feedback:', err);
    res.status(500).json({ error: 'Gagal menyimpan feedback' });
  }
});

module.exports = router;
