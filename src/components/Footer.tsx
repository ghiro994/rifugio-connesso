import { Link } from 'react-router-dom';
import { Mountain } from 'lucide-react';

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground mt-16">
    <div className="container-page py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-heading text-xl">
            <Mountain className="h-5 w-5" />
            Rifugi & Bivacchi
          </div>
          <p className="text-sm opacity-70">
            Il portale dei rifugi italiani. Annunci di lavoro stagionale e archivio dei rifugi e bivacchi in Italia.
          </p>
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
            <li><Link to="/rifugi" className="hover:opacity-100 transition-opacity">Rifugi e Bivacchi</Link></li>
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
          <p className="text-sm opacity-50 mt-4">info@rifugiebivacchi.it</p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-50">
        © {new Date().getFullYear()} Rifugi & Bivacchi — Tutti i diritti riservati
      </div>
    </div>
  </footer>
);

export default Footer;
