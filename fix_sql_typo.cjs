const fs = require('fs');

let sqlFilePath = 'eduswap_aiven.sql';
let sql = fs.readFileSync(sqlFilePath, 'utf8');

// The original table erroneously had a question mark at the end of the column name
sql = sql.replace(/`Order_created_at\?`/g, '`Order_created_at`');

fs.writeFileSync(sqlFilePath, sql);
console.log('Fixed typo in column name Order_created_at?');
