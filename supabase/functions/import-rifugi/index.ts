import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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

    const { rows } = await req.json();
    if (!rows || !Array.isArray(rows) || !rows.length) {
      return new Response(JSON.stringify({ error: "Nessun dato ricevuto" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const record = rows[i];
      const { name, region } = record;

      if (!name || !region) {
        skipped++;
        errors.push(`Riga ${i + 2}: nome o regione mancante`);
        continue;
      }

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
