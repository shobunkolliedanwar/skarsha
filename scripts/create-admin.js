/**
 * Membuat query SQL untuk admin pertama.
 * Jalankan: node scripts/create-admin.js <username> <password>
 * Lalu copy hasil SQL-nya dan jalankan di Supabase SQL Editor.
 */
const bcrypt = require("bcryptjs");

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error("Pemakaian: node scripts/create-admin.js <username> <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log("\nJalankan SQL berikut di Supabase SQL Editor:\n");
console.log(
  `insert into admin_users (username, password_hash) values ('${username}', '${hash}');\n`
);
