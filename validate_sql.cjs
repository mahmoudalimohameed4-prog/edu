const fs = require('fs');
let s = fs.readFileSync('eduswap_aiven.sql', 'utf8');

// Parse all CREATE TABLE definitions
const createTableRegex = /CREATE TABLE `(\w+)` \(\s*([\s\S]*?)\s*\) ENGINE=/g;
const tables = {};
let match;
while ((match = createTableRegex.exec(s)) !== null) {
    const tableName = match[1];
    const body = match[2];
    const columns = [];
    const lines = body.split('\n');
    for (const line of lines) {
        // extract column name like `Col_name`
        const colMatch = line.match(/^\s*`([^`]+)`/);
        if (colMatch) {
            columns.push(colMatch[1]);
        }
    }
    tables[tableName] = columns;
}

// Check all ALTER TABLE statements for index column existence
const alterTableRegex = /ALTER TABLE `(\w+)`\s*([\s\S]*?);/g;
let errorCount = 0;
while ((match = alterTableRegex.exec(s)) !== null) {
    const tableName = match[1];
    const body = match[2];
    if (!tables[tableName]) {
        console.log(`Table ${tableName} not found but ALTERed!`);
        continue;
    }
    const cols = tables[tableName];

    // Find all column requirements in `something` or (`a`, `b`)
    const indexRegex = /\(`([^`]+)`(?:,\s*`([^`]+)`)*\)/g;
    let idxMatch;
    while ((idxMatch = indexRegex.exec(body)) !== null) {
        for (let i = 1; i < idxMatch.length; i++) {
            if (idxMatch[i] && !cols.includes(idxMatch[i])) {
                console.log(`ERROR: Column '${idxMatch[i]}' not found in table '${tableName}'! (ALTER statement)`);
                errorCount++;
            }
        }
    }
}
if (errorCount === 0) {
    console.log('All ALLTER TABLE index columns exist in corresponding CREATE TABLE statements! OK.');
}
