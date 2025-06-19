const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Ambil semua data faskes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM faskes ORDER BY nama ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Tambah faskes baru
router.post('/', async (req, res) => {
  const { nama, kode, jenis, kabupaten, provinsi } = req.body;

  if (!nama || !kode || !jenis || !kabupaten || !provinsi) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  try {
    await db.query(
      'INSERT INTO faskes (nama, kode, jenis, kabupaten, provinsi) VALUES (?, ?, ?, ?, ?)',
      [nama, kode, jenis, kabupaten, provinsi]
    );
    res.status(201).json({ message: '✅ Faskes berhasil ditambahkan' });
  } catch (err) {
    console.error('Gagal tambah faskes:', err);
    res.status(500).json({ error: '❌ Gagal menambahkan faskes' });
  }
});

// 📝 Edit faskes
router.put('/:id', async (req, res) => {
  const { nama, kode, jenis, kabupaten, provinsi } = req.body;

  if (!nama || !kode || !jenis || !kabupaten || !provinsi) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  try {
    await db.query(
      'UPDATE faskes SET nama = ?, kode = ?, jenis = ?, kabupaten = ?, provinsi = ? WHERE id = ?',
      [nama, kode, jenis, kabupaten, provinsi, req.params.id]
    );
    res.json({ message: '✅ Data faskes berhasil diupdate' });
  } catch (err) {
    console.error('Gagal update faskes:', err);
    res.status(500).json({ error: '❌ Gagal update faskes' });
  }
});

// 🗑️ Hapus faskes
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM faskes WHERE id = ?', [req.params.id]);
    res.json({ message: '🗑️ Faskes berhasil dihapus' });
  } catch (err) {
    console.error('Gagal hapus faskes:', err);
    res.status(500).json({ error: '❌ Gagal hapus faskes' });
  }
});

module.exports = router;
