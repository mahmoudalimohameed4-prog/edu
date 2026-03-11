const fs = require('fs');

const sqlFilePath = 'eduswap_fixed.sql';
let sql = fs.readFileSync(sqlFilePath, 'utf8');

const pks = {
    'admins': 'Adm_id',
    'ads': 'Ads_id',
    'categories': 'Cat_id',
    'chats': 'Ch_id',
    'favorites': 'Fav_id',
    'items': 'It_id',
    'item_images': 'Img_id',
    'orders': 'Order_id',
    'order_items': 'OrderItem_id',
    'otp_codes': 'id',
    'reviews': 'Rev_id',
    'types': 'Ty_id',
    'users': 'Us_id'
};

for (const [table, pk] of Object.entries(pks)) {
    const regex = new (RegExp)(`CREATE TABLE \\\`${table}\\\` \\\(([\\s\\S]*?)\\\) ENGINE=InnoDB`, 'g');
    sql = sql.replace(regex, (match, tableBody) => {
        // Remove trailing newline and space from tableBody
        const cleanedBody = tableBody.replace(/[\r\n\s]+$/, '');
        return `CREATE TABLE \`${table}\` (\n${cleanedBody},\n  PRIMARY KEY (\`${pk}\`)\n) ENGINE=InnoDB`;
    });
}

// Now remove the ADD PRIMARY KEY statements from the ALTER TABLE section so they aren't added twice and error out.
for (const [table, pk] of Object.entries(pks)) {
    const pkRegex = new RegExp(`ALTER TABLE \\\`${table}\\\"\\s+ADD PRIMARY KEY \\\(\\\`${pk}\\\`\\\)(,|;)\\s*`, 'g');
    sql = sql.replace(pkRegex, (match, semicolonOrComma) => {
        if (semicolonOrComma === ',') {
            return `ALTER TABLE \`${table}\`\n  `;
        } else {
            return '';
        }
    });
}

// Clean up any empty ALTER TABLE statements leaving behind
sql = sql.replace(/ALTER TABLE `\w+`\s*;\s*/g, '');

fs.writeFileSync('eduswap_aiven.sql', sql);
console.log('Done mapping primary keys to CREATE TABLE statements. Created eduswap_aiven.sql');
