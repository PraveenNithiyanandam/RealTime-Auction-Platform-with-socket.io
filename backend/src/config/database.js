// config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'auction_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(' Database connected successfully');
    connection.release();
  } catch (error) {
    console.error(' Database connection failed:', error.message);
  }
}

testDBConnection();

module.exports = pool;
