import mysql from "mysql2/promise"

// MySQL连接配置
const dbConfig = {
  host: process.env.DB_HOST || "192.168.10.19",
  port: Number(process.env.DB_PORT) || 13306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin#123",
  database: process.env.DB_DATABASE || "kjxmcs",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// 创建连接池
export const pool = mysql.createPool(dbConfig)

// 测试数据库连接
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("[MySQL] Database connected successfully")
    connection.release()
    return true
  } catch (error) {
    console.error("[MySQL] Database connection failed:", error)
    return false
  }
}
