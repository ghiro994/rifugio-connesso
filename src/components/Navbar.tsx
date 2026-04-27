import { Link } from 'react-router-dom';
import { Mountain, Menu, X, Settings, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import heroImage from '@/assets/hero-mountains.jpg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { caiPageList } from '@/lib/cai-pages-data';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/offro-lavoro', label: 'Offro lavoro' },
    { to: '/cerco-lavoro', label: 'Cerco lavoro' },
    { to: '/chi-siamo', label: 'Chi siamo' },
    { to: '/contatti', label: 'Contatti' },
  ];

  return (
    <nav
      className="sticky top-0 z-50 bg-gradient-to-r from-mountain-green-light via-card to-mountain-green-light bg-cover bg-center backdrop-blur border-b-2 border-primary/30 shadow-sm"
      style={{
        backgroundImage: `linear-gradient(to right, hsl(var(--card)/0.92), hsl(var(--card)/0.85)), url(${heroImage})`,
      }}
    >
      <div className="container-page flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3 text-foreground">
          <Mountain className="h-8 w-8 text-primary shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-lg md:text-xl">Rifugi e Bivacchi d'Italia</span>
            <span className="text-xs text-muted-foreground">Sezione di Lugo di Romagna</span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors outline-none">
              Informazioni <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card">
              {caiPageList.map((p) => (
                <DropdownMenuItem key={p.slug} asChild>
                  <Link to={`/info/${p.slug}`} className="cursor-pointer">
                    {p.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/pubblica-annuncio"
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Pubblica annuncio
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              Gestione
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-foreground">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-border">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
              Informazioni
            </p>
            {caiPageList.map((p) => (
              <Link
                key={p.slug}
                to={`/info/${p.slug}`}
                onClick={() => setOpen(false)}
                className="block py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {p.title}
              </Link>
            ))}
          </div>

          <Link
            to="/pubblica-annuncio"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md text-center"
          >
            Pubblica annuncio
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Gestione
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
