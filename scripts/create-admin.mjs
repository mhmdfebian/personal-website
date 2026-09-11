import { randomBytes, scryptSync } from "node:crypto";

import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!databaseUrl || !email || !password) {
  throw new Error("DATABASE_URL, ADMIN_EMAIL, and ADMIN_PASSWORD are required.");
}

if (password.length < 12) {
  throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
}

const salt = randomBytes(16).toString("hex");
const key = scryptSync(password, salt, 64).toString("hex");
const passwordHash = `scrypt:${salt}:${key}`;
const sql = postgres(databaseUrl);

await sql`
  INSERT INTO admin_users (email, password_hash)
  VALUES (${email}, ${passwordHash})
  ON CONFLICT (email) DO UPDATE
  SET password_hash = EXCLUDED.password_hash,
      updated_at = NOW()
`;

await sql.end();
console.log("Admin account provisioned.");