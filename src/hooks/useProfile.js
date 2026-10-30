import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { applyProfile, cleanName, initialsOf, firstName, loadProfile, saveProfile } from '../utils/profile.js';

// El perfil vive en la tabla `perfiles`; localStorage solo guarda una copia del tema
// para que la pantalla de login y la carga inicial ya se vean con tus colores.
export default function useProfile(userId) {
  const [profile, setProfile] = useState(loadProfile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase
      .from('perfiles')
      .select('nombre, tema, modo, fuente')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile({ name: data.nombre, theme: data.tema, mode: data.modo, font: data.fuente });
        setReady(true);
      });
  }, [userId]);

  useEffect(() => {
    applyProfile(profile);
    saveProfile(profile);
  }, [profile]);

  const update = (next, columns) => {
    setProfile((p) => ({ ...p, ...next }));
    supabase.from('perfiles').update(columns).eq('user_id', userId).then();
  };

  const setName = (value) => {
    const name = cleanName(value);
    if (name) update({ name }, { nombre: name }); // un nombre vacío se ignora
  };
  const setTheme = (theme) => update({ theme }, { tema: theme });
  const setMode = (mode) => update({ mode }, { modo: mode });
  const setFont = (font) => update({ font }, { fuente: font });

  return {
    ...profile,
    ready,
    initials: initialsOf(profile.name),
    first: firstName(profile.name),
    setName,
    setTheme,
    setMode,
    setFont,
  };
}
