import { createClient } from '@supabase/supabase-js';

// La URL y la clave publicable son públicas por diseño (van en el navegador de cualquier app);
// lo que protege los datos son las reglas RLS de la base. Si algún día quieres cambiarlas,
// define VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en un archivo .env o en Vercel.
const URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://gjvrsmzinozrqqiabuhq.supabase.co';
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_vWRygtMtJdlSWdruuCzYuQ_GGyywTNu';

export const supabase = createClient(URL, KEY);
