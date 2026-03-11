import mysql2 from 'mysql2/promise'

/**
 * Database Connection Pool
 */
let pool = null;

const createPool = () => {
    // 💡 Diagnostic: Log environment status (Safe)
    const host = process.env.DB_HOST;
    const dbName = process.env.DB_NAME;
    const hasUrl = !!process.env.DATABASE_URL;

    console.log(`🔍 [DB] Env Check: Host=${host || 'MISSING'}, Name=${dbName || 'MISSING'}, HasURL=${hasUrl}`);

    try {
        // Option 1: URL
        if (process.env.DATABASE_URL) {
            console.log('🚀 [DB] Using DATABASE_URL');
            return mysql2.createPool({
                uri: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: false },
                waitForConnections: true,
                connectionLimit: 4,
                queueLimit: 0,
                enableKeepAlive: true
            });
        }

        // Option 2: Individual Vars
        const finalHost = host || 'localhost';
        console.log(`🚀 [DB] Connecting to ${finalHost}:${process.env.DB_PORT || 3306}`);

        return mysql2.createPool({
            host: finalHost,
            user: process.env.DB_USER || 'root',
            port: Number(process.env.DB_PORT) || 3306,
            password: process.env.DB_PASSWORD || '',
            database: dbName || 'railway',
            ssl: { rejectUnauthorized: false },
            waitForConnections: true,
            connectionLimit: 4,
            queueLimit: 0,
            enableKeepAlive: true
        });
    } catch (err) {
        console.error('❌ [DB] POOL CREATION FAILED:', err.message);
        throw err;
    }
};

/**
 * Lazy function to get the pool
 * This ensures process.env is read at runtime, not at build/import time.
 */
export const connected = async () => {
    if (!pool) {
        pool = createPool();
    }
    return pool;
};

// For backward compatibility if anything uses default import
export default connected;
