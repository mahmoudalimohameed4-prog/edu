import mysql2 from 'mysql2/promise'

/**
 * Database Connection
 * Establishes a connection to the MySQL database using mysql2/promise.
 * @returns {Promise<Connection>} MySQL connection object
 */
export const connected = async () => {
    return await mysql2.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        port: process.env.DB_PORT || 3306,
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'eduswap_fixed'

    }).catch(error => {
        console.log('fail to connect database');

    })
}
export default connected()