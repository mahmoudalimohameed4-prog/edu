const mysql = require('mysql2/promise');
const fs = require('fs');

async function testLocal() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            multipleStatements: true
        });

        await connection.query('DROP DATABASE IF EXISTS test_aiven_dump');
        await connection.query('CREATE DATABASE test_aiven_dump');
        await connection.query('USE test_aiven_dump');

        const sql = fs.readFileSync('eduswap_aiven.sql', 'utf8');
        await connection.query(sql);
        console.log('SUCCESS: The SQL file is 100% valid!');
        await connection.end();
    } catch (e) {
        console.error('FAILED AT:', e.message);
    }
}
testLocal();
