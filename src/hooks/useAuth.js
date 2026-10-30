import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

// undefined = revisando la sesión · null = sin sesión · objeto = sesión iniciada
export default function useAuth() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  return session;
}
