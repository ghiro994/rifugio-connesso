import { useState } from 'react';
import type { Tables } from '@/integrations/supabase/types';
import { MapPin, Calendar, Briefcase, Building2, Eye } from 'lucide-react';
import AnnouncementDetailDialog from './AnnouncementDetailDialog';

interface Props {
  announcement: Tables<'announcements'>;
}

const AnnouncementCard = ({ announcement: a }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="card-mountain flex flex-col gap-3 animate-fade-in">
        <div className="flex items-start justify-between gap-2">
          <h3 className="heading-card text-foreground">{a.title}</h3>
          <span className={`badge-status shrink-0 ${a.type === 'offro' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
            {a.type === 'offro' ? 'Offro lavoro' : 'Cerco lavoro'}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {a.rifugio_name && (
            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{a.rifugio_name}</span>
          )}
          {(a.role_sought || a.desired_role) && (
            <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{a.role_sought || a.desired_role}</span>
          )}
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{a.region}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{a.season}</span>
        </div>

        <p className="text-body text-muted-foreground line-clamp-3">{a.description}</p>

        {a.type === 'cerco' && a.experience && (
          <p className="text-sm text-muted-foreground line-clamp-2"><strong>Esperienza:</strong> {a.experience}</p>
        )}

        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <span className="text-sm text-muted-foreground truncate">{a.contact_name}</span>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity shrink-0"
          >
            <Eye className="h-3.5 w-3.5" /> Leggi tutto
          </button>
        </div>
      </div>

      <AnnouncementDetailDialog announcement={a} open={open} onOpenChange={setOpen} />
    </>
  );
};

export default AnnouncementCard;
