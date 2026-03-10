import mysql2 from 'mysql2/promise'

/**
 * Database Connection Pool (Singleton)
 * Uses a pool instead of individual connections to:
 * - Reuse existing connections instead of creating new ones
 * - Automatically release connections back to the pool after use
 * - Prevent "Too many connections" errors
 */
let pool = null;

const getPool = () => {
    if (!pool) {
        pool = mysql2.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            port: Number(process.env.DB_PORT) || 3306,
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'eduswap_fixed',
            waitForConnections: true,
            connectionLimit: 10,      // Max 10 concurrent connections
            queueLimit: 0,            // Unlimited queue
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });

        console.log('\x1b[32m%s\x1b[0m', '✅ Database connection pool created successfully');
    }
    return pool;
};

/**
 * Returns the shared pool (behaves like a connection - supports .execute())
 * @returns {Pool} MySQL pool object
 */
export const connected = () => {
    return getPool();
};

export default getPool();
