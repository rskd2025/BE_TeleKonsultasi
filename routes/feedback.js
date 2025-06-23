const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ GET semua feedback konsul lengkap
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        fb.id,
        fb.tanggal AS tanggal_feedback,
        pr.tanggal AS tanggal_kunjungan,
        p.nama_lengkap,
        p.no_rm,
        p.jenis_kelamin,
        TIMESTAMPDIFF(YEAR, p.tanggal_lahir, CURDATE()) AS umur,
        fk.nama AS faskes_asal,
        pr.tujuan_konsul,
        pr.diagnosa,
        pr.anamnesis,
        fb.jawaban AS jawaban_konsul
      FROM feedback fb
      JOIN pemeriksaan pr ON fb.pemeriksaan_id = pr.id
      JOIN pasien p ON pr.pasien_id = p.id
      LEFT JOIN faskes fk ON pr.faskes_asal = fk.kode OR pr.faskes_asal = fk.nama
      ORDER BY fb.tanggal DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal mengambil data feedback:', err);
    res.status(500).json({ error: 'Gagal mengambil data feedback' });
  }
});

// ✅ POST feedback baru
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
