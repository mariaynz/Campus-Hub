// Saludo según la hora: 5–11 h buenos días · 12–18 h buenas tardes · 19–4 h buenas noches
export function greetingFor(hour) {
  if (hour >= 5 && hour < 12) return 'Buenos días';
  if (hour >= 12 && hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
