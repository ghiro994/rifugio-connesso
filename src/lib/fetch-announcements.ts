// Direct REST fetch to Supabase, bypasses supabase-js auth/lock initialization
// which can hang indefinitely in some browser sessions (WebLocks contention,
// stale localStorage state). Public published announcements don't need auth.
import type { Tables } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

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
): Promise<Tables<'announcements'>[]> {
  const params = new URLSearchParams();
  // Explicit column list: email & phone are not granted to anon (privacy).
  params.set(
    'select',
    'id,type,title,description,contact_name,region,season,status,rifugio_name,role_sought,website,desired_role,experience,preferred_area,availability,created_at,updated_at',
  );
  params.set('status', 'eq.pubblicato');
  params.set('order', 'created_at.desc');
  if (filters.type) params.set('type', `eq.${filters.type}`);
  if (filters.region) params.set('region', `eq.${filters.region}`);
  if (filters.role_sought) params.set('role_sought', `eq.${filters.role_sought}`);
  if (filters.desired_role) params.set('desired_role', `eq.${filters.desired_role}`);
  if (filters.season) params.set('season', `eq.${filters.season}`);
  if (filters.limit) params.set('limit', String(filters.limit));

  // 12s timeout safety net
  const timeoutCtrl = new AbortController();
  const timer = setTimeout(() => timeoutCtrl.abort(), 12000);
  const combined = signal
    ? new AbortController()
    : timeoutCtrl;
  if (signal) {
    signal.addEventListener('abort', () => combined.abort());
    timeoutCtrl.signal.addEventListener('abort', () => combined.abort());
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/announcements?${params.toString()}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
      },
      signal: combined.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as Tables<'announcements'>[];
  } finally {
    clearTimeout(timer);
  }
}
