import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const email = process.argv[2];
const password = process.argv[3] || 'admin123';
const role = process.argv[4] || 'admin';

if (!email) {
  console.error('Uso: tsx src/create-user.ts <email> [password] [role]');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://rifugio:rifugio_dev@localhost:5433/rifugio',
});

const hash = await bcrypt.hash(password, 10);
const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
let userId: string;

if (existing.rows.length) {
  userId = existing.rows[0].id;
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, userId]);
  console.log(`Password aggiornata: ${email}`);
} else {
  const ins = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
    [email.toLowerCase(), hash],
  );
  userId = ins.rows[0].id;
  console.log(`Utente creato: ${email}`);
}

await pool.query(
  `INSERT INTO user_roles (user_id, role) VALUES ($1, $2::app_role) ON CONFLICT (user_id, role) DO NOTHING`,
  [userId, role],
);

const check = await pool.query(
  `SELECT u.email, ur.role FROM users u JOIN user_roles ur ON ur.user_id = u.id WHERE u.email = $1`,
  [email.toLowerCase()],
);
console.log('OK:', check.rows[0]);
await pool.end();
