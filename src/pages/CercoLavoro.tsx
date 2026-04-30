import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import AnnouncementCard from '@/components/AnnouncementCard';
import { supabase } from '@/integrations/supabase/client';
import { REGIONS, ROLES, SEASONS } from '@/lib/types';
import type { Tables } from '@/integrations/supabase/types';

const CercoLavoro = () => {
  const [region, setRegion] = useState('');
  const [role, setRole] = useState('');
  const [season, setSeason] = useState('');
  const [announcements, setAnnouncements] = useState<Tables<'announcements'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async (attempt = 0) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('announcements').select('*')
        .eq('type', 'cerco').eq('status', 'pubblicato').order('created_at', { ascending: false });
      if (region) query = query.eq('region', region);
      if (role) query = query.eq('desired_role', role);
      if (season) query = query.eq('season', season);
      const { data, error } = await query;
      if (error) throw error;
      setAnnouncements(data || []);
    } catch (e) {
      console.error('[CercoLavoro] fetch failed', e);
      if (attempt < 2) {
        setTimeout(() => fetchAnnouncements(attempt + 1), 800 * (attempt + 1));
        return;
      }
      setError('Impossibile caricare gli annunci. Riprova.');
    } finally {
      setLoading(false);
    }
  }, [region, role, season]);

  useEffect(() => {
    fetchAnnouncements();
    const onFocus = () => fetchAnnouncements();
    const onVisibility = () => { if (document.visibilityState === 'visible') fetchAnnouncements(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fetchAnnouncements]);

  return (
    <div className="container-page py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-section">Cerco lavoro</h1>
          <p className="text-body text-muted-foreground mt-1">Persone che cercano lavoro stagionale nei rifugi</p>
        </div>
        <Link to="/pubblica-annuncio?type=cerco" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity shrink-0">
          <Plus className="h-4 w-4" /> Pubblica una richiesta di lavoro
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-8 p-4 bg-secondary rounded-lg">
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="text-sm border border-border rounded-md px-3 py-2 bg-card text-foreground">
          <option value="">Tutte le regioni</option>
          {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="text-sm border border-border rounded-md px-3 py-2 bg-card text-foreground">
          <option value="">Tutti i ruoli</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={season} onChange={(e) => setSeason(e.target.value)} className="text-sm border border-border rounded-md px-3 py-2 bg-card text-foreground">
          <option value="">Tutte le stagioni</option>
          {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {announcements.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Nessun annuncio trovato con i filtri selezionati.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((a) => <AnnouncementCard key={a.id} announcement={a} />)}
        </div>
      )}
    </div>
  );
};

export default CercoLavoro;
