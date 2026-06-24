import { Mail, MapPin, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api';

const Contatti = () => {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');

    try {
      await api.post('/api/contact', form);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invio non riuscito. Riprova più tardi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-10 max-w-3xl">
      <h1 className="heading-section mb-6">Contatti</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4 text-body text-muted-foreground">
          <p>Hai domande, suggerimenti o vuoi segnalarci un rifugio? Scrivici, ti risponderemo il prima possibile.</p>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Rifugi e bivacchi</p>
                <p>Sezione di Lugo di Romagna</p>
                <p>P.zza G. Savonarola, 3</p>
                <p>48022 Lugo (RA)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <a href="mailto:rifugi@cailugo.it" className="hover:text-foreground transition-colors">rifugi@cailugo.it</a>
            </div>
            <div className="flex items-start gap-2 pt-2 border-t border-border">
              <AlertCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Per segnalazioni urgenti</p>
                <a href="tel:+393346472474" className="hover:text-foreground transition-colors">+39 334 6472474</a>
              </div>
            </div>
          </div>
        </div>

        <div>
          {sent ? (
            <div className="card-mountain text-center py-8">
              <p className="text-primary font-medium">Messaggio inviato! Ti risponderemo al più presto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Nome"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-border rounded-md px-3 py-2.5 bg-card text-foreground text-sm"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border border-border rounded-md px-3 py-2.5 bg-card text-foreground text-sm"
              />
              <textarea
                required
                rows={4}
                placeholder="Messaggio"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full border border-border rounded-md px-3 py-2.5 bg-card text-foreground text-sm"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? 'Invio in corso…' : 'Invia messaggio'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contatti;
