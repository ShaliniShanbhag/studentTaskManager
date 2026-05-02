import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Automatically enable SSL for remote cloud databases (Aiven, Railway, etc.)
  ssl: process.env.DB_HOST && !process.env.DB_HOST.includes('localhost') && !process.env.DB_HOST.includes('127.0.0.1') ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`MySQL DB connected successfully: ${connection.config.database}`);
    connection.release();
  } catch (error) {
    console.error('Error connecting to MySQL DB:', error.message);
    process.exit(1);
  }
};

export default pool;
