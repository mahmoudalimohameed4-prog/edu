import mysql2 from 'mysql2/promise'

/**
 * Database Connection Pool - Local XAMPP Setup (Alt Location)
 */
let pool = null;

const createPool = () => {
    const host = process.env.DB_HOST || 'localhost';
    const dbName = process.env.DB_NAME || 'eduswap_fixed';

    try {
        return mysql2.createPool({
            host: host,
            user: process.env.DB_USER || 'root',
            port: Number(process.env.DB_PORT) || 3306,
            password: process.env.DB_PASSWORD || '',
            database: dbName,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    } catch (err) {
        console.error('❌ [DB] POOL CREATION FAILED:', err.message);
        throw err;
    }
};

export const connected = async () => {
    if (!pool) {
        pool = createPool();
    }
    return pool;
};

export default connected;
