import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { addAnnouncement } from '@/lib/store';
import { REGIONS, ROLES, SEASONS, AnnouncementType } from '@/lib/types';
import { CheckCircle } from 'lucide-react';

const PubblicaAnnuncio = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [type, setType] = useState<AnnouncementType>((params.get('type') as AnnouncementType) || 'offro');
  const [submitted, setSubmitted] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', contactName: '', email: '', phone: '',
    region: '', season: '', rifugioName: '', roleSought: '', website: '',
    desiredRole: '', experience: '', preferredArea: '', availability: '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacy) return;

    addAnnouncement({
      type,
      title: form.title,
      description: form.description,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone,
      region: form.region,
      season: form.season,
      ...(type === 'offro' ? {
        rifugioName: form.rifugioName,
        roleSought: form.roleSought,
        website: form.website,
      } : {
        desiredRole: form.desiredRole,
        experience: form.experience,
        preferredArea: form.preferredArea,
        availability: form.availability,
      }),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container-page py-20 text-center">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="heading-section mb-3">Grazie!</h1>
        <p className="text-body text-muted-foreground max-w-md mx-auto">
          Il tuo annuncio è stato ricevuto e sarà pubblicato dopo verifica da parte della redazione.
        </p>
        <button onClick={() => navigate('/')} className="mt-6 bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity">
          Torna alla home
        </button>
      </div>
    );
  }

  const inputClass = "w-full border border-border rounded-md px-3 py-2.5 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "block text-sm font-medium text-foreground mb-1";

  return (
    <div className="container-page py-10 max-w-2xl">
      <h1 className="heading-section mb-2">Pubblica un annuncio</h1>
      <p className="text-body text-muted-foreground mb-8">Compila il form per pubblicare il tuo annuncio. Sarà verificato dalla redazione prima della pubblicazione.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type selector */}
        <div>
          <label className={labelClass}>Tipo di annuncio *</label>
          <div className="flex gap-3">
            {(['offro', 'cerco'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)}
                className={`flex-1 py-2.5 rounded-md text-sm font-medium border transition-colors ${type === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border hover:bg-secondary'}`}>
                {t === 'offro' ? 'Offro lavoro' : 'Cerco lavoro'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Titolo annuncio *</label>
          <input required value={form.title} onChange={set('title')} className={inputClass} placeholder="Es. Cercasi cuoco per stagione estiva" />
        </div>

        <div>
          <label className={labelClass}>Descrizione *</label>
          <textarea required rows={4} value={form.description} onChange={set('description')} className={inputClass} placeholder="Descrivi l'offerta o la tua candidatura..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nome referente *</label>
            <input required value={form.contactName} onChange={set('contactName')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input required type="email" value={form.email} onChange={set('email')} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Telefono</label>
            <input value={form.phone} onChange={set('phone')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Regione *</label>
            <select required value={form.region} onChange={set('region')} className={inputClass}>
              <option value="">Seleziona</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Periodo / Stagione *</label>
          <select required value={form.season} onChange={set('season')} className={inputClass}>
            <option value="">Seleziona</option>
            {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Offro-specific */}
        {type === 'offro' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nome rifugio *</label>
                <input required value={form.rifugioName} onChange={set('rifugioName')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Ruolo cercato *</label>
                <select required value={form.roleSought} onChange={set('roleSought')} className={inputClass}>
                  <option value="">Seleziona</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Sito web</label>
              <input value={form.website} onChange={set('website')} className={inputClass} placeholder="www.esempio.it" />
            </div>
          </>
        )}

        {/* Cerco-specific */}
        {type === 'cerco' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Ruolo desiderato *</label>
                <select required value={form.desiredRole} onChange={set('desiredRole')} className={inputClass}>
                  <option value="">Seleziona</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Esperienza</label>
                <input value={form.experience} onChange={set('experience')} className={inputClass} placeholder="Es. 3 anni in rifugi" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Zona preferita</label>
                <input value={form.preferredArea} onChange={set('preferredArea')} className={inputClass} placeholder="Es. Dolomiti, Alpi Occidentali" />
              </div>
              <div>
                <label className={labelClass}>Disponibilità</label>
                <input value={form.availability} onChange={set('availability')} className={inputClass} placeholder="Es. Giugno - Settembre" />
              </div>
            </div>
          </>
        )}

        {/* Privacy */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="mt-1 h-4 w-4 rounded border-border text-primary" />
          <span className="text-sm text-muted-foreground">
            Acconsento al trattamento dei dati personali ai sensi del GDPR e della Privacy Policy del sito. *
          </span>
        </label>

        <button type="submit" disabled={!privacy}
          className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
          Invia annuncio
        </button>
      </form>
    </div>
  );
};

export default PubblicaAnnuncio;
