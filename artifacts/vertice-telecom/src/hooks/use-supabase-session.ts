import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../lib/supabase';

export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let current = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!current) return;
      setSession(nextSession);
      setLoading(false);
      setError('');
    });

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!current) return;
      setSession(data.session);
      setLoading(false);
      if (sessionError) setError(sessionError.message);
    });

    return () => {
      current = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading, error };
}
