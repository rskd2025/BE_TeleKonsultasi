const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// 🔧 Fungsi bantu nama lengkap
function formatNamaLengkap(gelarDepan, namaDepan, gelarBelakang) {
  const depan = gelarDepan ? `${gelarDepan}. ` : '';
  const belakang = gelarBelakang ? ` ${gelarBelakang}` : '';
  return `${depan}${namaDepan}${belakang}`.trim();
}

// 🔍 GET semua pengguna
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM pengguna');
    const sanitized = results.map(row => ({
      id: row.id || '',
      nip: row.nip || '',
      gelar_depan: row.gelar_depan || '',
      nama_depan: row.nama_depan || '',
      gelar_belakang: row.gelar_belakang || '',
      nama_lengkap: row.nama_lengkap || '',
      tempat_lahir: row.tempat_lahir || '',
      tanggal_lahir: row.tanggal_lahir ? row.tanggal_lahir.toISOString().split('T')[0] : '',
      jenis_kelamin: row.jenis_kelamin || '',
      agama: row.agama || '',
      jenis_profesi: row.jenis_profesi || '',
      alamat_lengkap: row.alamat_lengkap || '',
      status: row.status || ''
    }));
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ POST tambah pengguna
router.post('/', async (req, res) => {
  const {
    nip = '', gelar_depan = '', nama_depan = '', gelar_belakang = '',
    tempat_lahir = '', tanggal_lahir = '', jenis_kelamin = '',
    agama = '', jenis_profesi = '', alamat_lengkap = '', status = ''
  } = req.body;

  if (!nama_depan || !jenis_kelamin) {
    return res.status(400).json({ error: 'Nama depan dan jenis kelamin wajib diisi' });
  }

  const nama_lengkap = formatNamaLengkap(gelar_depan, nama_depan, gelar_belakang);

  try {
    const [result] = await db.query(
      `INSERT INTO pengguna 
        (nip, gelar_depan, nama_depan, gelar_belakang, nama_lengkap, tempat_lahir, tanggal_lahir, 
         jenis_kelamin, agama, jenis_profesi, alamat_lengkap, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nip, gelar_depan, nama_depan, gelar_belakang,
        nama_lengkap, tempat_lahir, tanggal_lahir,
        jenis_kelamin, agama, jenis_profesi, alamat_lengkap, status
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Pengguna berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ PUT update pengguna
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nip = '', gelar_depan = '', nama_depan = '', gelar_belakang = '',
    tempat_lahir = '', tanggal_lahir = '', jenis_kelamin = '',
    agama = '', jenis_profesi = '', alamat_lengkap = '', status = ''
  } = req.body;

  const nama_lengkap = formatNamaLengkap(gelar_depan, nama_depan, gelar_belakang);

  try {
    await db.query(
      `UPDATE pengguna SET 
        nip = ?, gelar_depan = ?, nama_depan = ?, gelar_belakang = ?,
        nama_lengkap = ?, tempat_lahir = ?, tanggal_lahir = ?,
        jenis_kelamin = ?, agama = ?, jenis_profesi = ?, alamat_lengkap = ?,
        status = ?
       WHERE id = ?`,
      [
        nip, gelar_depan, nama_depan, gelar_belakang,
        nama_lengkap, tempat_lahir, tanggal_lahir,
        jenis_kelamin, agama, jenis_profesi, alamat_lengkap,
        status, id
      ]
    );
    res.json({ message: 'Pengguna berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ DELETE pengguna
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM pengguna WHERE id = ?', [id]);
    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 PUT atur username, password, dan role pengguna
router.put('/:id/password', async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, dan role wajib diisi' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (pengguna_id, username, password, role)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         username = VALUES(username),
         password = VALUES(password),
         role = VALUES(role)`,
      [id, username, hashedPassword, role]
    );

    res.json({ message: 'Akun login berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menyimpan akun login' });
  }
});

module.exports = router;
