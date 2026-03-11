const fs = require('fs');

const sqlFilePath = 'eduswap_aiven.sql';
let sql = fs.readFileSync(sqlFilePath, 'utf8');

// Remove DEFINER=`root`@`localhost` as it violates Aiven's security restrictions
sql = sql.replace(/DEFINER=`[^`]+`@`[^`]+`\s*/g, '');

fs.writeFileSync(sqlFilePath, sql);
console.log('Removed DEFINER from views in eduswap_aiven.sql');
