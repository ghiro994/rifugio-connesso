import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import bcrypt from 'bcryptjs';
import { pool, query } from './db.js';

function readCsv(filename: string): Record<string, string>[] {
  const base = process.env.IMPORT_DIR || path.join(process.cwd(), '..', 'scripts', 'migrate', 'output');
  const filePath = path.join(base, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File non trovato: ${filePath}`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return parse(content, {
    delimiter: ';',
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as Record<string, string>[];
}

function parseServices(raw: string): string[] {
  if (!raw || raw === '[]') return [];
  try {
    const parsed = JSON.parse(raw.replace(/""/g, '"'));
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return raw.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  }
}

function parseImages(raw: string): string[] {
  if (!raw || raw === '[]') return [];
  try {
    const parsed = JSON.parse(raw.replace(/""/g, '"'));
    return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [];
  } catch {
    return [];
  }
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@cailugo.it';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(password, 10);

  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  let userId: string;

  if (existing.rows.length === 0) {
    const ins = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, hash],
    );
    userId = ins.rows[0].id;
    console.log(`Admin temporaneo creato: ${email}`);
  } else {
    userId = existing.rows[0].id;
  }

  await query(
    `INSERT INTO user_roles (user_id, role) VALUES ($1, 'admin')
     ON CONFLICT (user_id, role) DO NOTHING`,
    [userId],
  );
}

/** Importa utenti da auth.users Supabase (stesso id + hash bcrypt = stessa password). */
export async function importAuthUsers() {
  const authUsers = readCsv('auth_users.csv');
  if (!authUsers.length) {
    console.log('auth_users.csv assente — uso admin temporaneo.');
    await seedAdmin();
    return;
  }

  await query(
    `DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE email = $1)`,
    [process.env.ADMIN_EMAIL || 'admin@cailugo.it'],
  );
  await query(`DELETE FROM users WHERE email = $1`, [process.env.ADMIN_EMAIL || 'admin@cailugo.it']);

  for (const row of authUsers) {
    const id = row.id?.trim();
    const email = row.email?.trim().toLowerCase();
    const hash = row.encrypted_password?.trim();
    if (!id || !email || !hash) continue;

    await query(
      `INSERT INTO users (id, email, password_hash, created_at)
       VALUES ($1, $2, $3, COALESCE($4::timestamptz, now()))
       ON CONFLICT (id) DO UPDATE SET
         email = EXCLUDED.email,
         password_hash = EXCLUDED.password_hash`,
      [id, email, hash, row.created_at || null],
    );
    console.log(`Utente importato: ${email}`);
  }

  const roles = readCsv('user_roles.csv');
  for (const row of roles) {
    if (!row.user_id || !row.role) continue;
    await query(
      `INSERT INTO user_roles (id, user_id, role)
       VALUES ($1, $2, $3::app_role)
       ON CONFLICT (user_id, role) DO NOTHING`,
      [row.id || undefined, row.user_id, row.role],
    );
  }
  console.log(`Importati ${roles.length} ruoli da user_roles.csv`);
}

export async function importCsvData(force = false) {
  const count = await query('SELECT COUNT(*)::int AS c FROM announcements');
  if (count.rows[0].c > 0 && !force) {
    console.log(`Database già popolato (${count.rows[0].c} annunci). Skip import dati.`);
    await importAuthUsers();
    return;
  }

  if (force) {
    await query('TRUNCATE announcements, rifugi, user_roles RESTART IDENTITY CASCADE');
    await query('DELETE FROM users');
    console.log('Tabelle svuotate per re-import.');
  }

  await importAuthUsers();

  const announcements = readCsv('announcements.csv');
  for (const row of announcements) {
    await query(
      `INSERT INTO announcements (
        id, type, title, description, contact_name, email, phone, region, season, status,
        rifugio_name, role_sought, website, desired_role, experience, preferred_area, availability,
        created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
      ) ON CONFLICT (id) DO NOTHING`,
      [
        row.id, row.type, row.title, row.description, row.contact_name, row.email,
        row.phone || null, row.region, row.season, row.status,
        row.rifugio_name || null, row.role_sought || null, row.website || null,
        row.desired_role || null, row.experience || null, row.preferred_area || null,
        row.availability || null, row.created_at, row.updated_at,
      ],
    );
  }
  console.log(`Importati ${announcements.length} annunci`);

  const rifugi = readCsv('rifugi.csv');
  for (const row of rifugi) {
    await query(
      `INSERT INTO rifugi (
        id, name, region, province, mountain_range, altitude, description,
        services, access, contacts, website, images, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (name, region) DO UPDATE SET
        province = EXCLUDED.province,
        mountain_range = EXCLUDED.mountain_range,
        altitude = EXCLUDED.altitude,
        description = EXCLUDED.description,
        services = EXCLUDED.services,
        access = EXCLUDED.access,
        contacts = EXCLUDED.contacts,
        website = EXCLUDED.website,
        images = EXCLUDED.images,
        updated_at = EXCLUDED.updated_at`,
      [
        row.id, row.name, row.region, row.province || '', row.mountain_range || '',
        parseInt(row.altitude, 10) || 0, row.description || '',
        parseServices(row.services), row.access || '', row.contacts || '',
        row.website || '', parseImages(row.images), row.created_at, row.updated_at,
      ],
    );
  }
  console.log(`Importati ${rifugi.length} rifugi`);
}

if (process.argv[1]?.includes('import-csv')) {
  importCsvData(process.argv.includes('--force'))
    .then(() => pool.end())
    .catch((e) => {
      console.error(e);
      pool.end();
      process.exit(1);
    });
}
