import { useState } from 'react';
import { getAllAnnouncements, updateAnnouncementStatus, deleteAnnouncement } from '@/lib/store';
import { AnnouncementStatus } from '@/lib/types';
import { Trash2, Check, X, Eye } from 'lucide-react';

const statusLabels: Record<AnnouncementStatus, string> = {
  bozza: 'Bozza',
  in_attesa: 'In attesa',
  pubblicato: 'Pubblicato',
  rifiutato: 'Rifiutato',
};

const statusColors: Record<AnnouncementStatus, string> = {
  bozza: 'bg-muted text-muted-foreground',
  in_attesa: 'bg-accent/20 text-accent',
  pubblicato: 'bg-primary/10 text-primary',
  rifiutato: 'bg-destructive/10 text-destructive',
};

const AdminPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const announcements = getAllAnnouncements();

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleStatus = (id: string, status: AnnouncementStatus) => {
    updateAnnouncementStatus(id, status);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Eliminare questo annuncio?')) {
      deleteAnnouncement(id);
      refresh();
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="heading-section mb-2">Moderazione annunci</h1>
      <p className="text-body text-muted-foreground mb-8">Gestisci gli annunci inviati. Approva, rifiuta o elimina.</p>

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
              <tr key={`${a.id}-${refreshKey}`} className="border-b border-border">
                <td className="py-3 pr-4">
                  <div className="font-medium text-foreground">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.contactName} — {a.region}</div>
                </td>
                <td className="py-3 pr-4">{a.type === 'offro' ? 'Offro' : 'Cerco'}</td>
                <td className="py-3 pr-4">
                  <span className={`badge-status ${statusColors[a.status]}`}>{statusLabels[a.status]}</span>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{a.createdAt}</td>
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
    </div>
  );
};

export default AdminPage;
