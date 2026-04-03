import { Link } from 'react-router-dom';
import { Announcement } from '@/lib/types';
import { MapPin, Calendar, Briefcase, Building2 } from 'lucide-react';

interface Props {
  announcement: Announcement;
}

const AnnouncementCard = ({ announcement: a }: Props) => {
  const mailtoLink = `mailto:${a.email}?subject=${encodeURIComponent(`Contatto da RifugiAlpini.it: ${a.title}`)}`;

  return (
    <div className="card-mountain flex flex-col gap-3 animate-fade-in">
      <div className="flex items-start justify-between gap-2">
        <h3 className="heading-card text-foreground">{a.title}</h3>
        <span className={`badge-status shrink-0 ${a.type === 'offro' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
          {a.type === 'offro' ? 'Offro lavoro' : 'Cerco lavoro'}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        {a.rifugioName && (
          <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{a.rifugioName}</span>
        )}
        {(a.roleSought || a.desiredRole) && (
          <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{a.roleSought || a.desiredRole}</span>
        )}
        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{a.region}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{a.season}</span>
      </div>

      <p className="text-body text-muted-foreground line-clamp-3">{a.description}</p>

      {a.type === 'cerco' && a.experience && (
        <p className="text-sm text-muted-foreground"><strong>Esperienza:</strong> {a.experience}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-sm text-muted-foreground">{a.contactName}</span>
        <a href={mailtoLink} className="text-sm font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity">
          Contatta
        </a>
      </div>
    </div>
  );
};

export default AnnouncementCard;
