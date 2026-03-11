const fs = require('fs');

const sqlFilePath = 'eduswap_aiven.sql';
let sql = fs.readFileSync(sqlFilePath, 'utf8');

// 1. Remove the completely useless "Stand-in structure for view" tables which have no primary keys
sql = sql.replace(/-- Stand-in structure for view[\s\S]*?(?=-- --------------------------------------------------------\n\n--\n-- Structure for view)/, '');

// 2. Add DROP TABLE IF EXISTS before every CREATE TABLE to prevent "already exists" errors
sql = sql.replace(/CREATE TABLE `(\w+)`/g, 'DROP TABLE IF EXISTS `$1`;\nCREATE TABLE `$1`');

fs.writeFileSync(sqlFilePath, sql);
console.log('Fixed Views and added DROP TABLE IF EXISTS');
