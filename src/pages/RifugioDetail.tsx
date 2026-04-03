import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Mountain, ArrowLeft, Globe, Mail } from 'lucide-react';

const RifugioDetail = () => {
  const { id } = useParams();
  const [rifugio, setRifugio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('rifugi').select('*').eq('id', id).maybeSingle();
      setRifugio(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return <div className="container-page py-20 text-center text-muted-foreground">Caricamento...</div>;
  }

  if (!rifugio) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="heading-section mb-4">Rifugio non trovato</h1>
        <Link to="/rifugi" className="text-primary hover:underline">Torna all'elenco</Link>
      </div>
    );
  }

  const r = rifugio;
  const mailtoLink = r.contacts?.includes('@')
    ? `mailto:${r.contacts.match(/[\w.-]+@[\w.-]+/)?.[0] || ''}`
    : undefined;

  return (
    <div className="container-page py-10 max-w-4xl">
      <Link to="/rifugi" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> Torna all'elenco
      </Link>

      <div className="space-y-8">
        <div>
          <h1 className="heading-section mb-2">{r.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{r.region} — {r.province}</span>
            <span className="flex items-center gap-1"><Mountain className="h-4 w-4" />{r.mountain_range}</span>
            <span className="font-medium text-foreground">{r.altitude}m s.l.m.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="aspect-[4/3] bg-secondary rounded-lg flex items-center justify-center text-muted-foreground">
            <Mountain className="h-12 w-12 opacity-30" />
          </div>
          <div className="aspect-[4/3] bg-secondary rounded-lg flex items-center justify-center text-muted-foreground">
            <Mountain className="h-12 w-12 opacity-30" />
          </div>
        </div>

        {r.description && (
          <div>
            <h2 className="heading-card mb-3">Descrizione</h2>
            <p className="text-body text-muted-foreground">{r.description}</p>
          </div>
        )}

        {r.services?.length > 0 && (
          <div>
            <h2 className="heading-card mb-3">Servizi</h2>
            <div className="flex flex-wrap gap-2">
              {r.services.map((s: string) => (
                <span key={s} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}

        {r.access && (
          <div>
            <h2 className="heading-card mb-3">Come arrivare</h2>
            <p className="text-body text-muted-foreground">{r.access}</p>
          </div>
        )}

        {(r.contacts || r.website) && (
          <div className="card-mountain space-y-3">
            <h2 className="heading-card">Contatti</h2>
            {r.contacts && <p className="text-body text-muted-foreground">{r.contacts}</p>}
            <div className="flex flex-wrap gap-3">
              {r.website && (
                <a href={r.website.startsWith('http') ? r.website : `https://${r.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  <Globe className="h-3.5 w-3.5" /> {r.website}
                </a>
              )}
              {mailtoLink && (
                <a href={mailtoLink} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                  <Mail className="h-3.5 w-3.5" /> Contatta il rifugio
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RifugioDetail;
