import { useEffect, useState } from 'react';
import { applyProfile, cleanName, initialsOf, firstName, loadProfile, saveProfile } from '../utils/profile.js';

export default function useProfile() {
  const [profile, setProfile] = useState(loadProfile);

  useEffect(() => {
    applyProfile(profile);
    saveProfile(profile);
  }, [profile]);

  const setName = (value) => {
    const name = cleanName(value);
    if (name) setProfile((p) => ({ ...p, name })); // un nombre vacío se ignora
  };
  const setTheme = (theme) => setProfile((p) => ({ ...p, theme }));
  const setMode = (mode) => setProfile((p) => ({ ...p, mode }));
  const setFont = (font) => setProfile((p) => ({ ...p, font }));

  return {
    ...profile,
    initials: initialsOf(profile.name),
    first: firstName(profile.name),
    setName,
    setTheme,
    setMode,
    setFont,
  };
}
