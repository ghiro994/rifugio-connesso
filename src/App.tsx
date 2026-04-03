import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import OffroLavoro from "./pages/OffroLavoro";
import CercoLavoro from "./pages/CercoLavoro";
import PubblicaAnnuncio from "./pages/PubblicaAnnuncio";
import RifugiPage from "./pages/RifugiPage";
import RifugioDetail from "./pages/RifugioDetail";
import AdminPage from "./pages/AdminPage";
import ChiSiamo from "./pages/ChiSiamo";
import Contatti from "./pages/Contatti";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/offro-lavoro" element={<OffroLavoro />} />
            <Route path="/cerco-lavoro" element={<CercoLavoro />} />
            <Route path="/pubblica-annuncio" element={<PubblicaAnnuncio />} />
            <Route path="/rifugi" element={<RifugiPage />} />
            <Route path="/rifugi/:id" element={<RifugioDetail />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/chi-siamo" element={<ChiSiamo />} />
            <Route path="/contatti" element={<Contatti />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookie" element={<CookiePolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
