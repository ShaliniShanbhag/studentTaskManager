import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 21140,
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
    
    // Self-healing database migration for user settings/preferences
    const [columns] = await connection.query("SHOW COLUMNS FROM users");
    const columnNames = columns.map(c => c.Field);
    
    if (!columnNames.includes('theme')) {
      await connection.query("ALTER TABLE users ADD COLUMN theme VARCHAR(20) DEFAULT 'light'");
      console.log("Added 'theme' column to users table");
    }
    if (!columnNames.includes('daily_target')) {
      await connection.query("ALTER TABLE users ADD COLUMN daily_target INT DEFAULT 3");
      console.log("Added 'daily_target' column to users table");
    }
    if (!columnNames.includes('default_category')) {
      await connection.query("ALTER TABLE users ADD COLUMN default_category VARCHAR(50) DEFAULT 'Other'");
      console.log("Added 'default_category' column to users table");
    }
    if (!columnNames.includes('ai_enabled')) {
      await connection.query("ALTER TABLE users ADD COLUMN ai_enabled TINYINT(1) DEFAULT 1");
      console.log("Added 'ai_enabled' column to users table");
    }
    if (!columnNames.includes('notifications_enabled')) {
      await connection.query("ALTER TABLE users ADD COLUMN notifications_enabled TINYINT(1) DEFAULT 0");
      console.log("Added 'notifications_enabled' column to users table");
    }
    if (!columnNames.includes('security_question')) {
      await connection.query("ALTER TABLE users ADD COLUMN security_question VARCHAR(255) DEFAULT NULL");
      console.log("Added 'security_question' column to users table");
    }
    if (!columnNames.includes('security_answer')) {
      await connection.query("ALTER TABLE users ADD COLUMN security_answer VARCHAR(255) DEFAULT NULL");
      console.log("Added 'security_answer' column to users table");
    }
    
    connection.release();
  } catch (error) {
    console.error('Error connecting to MySQL DB:', error.message);
    process.exit(1);
  }
};

export default pool;
