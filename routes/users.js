const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// ==========================================
// ✅ LOGIN
// ==========================================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  try {
    const [results] = await db.query(
      `SELECT u.*, p.nama_lengkap 
       FROM users u 
       JOIN pengguna p ON u.pengguna_id = p.id 
       WHERE u.username = ?`,
      [username]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: '❌ Username tidak ditemukan' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '❌ Password salah' });
    }

    let groupAkses = [];
    let modulAkses = [];
    try {
      groupAkses = JSON.parse(user.groupAkses || '[]');
      modulAkses = JSON.parse(user.modulAkses || '[]');
    } catch (err) {
      console.warn('❗ Gagal parsing hak akses:', err);
    }

    res.json({
      message: '✅ Login berhasil',
      user: {
        id: user.pengguna_id,
        nama_lengkap: user.nama_lengkap,
        username: user.username,
        role: user.role,
        groupAkses,
        modulAkses,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// ==========================================
// ✅ ATUR PASSWORD OLEH ADMIN
// ==========================================
router.put('/pengguna/:id/password', async (req, res) => {
  const pengguna_id = req.params.id;
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Data tidak lengkap' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existing] = await db.query(
      'SELECT * FROM users WHERE pengguna_id = ?',
      [pengguna_id]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE users SET username = ?, password = ?, role = ? WHERE pengguna_id = ?',
        [username, hashedPassword, role, pengguna_id]
      );
    } else {
      await db.query(
        'INSERT INTO users (username, password, role, pengguna_id) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, role, pengguna_id]
      );
    }

    res.json({ message: '✅ Password berhasil disimpan' });
  } catch (error) {
    console.error('Gagal menyimpan password:', error);
    res.status(500).json({ error: 'Gagal menyimpan password' });
  }
});

// ==========================================
// ✅ UBAH PASSWORD OLEH USER SENDIRI
// ==========================================
router.put('/change-password/:id', async (req, res) => {
  const pengguna_id = req.params.id;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({ message: 'Password dan konfirmasi wajib diisi' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Konfirmasi password tidak cocok' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'UPDATE users SET password = ? WHERE pengguna_id = ?',
      [hashedPassword, pengguna_id]
    );

    res.json({ message: '✅ Password berhasil diubah' });
  } catch (error) {
    console.error('Gagal ubah password:', error);
    res.status(500).json({ message: '❌ Gagal ubah password' });
  }
});

// ==========================================
// ✅ SIMPAN HAK AKSES (modulAkses dan groupAkses)
// ==========================================
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { groupAkses, modulAkses } = req.body;

  try {
    await db.query(
      'UPDATE users SET groupAkses = ?, modulAkses = ? WHERE pengguna_id = ?',
      [JSON.stringify(groupAkses || []), JSON.stringify(modulAkses || []), id]
    );

    res.json({ message: '✅ Hak akses berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal update hak akses:', err);
    res.status(500).json({ message: '❌ Gagal menyimpan hak akses' });
  }
});

module.exports = router;
