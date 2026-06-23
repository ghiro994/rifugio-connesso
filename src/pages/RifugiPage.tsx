import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { RifugioRow } from '@/lib/db-types';
import RifugioCard from '@/components/RifugioCard';
import { REGIONS, MOUNTAIN_RANGES, SERVICES } from '@/lib/types';

const RifugiPage = () => {
  const [region, setRegion] = useState('');
  const [range, setRange] = useState('');
  const [service, setService] = useState('');
  const [maxAlt, setMaxAlt] = useState('');
  const [rifugi, setRifugi] = useState<RifugioRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRifugi = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (region) params.set('region', region);
        if (range) params.set('mountain_range', range);
        if (maxAlt) params.set('max_altitude', maxAlt);
        if (service) params.set('service', service);
        const qs = params.toString();
        const data = await api.get<RifugioRow[]>(`/api/rifugi${qs ? `?${qs}` : ''}`);
        setRifugi(data);
      } catch {
        setRifugi([]);
      }
      setLoading(false);
    };
    fetchRifugi();
  }, [region, range, service, maxAlt]);

  const mapRifugio = (r: RifugioRow) => ({
    id: r.id,
    name: r.name,
    region: r.region,
    province: r.province,
    mountainRange: r.mountain_range,
    altitude: r.altitude,
    description: r.description,
    services: r.services,
    access: r.access,
    contacts: r.contacts,
    website: r.website,
    images: r.images,
  });

  return (
    <div className="container-page py-10">
      <h1 className="heading-section mb-2">Rifugi e Bivacchi</h1>
      <p className="text-body text-muted-foreground max-w-2xl mb-8">
        Esplora l'archivio dei rifugi e bivacchi italiani. Cerca per regione, catena montuosa, quota e servizi. L'archivio è in continua crescita.
      </p>

      <div className="flex flex-wrap gap-3 mb-8 p-4 bg-secondary rounded-lg">
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="text-sm border border-border rounded-md px-3 py-2 bg-card text-foreground">
          <option value="">Tutte le regioni</option>
          {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={range} onChange={(e) => setRange(e.target.value)} className="text-sm border border-border rounded-md px-3 py-2 bg-card text-foreground">
          <option value="">Tutte le catene</option>
          {MOUNTAIN_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={service} onChange={(e) => setService(e.target.value)} className="text-sm border border-border rounded-md px-3 py-2 bg-card text-foreground">
          <option value="">Tutti i servizi</option>
          {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={maxAlt} onChange={(e) => setMaxAlt(e.target.value)} className="text-sm border border-border rounded-md px-3 py-2 bg-card text-foreground">
          <option value="">Qualsiasi quota</option>
          <option value="1500">Fino a 1500m</option>
          <option value="2000">Fino a 2000m</option>
          <option value="2500">Fino a 2500m</option>
          <option value="3000">Fino a 3000m</option>
          <option value="4000">Fino a 4000m</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-12">Caricamento rifugi...</p>
      ) : rifugi.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Nessun rifugio trovato con i filtri selezionati.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rifugi.map((r) => <RifugioCard key={r.id} rifugio={mapRifugio(r)} />)}
        </div>
      )}
    </div>
  );
};

export default RifugiPage;
