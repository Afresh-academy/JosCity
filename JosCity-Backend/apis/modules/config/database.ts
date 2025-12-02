/* eslint-disable */
import { Pool, PoolClient, QueryResult } from "pg";
import dotenv from "dotenv";
dotenv.config();

// PostgreSQL connection pool configuration
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// PostgreSQL native database interface
interface DatabaseConnection {
  query(query: string, params?: any[]): Promise<QueryResult>;
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  release(): void;
}

const db = {
  // Execute query - returns PostgreSQL QueryResult
  async query(query: string, params: any[] = []): Promise<QueryResult> {
    return await pool.query(query, params);
  },

  // Get connection for transactions
  async getConnection(): Promise<DatabaseConnection> {
    const client: PoolClient = await pool.connect();

    return {
      query: async (
        query: string,
        params: any[] = []
      ): Promise<QueryResult> => {
        return await client.query(query, params);
      },
      beginTransaction: async (): Promise<void> => {
        await client.query("BEGIN");
      },
      commit: async (): Promise<void> => {
        await client.query("COMMIT");
      },
      rollback: async (): Promise<void> => {
        await client.query("ROLLBACK");
      },
      release: (): void => {
        client.release();
      },
    };
  },
};

// Test the connection
async function testConnection(): Promise<void> {
  try {
    const result = await pool.query("SELECT NOW() as current_time");
    console.log("✅ Connected to PostgreSQL Database");
    console.log(`   → Server time: ${result.rows[0].current_time}`);
  } catch (error: any) {
    console.error("❌ Database Connection Failed:", error.message);
    if (error.code === "ETIMEDOUT" || error.code === "ECONNREFUSED") {
      console.error(
        "   → Check if DB_HOST is correct and PostgreSQL server is running"
      );
      console.error("   → Verify network connectivity and firewall settings");
      console.error(`   → Default PostgreSQL port is 5432`);
    } else if (error.code === "28P01") {
      console.error("   → Check DB_USER and DB_PASSWORD credentials");
    } else if (error.code === "3D000") {
      console.error("   → Database does not exist. Check DB_NAME");
    } else if (error.code === "57P03") {
      console.error("   → Database is starting up, please try again");
    }
  }
}

testConnection();

export default db;
