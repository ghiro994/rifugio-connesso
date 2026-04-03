import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorizzato" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user is admin
    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Non autorizzato" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: isAdmin } = await adminClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Solo gli admin possono importare" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse XLS from request body
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return new Response(JSON.stringify({ error: "Nessun file caricato" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "Il file è vuoto" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Column mapping (flexible: accepts Italian or English headers)
    const colMap: Record<string, string[]> = {
      name: ["nome", "name", "rifugio"],
      region: ["regione", "region"],
      province: ["provincia", "province"],
      mountain_range: ["gruppo_montuoso", "mountain_range", "catena", "gruppo"],
      altitude: ["altitudine", "altitude", "quota"],
      description: ["descrizione", "description"],
      services: ["servizi", "services"],
      access: ["accesso", "access", "come_arrivare"],
      contacts: ["contatti", "contacts", "telefono"],
      website: ["sito", "website", "sito_web", "url"],
    };

    function findCol(row: Record<string, unknown>, aliases: string[]): unknown {
      for (const alias of aliases) {
        for (const key of Object.keys(row)) {
          if (key.toLowerCase().trim().replace(/\s+/g, "_") === alias) return row[key];
        }
      }
      return undefined;
    }

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const name = String(findCol(row, colMap.name) || "").trim();
      const region = String(findCol(row, colMap.region) || "").trim();

      if (!name || !region) {
        skipped++;
        errors.push(`Riga ${i + 2}: nome o regione mancante`);
        continue;
      }

      const servicesRaw = findCol(row, colMap.services);
      const services = servicesRaw
        ? String(servicesRaw).split(/[,;]/).map((s: string) => s.trim()).filter(Boolean)
        : [];

      const record = {
        name,
        region,
        province: String(findCol(row, colMap.province) || ""),
        mountain_range: String(findCol(row, colMap.mountain_range) || ""),
        altitude: Number(findCol(row, colMap.altitude)) || 0,
        description: String(findCol(row, colMap.description) || ""),
        services,
        access: String(findCol(row, colMap.access) || ""),
        contacts: String(findCol(row, colMap.contacts) || ""),
        website: String(findCol(row, colMap.website) || ""),
      };

      // Upsert by name + region
      const { data: existing } = await adminClient
        .from("rifugi")
        .select("id")
        .eq("name", name)
        .eq("region", region)
        .maybeSingle();

      if (existing) {
        const { error } = await adminClient
          .from("rifugi")
          .update(record)
          .eq("id", existing.id);
        if (error) {
          errors.push(`Riga ${i + 2}: ${error.message}`);
          skipped++;
        } else {
          updated++;
        }
      } else {
        const { error } = await adminClient.from("rifugi").insert(record);
        if (error) {
          errors.push(`Riga ${i + 2}: ${error.message}`);
          skipped++;
        } else {
          inserted++;
        }
      }
    }

    return new Response(
      JSON.stringify({ inserted, updated, skipped, errors, total: rows.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Errore interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
