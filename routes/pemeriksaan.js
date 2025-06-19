const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ POST: Tambah data pemeriksaan
router.post('/', async (req, res) => {
  const {
    pasien_id,
    faskes_asal,
    tujuan_konsul,
    anamnesis,
    diagnosa,
    tanggal,
    status = 'menunggu',
  } = req.body;

  if (!pasien_id || !faskes_asal || !tujuan_konsul || !diagnosa || !tanggal) {
    return res.status(400).json({ error: 'Data pemeriksaan tidak lengkap' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO pemeriksaan (
        pasien_id, faskes_asal, tujuan_konsul, anamnesis, diagnosa, tanggal, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        pasien_id,
        faskes_asal,
        tujuan_konsul,
        anamnesis || '',
        diagnosa,
        tanggal,
        status,
      ]
    );

    res.status(201).json({
      message: '✅ Pemeriksaan berhasil ditambahkan',
      id: result.insertId,
    });
  } catch (err) {
    console.error('❌ Gagal menyimpan pemeriksaan:', err);
    res.status(500).json({ error: 'Gagal menyimpan pemeriksaan' });
  }
});

// ✅ GET: Semua pemeriksaan (dashboard)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.tanggal,
        p.diagnosa,
        p.faskes_asal,
        p.tujuan_konsul,
        p.status,
        ps.nama_lengkap,
        ps.jenis_kelamin,
        TIMESTAMPDIFF(YEAR, ps.tanggal_lahir, CURDATE()) AS umur
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

// ✅ GET: Riwayat semua pemeriksaan (halaman history)
router.get('/riwayat', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.tanggal,
        p.anamnesis,
        p.diagnosa,
        p.faskes_asal,
        p.tujuan_konsul,
        p.status,
        p.jawaban_konsul,
        ps.nama_lengkap,
        ps.jenis_kelamin,
        TIMESTAMPDIFF(YEAR, ps.tanggal_lahir, CURDATE()) AS umur
      FROM pemeriksaan p
      JOIN pasien ps ON p.pasien_id = ps.id
      ORDER BY p.tanggal DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal mengambil riwayat pemeriksaan:', err);
    res.status(500).json({ error: 'Gagal mengambil riwayat pemeriksaan' });
  }
});

// ✅ GET: Riwayat pemeriksaan per pasien
router.get('/riwayat/:pasienId', async (req, res) => {
  const { pasienId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.tanggal,
        p.anamnesis,
        p.diagnosa,
        p.faskes_asal,
        p.tujuan_konsul,
        p.status,
        p.jawaban_konsul
      FROM pemeriksaan p
      WHERE p.pasien_id = ?
      ORDER BY p.tanggal DESC
    `, [pasienId]);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal mengambil riwayat pemeriksaan pasien:', err);
    res.status(500).json({ error: 'Gagal mengambil riwayat pasien' });
  }
});

// ✅ GET: Daftar kunjungan (status = 'menunggu')
router.get('/kunjungan', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.pasien_id,
        p.tanggal,
        p.faskes_asal,
        p.tujuan_konsul,
        p.status,
        ps.nama_lengkap,
        ps.jenis_kelamin,
        TIMESTAMPDIFF(YEAR, ps.tanggal_lahir, CURDATE()) AS umur
      FROM pemeriksaan p
      JOIN pasien ps ON p.pasien_id = ps.id
      WHERE p.status = 'menunggu'
      ORDER BY p.tanggal ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Gagal mengambil data kunjungan:', err);
    res.status(500).json({ error: 'Gagal mengambil data kunjungan' });
  }
});

// ✅ PUT: Update status pemeriksaan (batal / selesai)
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['menunggu', 'batal', 'selesai'].includes(status)) {
    return res.status(400).json({ error: 'Status tidak valid' });
  }

  try {
    await db.query(`UPDATE pemeriksaan SET status = ? WHERE id = ?`, [status, id]);
    res.json({ message: '✅ Status berhasil diperbarui' });
  } catch (err) {
    console.error('❌ Gagal memperbarui status:', err);
    res.status(500).json({ error: 'Gagal memperbarui status' });
  }
});

// ✅ PUT: Terima pemeriksaan dan simpan jawaban konsul
router.put('/:id/terima', async (req, res) => {
  const { id } = req.params;
  const { jawaban_konsul } = req.body;

  try {
    await db.query(
      `UPDATE pemeriksaan SET status = 'diterima', jawaban_konsul = ? WHERE id = ?`,
      [jawaban_konsul, id]
    );
    res.json({ message: '✅ Pasien diterima dan jawaban konsul disimpan' });
  } catch (err) {
    console.error('❌ Gagal menerima pasien:', err);
    res.status(500).json({ error: 'Gagal memproses permintaan' });
  }
});

module.exports = router;
