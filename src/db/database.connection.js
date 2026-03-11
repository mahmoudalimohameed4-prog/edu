import mysql2 from 'mysql2/promise'

/**
 * Database Connection Pool
 * Supports both Railway (DATABASE_URL) and individual env vars.
 * Optimized for Vercel Serverless Functions.
 */
let pool = null;

const getPool = () => {
    if (!pool) {
        // Option 1: Using DATABASE_URL (Railway typical)
        if (process.env.DATABASE_URL) {
            pool = mysql2.createPool({
                uri: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: false },
                waitForConnections: true,
                connectionLimit: 5, // Keep small for serverless
                queueLimit: 0,
                enableKeepAlive: true
            });
            console.log('\x1b[32m%s\x1b[0m', '✅ Database connection pool created using DATABASE_URL');
        } else {
            // Option 2: Fallback to individual variables
            pool = mysql2.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                port: Number(process.env.DB_PORT) || 3306,
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'railway',
                // Support SSL for Railway or specific env var
                ssl: (process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('rlwy.net'))
                    ? { rejectUnauthorized: false }
                    : undefined,
                waitForConnections: true,
                connectionLimit: 5,
                queueLimit: 0,
                enableKeepAlive: true
            });
            console.log('\x1b[32m%s\x1b[0m', '✅ Database connection pool created using environment variables');
        }
    }
    return pool;
};

export const connected = () => {
    return getPool();
};

export default getPool();

