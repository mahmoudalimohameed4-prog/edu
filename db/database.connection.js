import mysql2 from 'mysql2/promise'

/**
 * Database Connection Pool
 * Supports both Railway (DATABASE_URL) and individual env vars.
 * Uses connection pooling for better performance in production.
 */

let pool;

const createPool = () => {
    // Local Connection (XAMPP)
    return mysql2.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        port: parseInt(process.env.DB_PORT) || 3306,
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'eduswap_fixed',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
};

pool = createPool();

/**
 * Get a connection from the pool
 * @returns {Promise<PoolConnection>}
 */
export const connected = async () => {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('❌ Failed to connect to database:', error.message);
        throw error;
    }
};

export default pool;
