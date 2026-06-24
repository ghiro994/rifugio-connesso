import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 25);
const SMTP_FROM = process.env.SMTP_FROM || 'Rifugi e Bivacchi <noreply@cailugo.it>';
const SMTP_ENVELOPE_FROM = process.env.SMTP_ENVELOPE_FROM || 'noreply@cailugo.it';
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'rifugi@cailugo.it';
const ADMIN_NOTIFY_BCC = (process.env.ADMIN_NOTIFY_BCC || '')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);
const APP_HOST = process.env.APP_HOST || 'rifugiebivacchi.cl.robinmail.it';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getTransporter() {
  if (!SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    tls: { rejectUnauthorized: false },
  });
}

async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  bcc?: string[];
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[mail] SMTP non configurato — skip: ${options.subject}`);
    return false;
  }

  const bcc = options.bcc?.filter(Boolean) ?? [];
  const envelopeTo = [options.to, ...bcc];

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: options.to,
      bcc: bcc.length ? bcc : undefined,
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.html,
      envelope: {
        from: SMTP_ENVELOPE_FROM,
        to: envelopeTo,
      },
    });
    const bccLog = bcc.length ? ` (bcc: ${bcc.join(', ')})` : '';
    console.log(`[mail] Inviata a ${options.to}${bccLog}: ${options.subject}`);
    return true;
  } catch (err) {
    console.error('[mail] Errore invio:', err);
    return false;
  }
}

export async function notifyNewAnnouncement(data: {
  title: string;
  type: string;
  contactName: string;
  region: string;
  email?: string | null;
}): Promise<void> {
  const typeLabel = data.type === 'offro' ? 'Offro lavoro' : 'Cerco lavoro';
  const subject = `Nuovo annuncio da moderare: ${data.title}`;
  const adminUrl = `https://${APP_HOST}/admin`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2d5016; margin-bottom: 16px;">Nuovo annuncio da moderare</h2>
      <p>È stato ricevuto un nuovo annuncio su Rifugi e Bivacchi.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Titolo</td><td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${escapeHtml(data.title)}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Tipo</td><td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${escapeHtml(typeLabel)}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Referente</td><td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${escapeHtml(data.contactName)}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Regione</td><td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${escapeHtml(data.region)}</td></tr>
        ${data.email ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${escapeHtml(data.email)}</td></tr>` : ''}
      </table>
      <p><a href="${adminUrl}">Accedi all'area admin</a> per approvarlo o rifiutarlo.</p>
      <p style="color: #888; font-size: 12px; margin-top: 30px;">Rifugi e Bivacchi — Sezione CAI Lugo</p>
    </div>
  `;

  await sendMail({
    to: ADMIN_NOTIFY_EMAIL,
    subject,
    html,
    replyTo: data.email || undefined,
    bcc: ADMIN_NOTIFY_BCC,
  });
}
