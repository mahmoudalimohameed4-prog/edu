const fs = require('fs');

const sqlFilePath = 'eduswap_aiven.sql';
let sql = fs.readFileSync(sqlFilePath, 'utf8');

// Use CREATE OR REPLACE VIEW so it overwrites existing views without error
sql = sql.replace(/CREATE ALGORITHM=/g, 'CREATE OR REPLACE ALGORITHM=');
// Also drop views just in case they were created as tables in early failed runs
sql = sql.replace(/DROP TABLE IF EXISTS `view_active_items`;/g, 'DROP TABLE IF EXISTS `view_active_items`;\nDROP VIEW IF EXISTS `view_active_items`;');
sql = sql.replace(/DROP TABLE IF EXISTS `view_user_stats`;/g, 'DROP TABLE IF EXISTS `view_user_stats`;\nDROP VIEW IF EXISTS `view_user_stats`;');

fs.writeFileSync(sqlFilePath, sql);
console.log('Fixed View creation errors by using CREATE OR REPLACE');
