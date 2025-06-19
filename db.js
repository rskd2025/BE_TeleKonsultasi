// db.js
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root123',
  database: process.env.DB_NAME || 'mental_health_app',
  port: process.env.DB_PORT || 3306,
  multipleStatements: false // Hindari SQL injection
});

db.connect((err) => {
  if (err) {
    console.error('❌ Koneksi database gagal:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Terkoneksi ke database MySQL');
  }
});

// Ekspor dengan Promise untuk async/await
module.exports = db.promise();
