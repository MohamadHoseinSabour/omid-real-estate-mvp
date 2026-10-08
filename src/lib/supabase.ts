/**
 * Supabase Client Configuration
 * Client-safe: Only PUBLIC URL and ANON KEY are used.
 * The SECRET SERVICE_ROLE key is STRICTLY FORBIDDEN here.
 */

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'advisor' | 'secretary' | 'admin';
  phone?: string;
}

// In local static mode or when Supabase credentials are not set,
// the dashboard runs in secure Local Mode with role-switching capability.
export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';
export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const DEMO_USERS: Record<string, SessionUser> = {
  advisor: {
    id: 'user-adv-101',
    name: 'مهندس رضا کریمی',
    email: 'karimi@omidrealestate.ir',
    role: 'advisor',
    phone: '۰۹۱۶۱۱۱۱۲۳۴',
  },
  secretary: {
    id: 'user-sec-201',
    name: 'مریم سعیدی',
    email: 'saeedi@omidrealestate.ir',
    role: 'secretary',
    phone: '۰۶۱-۳۳۳۳۳۳۳۴',
  },
  admin: {
    id: 'user-adm-301',
    name: 'حاج امید صبور (مدیرکل)',
    email: 'admin@omidrealestate.ir',
    role: 'admin',
    phone: '۰۹۱۶۱۱۱۰۰۰۰',
  },
};
