// Generate a bcrypt hash for your admin password.
// Usage: node scripts/hash-password.js "your-password"
const bcrypt = require("bcryptjs");

const pw = process.argv[2];
if (!pw) {
  console.error('Usage: node scripts/hash-password.js "your-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(pw, 10);
console.log("\nAdd this to your environment variables:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
