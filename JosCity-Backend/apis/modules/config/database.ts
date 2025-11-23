/* eslint-disable */
import { createPool, PoolOptions } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const dbconfig: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = createPool(dbconfig);

// Let us test the connection

async function testConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to Database");
    connection.release();
  } catch (error) {
    console.log("Database Connection Failed:", error);
  }
}

testConnection();

export default pool;
