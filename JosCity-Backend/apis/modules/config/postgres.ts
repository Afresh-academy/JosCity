import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Test connection function
// Uncomment to test connection on module load
// async function testConnection(): Promise<void> {
//   try {
//     await client.connect();
//     console.log("Connected to PostgreSQL Database");
//
//     // Test query
//     const res = await client.query("SELECT * FROM users");
//     console.log("Users:", res.rows);
//
//     await client.end();
//   } catch (error) {
//     console.log("PostgreSQL Connection Failed:", error);
//   }
// }
// testConnection();

export default client;

