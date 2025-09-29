import mysql from "mysql2"

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise()

try {
    await pool.query("select 1 + 1")
} catch(e) {
    console.error("Could not connect to database", e)
}

export default function getConnection() {
    return pool
}