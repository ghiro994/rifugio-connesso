import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_EMAIL = "matteo.fiorellini@robindigital.it";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, type, contactName, region } = await req.json();

    const typeLabel = type === 'offro' ? 'Offro lavoro' : 'Cerco lavoro';
    const subject = `Nuovo annuncio su RifugiAlpini.it: ${title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2d5016; margin-bottom: 16px;">Nuovo annuncio da moderare</h2>
        <p>È stato ricevuto un nuovo annuncio su RifugiAlpini.it.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Titolo</td><td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${title}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Tipo</td><td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${typeLabel}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Referente</td><td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${contactName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Regione</td><td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${region}</td></tr>
        </table>
        <p>Accedi all'area admin per approvarlo o rifiutarlo.</p>
        <p style="color: #888; font-size: 12px; margin-top: 30px;">RifugiAlpini.it — Il portale dei rifugi italiani</p>
      </div>
    `;

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (RESEND_API_KEY) {
      // Use Resend if available
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'RifugiAlpini.it <onboarding@resend.dev>',
          to: [ADMIN_EMAIL],
          subject,
          html,
        }),
      });
      const data = await res.json();
      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fallback: log the notification
    console.log(`EMAIL NOTIFICATION TO ${ADMIN_EMAIL}: ${subject}`);
    return new Response(JSON.stringify({ success: true, message: 'Notification logged (no email provider configured)' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
