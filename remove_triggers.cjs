const fs = require('fs');

const sqlFilePath = 'eduswap_aiven.sql';
let sql = fs.readFileSync(sqlFilePath, 'utf8');

// Remove Triggers block completely as Aiven forbids them without SUPER privileges
sql = sql.replace(/--\s*-- Triggers[^]*?DELIMITER ;/g, '');

fs.writeFileSync(sqlFilePath, sql);
console.log('Removed triggers completely from eduswap_aiven.sql');
