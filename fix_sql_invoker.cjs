const fs = require('fs');
let file = 'eduswap_aiven.sql';
let s = fs.readFileSync(file, 'utf8');
s = s.replace(/SQL SECURITY DEFINER/g, 'SQL SECURITY INVOKER');
fs.writeFileSync(file, s);
console.log('Replaced SQL SECURITY DEFINER with INVOKER');
