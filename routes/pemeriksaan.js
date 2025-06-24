const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Ambil semua data pemeriksaan
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.pasien_id, ps.nama, p.diagnosa, p.anamnesis, p.faskes_asal, p.tujuan_konsul, p.tanggal, p.status, p.jawaban_konsul
      FROM pemeriksaan p
      JOIN pasien ps ON p.pasien_id = ps.id
      ORDER BY p.tanggal DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal mengambil data pemeriksaan:', err);
    res.status(500).json({ error: 'Gagal mengambil data pemeriksaan' });
  }
});

// ✅ Tambah data pemeriksaan baru
router.post('/', async (req, res) => {
  try {
    const { pasien_id, diagnosa, anamnesis, faskes_asal, tujuan_konsul, tanggal, status, jawaban_konsul } = req.body;
    const [result] = await db.query(
      `INSERT INTO pemeriksaan (pasien_id, diagnosa, anamnesis, faskes_asal, tujuan_konsul, tanggal, status, jawaban_konsul)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [pasien_id, diagnosa, anamnesis, faskes_asal, tujuan_konsul, tanggal, status, jawaban_konsul]
    );
    res.json({ message: 'Pemeriksaan berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    console.error('❌ Gagal menambahkan pemeriksaan:', err);
    res.status(500).json({ error: 'Gagal menambahkan pemeriksaan' });
  }
});

// ✅ Ambil data pemeriksaan berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pemeriksaan WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Pemeriksaan tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Gagal mengambil pemeriksaan:', err);
    res.status(500).json({ error: 'Gagal mengambil pemeriksaan' });
  }
});

// ✅ Update data pemeriksaan berdasarkan ID
router.put('/:id', async (req, res) => {
  try {
    const { diagnosa, anamnesis, faskes_asal, tujuan_konsul, tanggal, status, jawaban_konsul } = req.body;
    await db.query(
      `UPDATE pemeriksaan SET diagnosa = ?, anamnesis = ?, faskes_asal = ?, tujuan_konsul = ?, tanggal = ?, status = ?, jawaban_konsul = ? WHERE id = ?`,
      [diagnosa, anamnesis, faskes_asal, tujuan_konsul, tanggal, status, jawaban_konsul, req.params.id]
    );
    res.json({ message: 'Pemeriksaan berhasil diperbarui' });
  } catch (err) {
    console.error('❌ Gagal memperbarui pemeriksaan:', err);
    res.status(500).json({ error: 'Gagal memperbarui pemeriksaan' });
  }
});

// ✅ Hapus data pemeriksaan berdasarkan ID
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM pemeriksaan WHERE id = ?', [req.params.id]);
    res.json({ message: 'Pemeriksaan berhasil dihapus' });
  } catch (err) {
    console.error('❌ Gagal menghapus pemeriksaan:', err);
    res.status(500).json({ error: 'Gagal menghapus pemeriksaan' });
  }
});

module.exports = router;
