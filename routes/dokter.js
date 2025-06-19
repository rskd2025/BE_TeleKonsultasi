const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔍 GET semua dokter dari tabel pengguna
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        id,
        nip,
        gelar_depan,
        nama_depan,
        gelar_belakang,
        CONCAT_WS(' ', 
          IFNULL(CONCAT(gelar_depan, '.'), ''), 
          nama_depan, 
          gelar_belakang
        ) AS nama_lengkap,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        agama,
        alamat_lengkap
      FROM pengguna
      WHERE LOWER(jenis_profesi) = 'dokter'
    `);

    const formatted = results.map(row => ({
      id: row.id || '',
      nip: row.nip || '',
      nama_lengkap: row.nama_lengkap || '',
      tempat_lahir: row.tempat_lahir || '',
      tanggal_lahir: row.tanggal_lahir ? row.tanggal_lahir.toISOString().split('T')[0] : '',
      jenis_kelamin: row.jenis_kelamin || '',
      agama: row.agama || '',
      alamat_lengkap: row.alamat_lengkap || ''
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Gagal mengambil data dokter:', err.message);
    res.status(500).json({ error: 'Gagal mengambil data dokter', detail: err.message });
  }
});

module.exports = router;
