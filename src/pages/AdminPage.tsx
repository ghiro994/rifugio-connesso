import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { Trash2, Check, X, LogOut, Upload, FileSpreadsheet, Eye } from 'lucide-react';
import { read, utils } from 'xlsx';
import AnnouncementDetailDialog from '@/components/AnnouncementDetailDialog';

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
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    inserted: number; updated: number; skipped: number; errors: string[]; total: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const parseXlsRows = (buffer: ArrayBuffer) => {
    const workbook = read(new Uint8Array(buffer), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw: Record<string, unknown>[] = utils.sheet_to_json(sheet);

    const colMap: Record<string, string[]> = {
      name: ['nome', 'name', 'rifugio'],
      region: ['regione', 'region'],
      province: ['provincia', 'province'],
      mountain_range: ['gruppo_montuoso', 'mountain_range', 'catena', 'gruppo', 'gruppo_montuoso'],
      altitude: ['altitudine', 'altitude', 'quota'],
      description: ['descrizione', 'description'],
      services: ['servizi', 'services'],
      access: ['accesso', 'access', 'come_arrivare'],
      contacts: ['contatti', 'contacts', 'telefono'],
      website: ['sito', 'website', 'sito_web', 'url'],
    };

    function findCol(row: Record<string, unknown>, aliases: string[]): unknown {
      for (const alias of aliases) {
        for (const key of Object.keys(row)) {
          if (key.toLowerCase().trim().replace(/\s+/g, '_') === alias) return row[key];
        }
      }
      return undefined;
    }

    return raw.map((row) => {
      const servicesRaw = findCol(row, colMap.services);
      const services = servicesRaw
        ? String(servicesRaw).split(/[,;]/).map((s) => s.trim()).filter(Boolean)
        : [];
      return {
        name: String(findCol(row, colMap.name) || '').trim(),
        region: String(findCol(row, colMap.region) || '').trim(),
        province: String(findCol(row, colMap.province) || ''),
        mountain_range: String(findCol(row, colMap.mountain_range) || ''),
        altitude: Number(findCol(row, colMap.altitude)) || 0,
        description: String(findCol(row, colMap.description) || ''),
        services,
        access: String(findCol(row, colMap.access) || ''),
        contacts: String(findCol(row, colMap.contacts) || ''),
        website: String(findCol(row, colMap.website) || ''),
      };
    });
  };

  const handleUploadXls = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non autenticato');

      // Parse XLS client-side
      const buffer = await file.arrayBuffer();
      const rows = parseXlsRows(buffer);
      if (!rows.length) throw new Error('Il file è vuoto');

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/import-rifugi`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rows }),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Errore durante l\'importazione');
      setUploadResult(result);
    } catch (err: any) {
      setUploadResult({ inserted: 0, updated: 0, skipped: 0, errors: [err.message], total: 0 });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (authLoading || loading) {
    return <div className="container-page py-20 text-center text-muted-foreground">Caricamento...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="heading-section">Area Amministrazione</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="h-4 w-4" /> Esci
        </button>
      </div>

      {/* Upload Rifugi Section */}
      <section className="mb-12 card-mountain">
        <div className="flex items-center gap-3 mb-4">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <h2 className="heading-card">Importa rifugi da file XLS/XLSX</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Carica un file Excel con le colonne: <strong>Nome, Regione, Provincia, Gruppo Montuoso, Altitudine, Descrizione, Servizi, Accesso, Contatti, Sito Web</strong>. I servizi vanno separati da virgola. I rifugi già presenti (stesso nome e regione) verranno aggiornati.
        </p>
        <div className="flex items-center gap-4">
          <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${uploading ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground hover:opacity-90'}`}>
            <Upload className="h-4 w-4" />
            {uploading ? 'Importazione in corso...' : 'Scegli file XLS'}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx"
              className="hidden"
              onChange={handleUploadXls}
              disabled={uploading}
            />
          </label>
        </div>

        {uploadResult && (
          <div className="mt-4 p-4 rounded-lg bg-secondary text-sm space-y-1">
            <p><strong>Totale righe:</strong> {uploadResult.total}</p>
            <p className="text-primary"><strong>Inseriti:</strong> {uploadResult.inserted}</p>
            <p className="text-accent"><strong>Aggiornati:</strong> {uploadResult.updated}</p>
            {uploadResult.skipped > 0 && (
              <p className="text-destructive"><strong>Saltati:</strong> {uploadResult.skipped}</p>
            )}
            {uploadResult.errors.length > 0 && (
              <div className="mt-2">
                <p className="font-medium text-destructive">Errori:</p>
                <ul className="list-disc list-inside text-destructive">
                  {uploadResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Announcements Moderation */}
      <h2 className="heading-card mb-4">Moderazione annunci</h2>
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
                      <button onClick={() => { setSelected(a); setDetailOpen(true); }} className="p-1.5 rounded-md hover:bg-secondary text-foreground" title="Visualizza annuncio completo">
                        <Eye className="h-4 w-4" />
                      </button>
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
