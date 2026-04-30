import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Search, ArrowRight, Users, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import heroImage from '@/assets/hero-mountains.jpg';
import AnnouncementCard from '@/components/AnnouncementCard';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

const Index = () => {
  const [latestAnnouncements, setLatestAnnouncements] = useState<Tables<'announcements'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatest = useCallback(async (attempt = 0) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('announcements').select('*')
        .eq('status', 'pubblicato').order('created_at', { ascending: false }).limit(3);
      if (error) throw error;
      setLatestAnnouncements(data || []);
    } catch (e) {
      console.error('[Index] fetchLatest failed', e);
      if (attempt < 2) {
        setTimeout(() => fetchLatest(attempt + 1), 800 * (attempt + 1));
        return;
      }
      setError('Impossibile caricare gli annunci. Riprova.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatest();
    const onFocus = () => fetchLatest();
    const onVisibility = () => { if (document.visibilityState === 'visible') fetchLatest(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fetchLatest]);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Panorama alpino italiano" width={1920} height={900} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="relative z-10 container-page text-center text-primary-foreground py-20">
          <h1 className="heading-hero mb-4">Il portale dei rifugi italiani</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Annunci di lavoro stagionale e archivio dei rifugi e bivacchi in Italia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cerco-lavoro" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity">
              <Search className="h-4 w-4" /> Cerco lavoro
            </Link>
            <Link to="/offro-lavoro" className="inline-flex items-center justify-center gap-2 bg-card text-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity">
              <Briefcase className="h-4 w-4" /> Offro lavoro
            </Link>
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="container-page py-16">
        <h2 className="heading-section text-center mb-10">Come funziona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: 'Pubblica un annuncio', desc: 'Sei un gestore o cerchi lavoro? Compila il form e invia il tuo annuncio in pochi minuti.' },
            { icon: CheckCircle, title: 'Verifica e approvazione', desc: 'Ogni annuncio viene verificato dalla redazione prima della pubblicazione, per garantire qualità e affidabilità.' },
            { icon: Clock, title: 'Contatto diretto', desc: 'Gli interessati ti contattano direttamente. Nessun intermediario, nessun costo nascosto.' },
          ].map((item) => (
            <div key={item.title} className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mountain-green-light text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="heading-card">{item.title}</h3>
              <p className="text-body text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ultimi annunci */}
      <section className="bg-secondary py-16">
        <div className="container-page">
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-section">Ultimi annunci</h2>
            <Link to="/offro-lavoro" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Tutti gli annunci <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {latestAnnouncements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestAnnouncements.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nessun annuncio pubblicato ancora.</p>
          )}
          <div className="text-center mt-8">
            <Link to="/pubblica-annuncio" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity">
              Pubblica un annuncio
            </Link>
          </div>
        </div>
      </section>

    </>
  );
};

export default Index;
