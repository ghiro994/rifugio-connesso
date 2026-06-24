import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import bcrypt from 'bcryptjs';
import { pool, query } from './db.js';
import { importCsvData } from './import-csv.js';
import { notifyNewAnnouncement, notifyContactForm } from './mail.js';

const PORT = Number(process.env.PORT || 3000);
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const CDN_BASE = process.env.CDN_BASE_URL || `http://localhost:${PORT}/uploads`;

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; email: string };
    user: { sub: string; email: string };
  }
}

const app = Fastify({ logger: true });

await app.register(cors, { origin: true, credentials: true });
await app.register(jwt, { secret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production' });
await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });
await app.register(fastifyStatic, {
  root: UPLOAD_DIR,
  prefix: '/uploads/',
  decorateReply: false,
});

async function isAdmin(userId: string): Promise<boolean> {
  const r = await query(
    `SELECT 1 FROM user_roles WHERE user_id = $1 AND role = 'admin' LIMIT 1`,
    [userId],
  );
  return r.rows.length > 0;
}

async function requireAdmin(
  req: { jwtVerify: () => Promise<void>; user: { sub: string } },
  reply: { code: (n: number) => { send: (b: unknown) => unknown } },
): Promise<boolean> {
  try {
    await req.jwtVerify();
  } catch {
    reply.code(401).send({ error: 'Non autenticato' });
    return false;
  }
  if (!(await isAdmin(req.user.sub))) {
    reply.code(403).send({ error: 'Accesso negato' });
    return false;
  }
  return true;
}

// --- Auth ---
app.post('/api/auth/login', async (req, reply) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return reply.code(400).send({ error: 'Email e password richieste' });

  const r = await query('SELECT id, email, password_hash FROM users WHERE email = $1', [email.toLowerCase()]);
  const user = r.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return reply.code(401).send({ error: 'Credenziali non valide' });
  }

  const admin = await isAdmin(user.id);
  const token = await reply.jwtSign({ sub: user.id, email: user.email });
  return { token, user: { id: user.id, email: user.email }, isAdmin: admin };
});

app.get('/api/auth/me', async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ error: 'Non autenticato' });
  }
  const admin = await isAdmin(req.user.sub);
  return { user: { id: req.user.sub, email: req.user.email }, isAdmin: admin };
});

// --- Announcements (public) ---
app.get('/api/announcements', async (req) => {
  const q = req.query as Record<string, string>;
  const conditions = ["status = 'pubblicato'"];
  const params: unknown[] = [];
  let i = 1;

  for (const [key, col] of [
    ['type', 'type'],
    ['region', 'region'],
    ['role_sought', 'role_sought'],
    ['desired_role', 'desired_role'],
    ['season', 'season'],
  ] as const) {
    if (q[key]) {
      conditions.push(`${col} = $${i++}`);
      params.push(q[key]);
    }
  }

  let sql = `SELECT id, type, title, description, contact_name, region, season, status,
    rifugio_name, role_sought, website, desired_role, experience, preferred_area, availability,
    created_at, updated_at FROM announcements WHERE ${conditions.join(' AND ')}
    ORDER BY created_at DESC`;

  if (q.limit) {
    sql += ` LIMIT $${i++}`;
    params.push(Number(q.limit));
  }

  const r = await query(sql, params);
  return r.rows;
});

app.post('/api/announcements', async (req, reply) => {
  const b = req.body as Record<string, string | null>;
  const required = ['type', 'title', 'description', 'contact_name', 'email', 'region', 'season'];
  for (const k of required) {
    if (!b[k]) return reply.code(400).send({ error: `Campo mancante: ${k}` });
  }

  const r = await query(
    `INSERT INTO announcements (
      type, title, description, contact_name, email, phone, region, season, status,
      rifugio_name, role_sought, website, desired_role, experience, preferred_area, availability
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'in_attesa',$9,$10,$11,$12,$13,$14,$15)
    RETURNING id, title, type, status`,
    [
      b.type, b.title, b.description, b.contact_name, b.email, b.phone || null,
      b.region, b.season, b.rifugio_name || null, b.role_sought || null, b.website || null,
      b.desired_role || null, b.experience || null, b.preferred_area || null, b.availability || null,
    ],
  );

  void notifyNewAnnouncement({
    title: String(b.title),
    type: String(b.type),
    contactName: String(b.contact_name),
    region: String(b.region),
    email: b.email ? String(b.email) : null,
  });

  return reply.code(201).send(r.rows[0]);
});

app.post('/api/contact', async (req, reply) => {
  const b = req.body as { name?: string; email?: string; message?: string };
  const name = b.name?.trim();
  const email = b.email?.trim().toLowerCase();
  const message = b.message?.trim();

  if (!name || !email || !message) {
    return reply.code(400).send({ error: 'Nome, email e messaggio sono obbligatori' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply.code(400).send({ error: 'Email non valida' });
  }

  const sent = await notifyContactForm({ name, email, message });
  if (!sent) {
    return reply.code(503).send({ error: 'Invio email temporaneamente non disponibile' });
  }

  return reply.code(200).send({ success: true });
});

// --- Rifugi (public) ---
app.get('/api/rifugi', async (req) => {
  const q = req.query as Record<string, string>;
  const conditions: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (q.region) { conditions.push(`region = $${i++}`); params.push(q.region); }
  if (q.mountain_range) { conditions.push(`mountain_range = $${i++}`); params.push(q.mountain_range); }
  if (q.max_altitude) { conditions.push(`altitude <= $${i++}`); params.push(Number(q.max_altitude)); }

  let sql = 'SELECT * FROM rifugi';
  if (conditions.length) sql += ` WHERE ${conditions.join(' AND ')}`;
  sql += ' ORDER BY name';

  const r = await query(sql, params);
  let rows = r.rows;

  if (q.service) {
    rows = rows.filter((row) => (row.services as string[]).includes(q.service));
  }

  return rows;
});

app.get('/api/rifugi/:id', async (req, reply) => {
  const { id } = req.params as { id: string };
  const r = await query('SELECT * FROM rifugi WHERE id = $1', [id]);
  if (!r.rows[0]) return reply.code(404).send({ error: 'Rifugio non trovato' });
  return r.rows[0];
});

// --- Admin announcements ---
app.get('/api/admin/announcements', async (req, reply) => {
  if (!(await requireAdmin(req, reply))) return;
  const r = await query('SELECT * FROM announcements ORDER BY created_at DESC');
  return r.rows;
});

app.patch('/api/admin/announcements/:id', async (req, reply) => {
  if (!(await requireAdmin(req, reply))) return;
  const { id } = req.params as { id: string };
  const { status } = req.body as { status?: string };
  if (!status) return reply.code(400).send({ error: 'status richiesto' });
  await query('UPDATE announcements SET status = $1 WHERE id = $2', [status, id]);
  return { ok: true };
});

app.delete('/api/admin/announcements/:id', async (req, reply) => {
  if (!(await requireAdmin(req, reply))) return;
  const { id } = req.params as { id: string };
  await query('DELETE FROM announcements WHERE id = $1', [id]);
  return { ok: true };
});

// --- Admin rifugi import ---
app.post('/api/admin/rifugi/import', async (req, reply) => {
  if (!(await requireAdmin(req, reply))) return;

  const { rows } = req.body as { rows: Record<string, unknown>[] };
  if (!rows?.length) return reply.code(400).send({ error: 'Nessuna riga' });

  let inserted = 0, updated = 0, skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const name = String(row.name || '').trim();
    const region = String(row.region || '').trim();
    if (!name || !region) { skipped++; continue; }

    try {
      const existing = await query('SELECT id FROM rifugi WHERE name = $1 AND region = $2', [name, region]);
      const services = Array.isArray(row.services) ? row.services : [];

      if (existing.rows.length) {
        await query(
          `UPDATE rifugi SET province=$1, mountain_range=$2, altitude=$3, description=$4,
           services=$5, access=$6, contacts=$7, website=$8 WHERE id=$9`,
          [
            row.province || '', row.mountain_range || '', Number(row.altitude) || 0,
            row.description || '', services, row.access || '', row.contacts || '',
            row.website || '', existing.rows[0].id,
          ],
        );
        updated++;
      } else {
        await query(
          `INSERT INTO rifugi (name, region, province, mountain_range, altitude, description, services, access, contacts, website)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [
            name, region, row.province || '', row.mountain_range || '', Number(row.altitude) || 0,
            row.description || '', services, row.access || '', row.contacts || '', row.website || '',
          ],
        );
        inserted++;
      }
    } catch (e) {
      errors.push(`${name}: ${e instanceof Error ? e.message : 'errore'}`);
    }
  }

  return { inserted, updated, skipped, errors, total: rows.length };
});

// --- Admin backup (local JSON/CSV) ---
app.post('/api/admin/backup', async (req, reply) => {
  if (!(await requireAdmin(req, reply))) return;

  const backupDir = path.join(process.cwd(), 'backups', new Date().toISOString().slice(0, 10));
  fs.mkdirSync(backupDir, { recursive: true });

  const ann = await query('SELECT * FROM announcements');
  const rif = await query('SELECT * FROM rifugi');

  fs.writeFileSync(path.join(backupDir, 'announcements.json'), JSON.stringify(ann.rows, null, 2));
  fs.writeFileSync(path.join(backupDir, 'rifugi.json'), JSON.stringify(rif.rows, null, 2));

  return {
    ok: true,
    folder: backupDir,
    counts: { announcements: ann.rows.length, rifugi: rif.rows.length },
  };
});

// --- Rifugio image upload ---
app.post('/api/rifugi/:id/images', async (req, reply) => {
  if (!(await requireAdmin(req, reply))) return;

  const { id } = req.params as { id: string };
  const data = await req.file();
  if (!data) return reply.code(400).send({ error: 'File mancante' });

  const slot = Number((req.query as { slot?: string }).slot || 0);
  const ext = path.extname(data.filename) || '.jpg';
  const relPath = `${id}/photo_${slot}${ext}`;
  const absPath = path.join(UPLOAD_DIR, relPath);

  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  const buffer = await data.toBuffer();
  fs.writeFileSync(absPath, buffer);

  const publicUrl = `${CDN_BASE}/${relPath.replace(/\\/g, '/')}`;

  const rif = await query('SELECT images FROM rifugi WHERE id = $1', [id]);
  if (!rif.rows[0]) return reply.code(404).send({ error: 'Rifugio non trovato' });

  const images = [...(rif.rows[0].images as string[])];
  while (images.length <= slot) images.push('');
  images[slot] = publicUrl;

  await query('UPDATE rifugi SET images = $1 WHERE id = $2', [images, id]);
  return { url: publicUrl, images };
});

app.patch('/api/rifugi/:id', async (req, reply) => {
  if (!(await requireAdmin(req, reply))) return;

  const { id } = req.params as { id: string };
  const { images } = req.body as { images?: string[] };
  if (!images) return reply.code(400).send({ error: 'images richiesto' });

  await query('UPDATE rifugi SET images = $1 WHERE id = $2', [images, id]);
  return { ok: true };
});

app.get('/api/health', async () => ({ ok: true }));

async function waitForDb(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      await query('SELECT 1');
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error('Database non raggiungibile');
}

try {
  await waitForDb();
  await importCsvData();
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`API su http://localhost:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
