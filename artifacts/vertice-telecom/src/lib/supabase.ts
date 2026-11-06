import { createClient } from '@supabase/supabase-js';

const environment = import.meta.env as ImportMetaEnv & {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
};

const supabaseUrl = environment.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = environment.VITE_SUPABASE_ANON_KEY?.trim();

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// The browser uses only the public anon key. Row-level security must protect
// every client record; a service-role key must never be added to this app.
export const supabase = supabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    })
  : null;
