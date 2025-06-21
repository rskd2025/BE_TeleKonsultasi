const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔍 Ambil daftar kunjungan berdasarkan role
router.get('/kunjungan', async (req, res) => {
  const role = req.query.role?.toLowerCase();
  let bidang = null;

  // 🎯 Hanya filter jika bukan admin/superadmin
  if (!['superadmin', 'admin', 'administrator'].includes(role)) {
    bidang =
      role === 'psikolog'
        ? 'Psikolog'
        : role === 'psikiater'
        ? 'Psikiater'
        : role === 'perawat jiwa'
        ? 'Perawat Jiwa'
        : null;
  }

  let query = `
    SELECT 
      pemeriksaan.id,
      pemeriksaan.pasien_id,
      pasien.nama_lengkap,
      pasien.jenis_kelamin,
      pasien.umur,
      pemeriksaan.anamnesis,
      pemeriksaan.diagnosa,
      pemeriksaan.tujuan_konsul,
      pemeriksaan.tanggal,
      pemeriksaan.status,
      faskes.nama AS faskes_asal
    FROM pemeriksaan
    JOIN pasien ON pemeriksaan.pasien_id = pasien.id
    LEFT JOIN faskes ON faskes.kode = pemeriksaan.faskes_asal
    WHERE pemeriksaan.status = 'menunggu'
  `;

  const params = [];

  if (bidang) {
    query += ' AND pemeriksaan.tujuan_konsul = ?';
    params.push(bidang);
  }

  query += ' ORDER BY pemeriksaan.tanggal DESC';

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal mengambil data kunjungan:', err);
    res.status(500).json({ error: 'Gagal mengambil data kunjungan' });
  }
});

module.exports = router;
