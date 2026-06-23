import { Link } from 'react-router-dom';
import { Mountain, Facebook, ExternalLink } from 'lucide-react';

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground mt-16">
    <div className="container-page py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-heading text-xl">
            <Mountain className="h-5 w-5" />
            Rifugi e Bivacchi d'Italia
          </div>
          <div className="text-sm opacity-70 space-y-0.5">
            <p>Sezione di Lugo di Romagna</p>
            <p>P.zza G. Savonarola, 3</p>
            <p>48022 Lugo (RA)</p>
            <p><a href="mailto:rifugi@cailugo.it" className="hover:opacity-100">rifugi@cailugo.it</a></p>
            <p className="pt-1">Segnalazioni urgenti: <a href="tel:+393346472474" className="hover:opacity-100">+39 334 6472474</a></p>
          </div>
          <div className="flex flex-col gap-1.5 text-sm pt-2">
            <a href="https://www.cailugo.it/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
              <ExternalLink className="h-3.5 w-3.5" /> Sito CAI Lugo
            </a>
            <a href="https://www.facebook.com/groups/215208796236/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
              <Facebook className="h-3.5 w-3.5" /> Gruppo Facebook
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-lg mb-3">Lavoro</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/offro-lavoro" className="hover:opacity-100 transition-opacity">Offro lavoro</Link></li>
            <li><Link to="/cerco-lavoro" className="hover:opacity-100 transition-opacity">Cerco lavoro</Link></li>
            <li><Link to="/pubblica-annuncio" className="hover:opacity-100 transition-opacity">Pubblica annuncio</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-lg mb-3">Esplora</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/info/tipologie" className="hover:opacity-100 transition-opacity">Tipologie</Link></li>
            <li><Link to="/info/storia" className="hover:opacity-100 transition-opacity">Storia</Link></li>
            <li><Link to="/info/regolamenti" className="hover:opacity-100 transition-opacity">Regolamenti</Link></li>
            <li><Link to="/info/tariffe" className="hover:opacity-100 transition-opacity">Tariffe</Link></li>
            <li><Link to="/chi-siamo" className="hover:opacity-100 transition-opacity">Chi siamo</Link></li>
            <li><Link to="/contatti" className="hover:opacity-100 transition-opacity">Contatti</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-lg mb-3">Legale</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
            <li><Link to="/cookie" className="hover:opacity-100 transition-opacity">Cookie Policy</Link></li>
            <li><Link to="/login" className="hover:opacity-100 transition-opacity">Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-50">
        © {new Date().getFullYear()} Rifugi e Bivacchi d'Italia — Sezione CAI Lugo di Romagna
      </div>
    </div>
  </footer>
);

export default Footer;
