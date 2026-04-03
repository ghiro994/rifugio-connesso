import { Link } from 'react-router-dom';
import { Rifugio } from '@/lib/types';
import { MapPin, Mountain, ArrowRight } from 'lucide-react';

interface Props {
  rifugio: Rifugio;
}

const RifugioCard = ({ rifugio: r }: Props) => (
  <div className="card-mountain flex flex-col gap-3 animate-fade-in">
    <div className="flex items-start justify-between gap-2">
      <h3 className="heading-card text-foreground">{r.name}</h3>
      <span className="badge-status bg-secondary text-secondary-foreground">{r.altitude}m</span>
    </div>

    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{r.region}</span>
      <span className="flex items-center gap-1"><Mountain className="h-3.5 w-3.5" />{r.mountainRange}</span>
    </div>

    <p className="text-body text-muted-foreground line-clamp-2">{r.description}</p>

    <div className="flex flex-wrap gap-1.5 mt-1">
      {r.services.slice(0, 4).map((s) => (
        <span key={s} className="text-xs bg-mountain-green-light text-primary px-2 py-0.5 rounded-full">{s}</span>
      ))}
      {r.services.length > 4 && (
        <span className="text-xs text-muted-foreground">+{r.services.length - 4}</span>
      )}
    </div>

    <Link to={`/rifugi/${r.id}`} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline mt-auto pt-2">
      Vedi scheda <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  </div>
);

export default RifugioCard;
