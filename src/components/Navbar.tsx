import { Link } from 'react-router-dom';
import { Mountain, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/offro-lavoro', label: 'Offro lavoro' },
    { to: '/cerco-lavoro', label: 'Cerco lavoro' },
    { to: '/rifugi', label: 'Rifugi e Bivacchi' },
    { to: '/chi-siamo', label: 'Chi siamo' },
    { to: '/contatti', label: 'Contatti' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl text-foreground">
          <Mountain className="h-6 w-6 text-primary" />
          <span>RifugiAlpini.it</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
          <Link to="/pubblica-annuncio" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
            Pubblica annuncio
          </Link>
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
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          ))}
          <Link to="/pubblica-annuncio" onClick={() => setOpen(false)} className="block text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md text-center">
            Pubblica annuncio
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
