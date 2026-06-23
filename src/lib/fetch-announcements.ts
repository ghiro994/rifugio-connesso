import type { AnnouncementRow } from '@/lib/db-types';
import { api } from '@/lib/api';

export interface AnnouncementFilters {
  type?: 'offro' | 'cerco';
  region?: string;
  role_sought?: string;
  desired_role?: string;
  season?: string;
  limit?: number;
}

export async function fetchPublishedAnnouncements(
  filters: AnnouncementFilters = {},
  signal?: AbortSignal,
): Promise<AnnouncementRow[]> {
  const params = new URLSearchParams();
  if (filters.type) params.set('type', filters.type);
  if (filters.region) params.set('region', filters.region);
  if (filters.role_sought) params.set('role_sought', filters.role_sought);
  if (filters.desired_role) params.set('desired_role', filters.desired_role);
  if (filters.season) params.set('season', filters.season);
  if (filters.limit) params.set('limit', String(filters.limit));

  const qs = params.toString();
  const base =
    (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
    (import.meta.env.DEV ? 'http://localhost:3100' : '');

  const res = await fetch(`${base}/api/announcements${qs ? `?${qs}` : ''}`, {
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<AnnouncementRow[]>;
}

export { api };
