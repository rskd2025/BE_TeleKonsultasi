const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔧 Fungsi generate nomor rekam medis otomatis
function generateNoRM() {
  const date = new Date();
  const year = String(date.getFullYear()).slice(2); // e.g., '25'
  const month = String(date.getMonth() + 1).padStart(2, '0'); // '01'-'12'
  const random = Math.floor(1000 + Math.random() * 9000); // 4 digit acak
  return `RM${year}${month}${random}`;
}

// ✅ GET: Semua data pasien (untuk kunjungan)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM pasien ORDER BY id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal mengambil data pasien:', err);
    res.status(500).json({ error: 'Gagal mengambil data pasien' });
  }
});

// ✅ POST: Tambah pasien baru
router.post('/', async (req, res) => {
  const {
    nama_lengkap,
    nik,
    tanggal_lahir,
    jenis_kelamin,
    alamat,
    no_hp_pasien,
    no_hp_pengantar,
  } = req.body;

  const no_rm = generateNoRM();

  try {
    const [result] = await db.query(
      `INSERT INTO pasien (
        nama_lengkap, nik, no_rm, tanggal_lahir, jenis_kelamin,
        alamat, no_hp, no_hp_pengantar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nama_lengkap,
        nik,
        no_rm,
        tanggal_lahir,
        jenis_kelamin,
        alamat,
        no_hp_pasien,
        no_hp_pengantar,
      ]
    );

    res.status(201).json({
      message: '✅ Pasien berhasil ditambahkan',
      id: result.insertId,
      no_rm,
    });
  } catch (err) {
    console.error('❌ Gagal menyimpan pasien:', err);
    res.status(500).json({ error: 'Gagal menyimpan pasien' });
  }
});

// ✅ GET: Detail pasien berdasarkan ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query(`SELECT * FROM pasien WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pasien tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Gagal mengambil data pasien:', err);
    res.status(500).json({ error: 'Gagal mengambil data pasien' });
  }
});

// ✅ GET: Cari pasien berdasarkan nama atau no_rm
router.get('/cari', async (req, res) => {
  const query = req.query.query || '';
  try {
    const [rows] = await db.query(
      `SELECT id, nama_lengkap, no_rm, jenis_kelamin, tanggal_lahir
       FROM pasien
       WHERE nama_lengkap LIKE ? OR no_rm LIKE ?
       ORDER BY nama_lengkap
       LIMIT 10`,
      [`%${query}%`, `%${query}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal mencari pasien:', err);
    res.status(500).json({ error: 'Gagal mencari pasien' });
  }
});

module.exports = router;
