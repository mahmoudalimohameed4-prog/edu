const fs = require('fs');

let sqlFilePath = 'eduswap_aiven.sql';
let sql = fs.readFileSync(sqlFilePath, 'utf8');

// Remove all instances of "  ADD PRIMARY KEY (`something`)," or "  ADD PRIMARY KEY (`something`);"
// We will match the phrase and an optional comma or semicolon
sql = sql.replace(/\s*ADD PRIMARY KEY\s*\(`[^`]+`\)(,|;)/g, (match, sign) => {
    if (sign === ';') {
        // If it ended with a semicolon, it was the only statement in the ALTER TABLE block
        // Return a semicolon so the dangling "ALTER TABLE `table_name`" becomes "ALTER TABLE `table_name`;"
        return ';';
    } else {
        // If it ended with a comma, just remove it entirely so the next ADD statement continues
        return '';
    }
});

// Clean up any empty ALTER TABLE statements like "ALTER TABLE `table`;" that we just created
sql = sql.replace(/ALTER TABLE\s+`[^`]+`\s*;\s*/g, '');

fs.writeFileSync(sqlFilePath, sql);
console.log('Removed duplicate ADD PRIMARY KEY statements!');
