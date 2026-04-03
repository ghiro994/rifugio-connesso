export type AnnouncementType = 'cerco' | 'offro';
export type AnnouncementStatus = 'bozza' | 'in_attesa' | 'pubblicato' | 'rifiutato';

export interface Announcement {
  id: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  title: string;
  description: string;
  contactName: string;
  email: string;
  phone: string;
  region: string;
  season: string;
  createdAt: string;
  // Offro lavoro specific
  rifugioName?: string;
  roleSought?: string;
  website?: string;
  // Cerco lavoro specific
  desiredRole?: string;
  experience?: string;
  preferredArea?: string;
  availability?: string;
}

export interface Rifugio {
  id: string;
  name: string;
  region: string;
  province: string;
  mountainRange: string;
  altitude: number;
  description: string;
  services: string[];
  access: string;
  contacts: string;
  website: string;
  images: string[];
}

export const REGIONS = [
  'Valle d\'Aosta', 'Piemonte', 'Lombardia', 'Trentino-Alto Adige',
  'Veneto', 'Friuli Venezia Giulia', 'Liguria', 'Emilia-Romagna',
  'Toscana', 'Abruzzo', 'Calabria', 'Sicilia', 'Sardegna',
];

export const ROLES = [
  'Cuoco/a', 'Aiuto cuoco/a', 'Cameriere/a', 'Gestore', 'Aiuto rifugista',
  'Tuttofare', 'Barista', 'Addetto/a pulizie', 'Magazziniere',
];

export const SEASONS = [
  'Estate 2025', 'Inverno 2025/26', 'Estate 2026', 'Annuale',
];

export const MOUNTAIN_RANGES = [
  'Alpi Occidentali', 'Alpi Centrali', 'Alpi Orientali', 'Dolomiti',
  'Appennino Settentrionale', 'Appennino Centrale', 'Appennino Meridionale',
  'Gran Paradiso', 'Monte Bianco', 'Monte Rosa', 'Adamello-Presanella',
];

export const SERVICES = [
  'Pernottamento', 'Ristorante', 'Bar', 'Docce calde', 'Wi-Fi',
  'Punto ricarica', 'Posto tenda', 'Locale invernale', 'Eliporto',
];
