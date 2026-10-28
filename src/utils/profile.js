// Perfil de la persona: nombre, tema de color y modo oscuro (se guarda en localStorage)
export const KEY = 'campus-hub:profile:v1';

export const THEMES = [
  { id: 'indigo', label: 'Índigo', swatch: '#4338ca' },
  { id: 'rosa', label: 'Rosa', swatch: '#be185d' },
  { id: 'verde', label: 'Verde', swatch: '#047857' },
  { id: 'azul', label: 'Azul', swatch: '#1d4ed8' },
  { id: 'morado', label: 'Morado', swatch: '#7e22ce' },
];

export const MODES = [
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Oscuro' },
  { id: 'black', label: 'Negro' },
];

export const FONTS = [
  { id: 'moderna', label: 'Moderna', family: 'Inter, system-ui, sans-serif' },
  { id: 'clasica', label: 'Clásica', family: '"Times New Roman", Times, serif' },
  { id: 'elegante', label: 'Elegante', family: '"Playfair Display", Georgia, serif' },
];

export const DEFAULT_PROFILE = { name: 'María Yáñez', theme: 'indigo', mode: 'light', font: 'moderna' };
export const MAX_NAME = 40;

export function cleanName(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
}

export function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (!saved || typeof saved !== 'object') return DEFAULT_PROFILE;
    return {
      name: cleanName(saved.name) || DEFAULT_PROFILE.name,
      theme: THEMES.some((t) => t.id === saved.theme) ? saved.theme : DEFAULT_PROFILE.theme,
      // perfiles guardados antes tenían solo `dark: true/false`
      mode: MODES.some((m) => m.id === saved.mode) ? saved.mode : saved.dark === true ? 'dark' : 'light',
      font: FONTS.some((f) => f.id === saved.font) ? saved.font : DEFAULT_PROFILE.font,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    /* sin almacenamiento: el perfil solo dura mientras la pestaña esté abierta */
  }
}

// Aplica tema y modo en <html> (los estilos viven en tokens.css)
export function applyProfile({ theme, mode, font }) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.mode = mode;
  root.dataset.font = font;
}

// "María Yáñez" → "MY" · "María" → "MA"
export function initialsOf(name) {
  const words = cleanName(name).split(' ').filter(Boolean);
  if (words.length === 0) return '?';
  const letters = words.length === 1 ? Array.from(words[0]).slice(0, 2) : [Array.from(words[0])[0], Array.from(words[words.length - 1])[0]];
  return letters.join('').toUpperCase();
}

export const firstName = (name) => cleanName(name).split(' ')[0] || '';
