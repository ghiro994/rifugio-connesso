import type { Tables } from '@/integrations/supabase/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MapPin, Calendar, Briefcase, Building2, User, Mail, Phone, Globe, Clock } from 'lucide-react';

interface Props {
  announcement: Tables<'announcements'> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When true, shows private contact info (email/phone). Used in admin moderation. */
  showPrivateContacts?: boolean;
}

const AnnouncementDetailDialog = ({ announcement: a, open, onOpenChange, showPrivateContacts = false }: Props) => {
  if (!a) return null;

  const adminMailto = showPrivateContacts && a.email
    ? `mailto:${a.email}?subject=${encodeURIComponent(`Contatto da Rifugi & Bivacchi: ${a.title}`)}`
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="heading-card text-foreground pr-6">{a.title}</DialogTitle>
            <span className={`badge-status shrink-0 ${a.type === 'offro' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
              {a.type === 'offro' ? 'Offro lavoro' : 'Cerco lavoro'}
            </span>
          </div>
          <DialogDescription className="sr-only">Dettaglio annuncio</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {a.rifugio_name && (
              <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />{a.rifugio_name}</span>
            )}
            {(a.role_sought || a.desired_role) && (
              <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" />{a.role_sought || a.desired_role}</span>
            )}
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{a.region}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{a.season}</span>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1.5">Descrizione</h4>
            <p className="text-body text-muted-foreground whitespace-pre-wrap">{a.description}</p>
          </div>

          {a.type === 'cerco' && (
            <div className="grid sm:grid-cols-2 gap-4">
              {a.experience && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Esperienza</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.experience}</p>
                </div>
              )}
              {a.preferred_area && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Area preferita</h4>
                  <p className="text-sm text-muted-foreground">{a.preferred_area}</p>
                </div>
              )}
              {a.availability && (
                <div className="sm:col-span-2">
                  <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5"><Clock className="h-4 w-4" />Disponibilità</h4>
                  <p className="text-sm text-muted-foreground">{a.availability}</p>
                </div>
              )}
            </div>
          )}

          {a.type === 'offro' && a.website && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5"><Globe className="h-4 w-4" />Sito web</h4>
              <a href={a.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">{a.website}</a>
            </div>
          )}

          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Contatti</h4>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-1.5"><User className="h-4 w-4" />{a.contact_name}</p>
              {showPrivateContacts ? (
                <>
                  {a.email && (
                    <p className="flex items-center gap-1.5"><Mail className="h-4 w-4" /><a href={adminMailto ?? '#'} className="text-primary hover:underline">{a.email}</a></p>
                  )}
                  {a.phone && <p className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{a.phone}</p>}
                </>
              ) : (
                <p className="text-sm text-muted-foreground pt-1">
                  Per tutelare la privacy, i recapiti diretti non sono pubblicati. Per essere messo in contatto con l'autore di questo annuncio scrivi a{' '}
                  <a href="mailto:rifugi@cailugo.it" className="text-primary hover:underline">rifugi@cailugo.it</a> citando il titolo dell'annuncio.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDetailDialog;
