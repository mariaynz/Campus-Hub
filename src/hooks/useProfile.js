import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { photoPath, toAvatarBlob } from '../utils/avatar.js';
import { applyProfile, cleanName, FONTS, DEFAULT_PROFILE, initialsOf, firstName, loadProfile, saveProfile } from '../utils/profile.js';

// El perfil vive en la tabla `perfiles`; localStorage solo guarda una copia del tema
// para que la pantalla de login y la carga inicial ya se vean con tus colores.
export default function useProfile(userId) {
  const [profile, setProfile] = useState(loadProfile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase
      .from('perfiles')
      .select('nombre, tema, modo, fuente, estilo, foto_url')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile({ name: data.nombre, theme: data.tema, mode: data.modo, font: FONTS.some((f) => f.id === data.fuente) ? data.fuente : DEFAULT_PROFILE.font, style: data.estilo || 'normal', photo: data.foto_url || '' });
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
  const setStyle = (style) => update({ style }, { estilo: style });

  // Foto de perfil: se recorta a 256×256 y se guarda en el bucket público `avatars/<tu id>/avatar.jpg`
  const setPhoto = async (file) => {
    try {
      const blob = await toAvatarBlob(file);
      const path = photoPath(userId);
      const up = await supabase.storage.from('avatars').upload(path, blob, { upsert: true, contentType: 'image/jpeg', cacheControl: '3600' });
      if (up.error) return up.error;
      const url = `${supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
      const { error } = await supabase.from('perfiles').update({ foto_url: url }).eq('user_id', userId);
      if (error) return error;
      setProfile((p) => ({ ...p, photo: url }));
      return null;
    } catch (e) {
      return e;
    }
  };
  const removePhoto = async () => {
    await supabase.storage.from('avatars').remove([photoPath(userId)]);
    const { error } = await supabase.from('perfiles').update({ foto_url: null }).eq('user_id', userId);
    if (error) return error;
    setProfile((p) => ({ ...p, photo: '' }));
    return null;
  };

  return {
    ...profile,
    ready,
    initials: initialsOf(profile.name),
    first: firstName(profile.name),
    setName,
    setTheme,
    setMode,
    setFont,
    setStyle,
    setPhoto,
    removePhoto,
  };
}
