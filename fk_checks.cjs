const fs = require('fs');

const sqlFilePath = 'eduswap_aiven.sql';
let sql = fs.readFileSync(sqlFilePath, 'utf8');

if (!sql.includes('SET FOREIGN_KEY_CHECKS = 0;')) {
    sql = 'SET FOREIGN_KEY_CHECKS = 0;\n' + sql + '\nSET FOREIGN_KEY_CHECKS = 1;\n';
    fs.writeFileSync(sqlFilePath, sql);
    console.log('Added SET FOREIGN_KEY_CHECKS = 0 to start of dump');
} else {
    console.log('Already set');
}
