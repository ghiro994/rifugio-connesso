export type AnnouncementStatus = 'bozza' | 'in_attesa' | 'pubblicato' | 'rifiutato';
export type AnnouncementType = 'cerco' | 'offro';

export interface AnnouncementRow {
  id: string;
  type: AnnouncementType;
  title: string;
  description: string;
  contact_name: string;
  email?: string;
  phone?: string | null;
  region: string;
  season: string;
  status: AnnouncementStatus;
  rifugio_name?: string | null;
  role_sought?: string | null;
  website?: string | null;
  desired_role?: string | null;
  experience?: string | null;
  preferred_area?: string | null;
  availability?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RifugioRow {
  id: string;
  name: string;
  region: string;
  province: string;
  mountain_range: string;
  altitude: number;
  description: string;
  services: string[];
  access: string;
  contacts: string;
  website: string;
  images: string[];
  created_at?: string;
  updated_at?: string;
}
