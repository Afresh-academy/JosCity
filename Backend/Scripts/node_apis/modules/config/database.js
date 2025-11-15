const mysql = require('mysql2/promise');
require('dotenv').config();

const dbconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections:true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbconfig);

// Let us test the connection

async function testConnection(){
    try{
        const connection = await pool.getConnection();
        console.log('Connected to Database');
        connection.release()
    } catch (error) {
        console.log('Database Connection Failed:', error);
    }
}

testConnection();

module.exports = pool;