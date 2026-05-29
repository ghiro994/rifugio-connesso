// Edge function: esporta annunci e rifugi su Google Drive (cartella "Backup Rifugi CAI Lugo")
// Trigger: manuale (admin via UI) o cron notturno (header X-Cron-Secret)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_drive";

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const cols = Array.from(rows.reduce((s, r) => { Object.keys(r).forEach(k => s.add(k)); return s; }, new Set<string>()));
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = Array.isArray(v) ? v.join("; ") : typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map(r => cols.map(c => esc(r[c])).join(","))].join("\n");
}

async function gwFetch(path: string, init: RequestInit & { lovableKey: string; driveKey: string }) {
  const { lovableKey, driveKey, ...rest } = init;
  const headers = new Headers(rest.headers);
  headers.set("Authorization", `Bearer ${lovableKey}`);
  headers.set("X-Connection-Api-Key", driveKey);
  return fetch(`${GATEWAY}${path}`, { ...rest, headers });
}

async function findOrCreateFolder(name: string, parent: string | null, keys: { lovableKey: string; driveKey: string }) {
  const q = encodeURIComponent(
    `mimeType='application/vnd.google-apps.folder' and name='${name.replace(/'/g, "\\'")}' and trashed=false` +
    (parent ? ` and '${parent}' in parents` : "")
  );
  const res = await gwFetch(`/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=1`, { method: "GET", ...keys });
  const data = await res.json();
  if (!res.ok) throw new Error(`Drive search failed: ${JSON.stringify(data)}`);
  if (data.files && data.files.length > 0) return data.files[0].id as string;

  const createRes = await gwFetch(`/drive/v3/files?fields=id`, {
    method: "POST", ...keys,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, mimeType: "application/vnd.google-apps.folder", parents: parent ? [parent] : undefined }),
  });
  const created = await createRes.json();
  if (!createRes.ok) throw new Error(`Drive create folder failed: ${JSON.stringify(created)}`);
  return created.id as string;
}

async function uploadFile(name: string, mime: string, content: string, parent: string, keys: { lovableKey: string; driveKey: string }) {
  const boundary = "----lovable" + crypto.randomUUID().replace(/-/g, "");
  const metadata = { name, parents: [parent] };
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\nContent-Type: ${mime}; charset=UTF-8\r\n\r\n${content}\r\n--${boundary}--`;
  const res = await gwFetch(`/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink`, {
    method: "POST", ...keys,
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Drive upload failed (${name}): ${JSON.stringify(data)}`);
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_DRIVE_API_KEY = Deno.env.get("GOOGLE_DRIVE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const CRON_SECRET = Deno.env.get("BACKUP_CRON_SECRET");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY non configurata");
    if (!GOOGLE_DRIVE_API_KEY) throw new Error("GOOGLE_DRIVE_API_KEY non configurata (collega Google Drive)");

    // Auth: cron secret OPPURE utente admin
    const cronHeader = req.headers.get("x-cron-secret");
    let authorized = false;
    if (CRON_SECRET && cronHeader && cronHeader === CRON_SECRET) {
      authorized = true;
    } else {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const supa = createClient(SUPABASE_URL, SERVICE_ROLE);
        const token = authHeader.replace("Bearer ", "");
        const { data: { user } } = await supa.auth.getUser(token);
        if (user) {
          const { data: roles } = await supa.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
          if (roles) authorized = true;
        }
      }
    }
    if (!authorized) {
      return new Response(JSON.stringify({ error: "Non autorizzato" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch dati
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const [{ data: announcements, error: e1 }, { data: rifugi, error: e2 }] = await Promise.all([
      admin.from("announcements").select("*").order("created_at", { ascending: false }),
      admin.from("rifugi").select("*").order("name"),
    ]);
    if (e1) throw new Error(`Errore annunci: ${e1.message}`);
    if (e2) throw new Error(`Errore rifugi: ${e2.message}`);

    const keys = { lovableKey: LOVABLE_API_KEY, driveKey: GOOGLE_DRIVE_API_KEY };
    const rootId = await findOrCreateFolder("Backup Rifugi CAI Lugo", null, keys);
    const today = new Date().toISOString().slice(0, 10);
    const dayFolderId = await findOrCreateFolder(today, rootId, keys);

    const uploaded = [];
    uploaded.push(await uploadFile(`annunci-${today}.json`, "application/json", JSON.stringify(announcements ?? [], null, 2), dayFolderId, keys));
    uploaded.push(await uploadFile(`annunci-${today}.csv`, "text/csv", toCsv(announcements ?? []), dayFolderId, keys));
    uploaded.push(await uploadFile(`rifugi-${today}.json`, "application/json", JSON.stringify(rifugi ?? [], null, 2), dayFolderId, keys));
    uploaded.push(await uploadFile(`rifugi-${today}.csv`, "text/csv", toCsv(rifugi ?? []), dayFolderId, keys));

    return new Response(JSON.stringify({
      success: true,
      folder: `Backup Rifugi CAI Lugo / ${today}`,
      counts: { announcements: announcements?.length ?? 0, rifugi: rifugi?.length ?? 0 },
      files: uploaded.map(u => ({ name: u.name, link: u.webViewLink })),
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("backup-to-drive error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
