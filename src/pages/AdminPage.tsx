import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { Trash2, Check, X, LogOut } from 'lucide-react';

type Announcement = Tables<'announcements'>;
type Status = Announcement['status'];

const statusLabels: Record<Status, string> = {
  bozza: 'Bozza',
  in_attesa: 'In attesa',
  pubblicato: 'Pubblicato',
  rifiutato: 'Rifiutato',
};

const statusColors: Record<Status, string> = {
  bozza: 'bg-muted text-muted-foreground',
  in_attesa: 'bg-accent/20 text-accent',
  pubblicato: 'bg-primary/10 text-primary',
  rifiutato: 'bg-destructive/10 text-destructive',
};

const AdminPage = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    setAnnouncements(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchAnnouncements();
  }, [isAdmin]);

  const handleStatus = async (id: string, status: Status) => {
    await supabase.from('announcements').update({ status }).eq('id', id);
    fetchAnnouncements();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Eliminare questo annuncio?')) {
      await supabase.from('announcements').delete().eq('id', id);
      fetchAnnouncements();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return <div className="container-page py-20 text-center text-muted-foreground">Caricamento...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="heading-section">Moderazione annunci</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="h-4 w-4" /> Esci
        </button>
      </div>
      <p className="text-body text-muted-foreground mb-8">Gestisci gli annunci inviati. Approva, rifiuta o elimina.</p>

      {announcements.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Nessun annuncio da moderare.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-3 pr-4 font-medium text-muted-foreground">Titolo</th>
                <th className="py-3 pr-4 font-medium text-muted-foreground">Tipo</th>
                <th className="py-3 pr-4 font-medium text-muted-foreground">Stato</th>
                <th className="py-3 pr-4 font-medium text-muted-foreground">Data</th>
                <th className="py-3 font-medium text-muted-foreground">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((a) => (
                <tr key={a.id} className="border-b border-border">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-foreground">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.contact_name} — {a.region}</div>
                  </td>
                  <td className="py-3 pr-4">{a.type === 'offro' ? 'Offro' : 'Cerco'}</td>
                  <td className="py-3 pr-4">
                    <span className={`badge-status ${statusColors[a.status]}`}>{statusLabels[a.status]}</span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{new Date(a.created_at).toLocaleDateString('it-IT')}</td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      {a.status !== 'pubblicato' && (
                        <button onClick={() => handleStatus(a.id, 'pubblicato')} className="p-1.5 rounded-md hover:bg-primary/10 text-primary" title="Approva">
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      {a.status !== 'rifiutato' && (
                        <button onClick={() => handleStatus(a.id, 'rifiutato')} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive" title="Rifiuta">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive" title="Elimina">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
