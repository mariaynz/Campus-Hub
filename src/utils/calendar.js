import { isDone, isUrgent, toInputDate } from './tasks.js';

export const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const DOW = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']; // la semana empieza en lunes

export const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Todos los días que se dibujan para un mes, en semanas completas (lunes a domingo)
export function monthGrid(year, month) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const weeks = Math.ceil((offset + days) / 7);
  return Array.from({ length: weeks * 7 }, (_, i) => new Date(year, month, 1 - offset + i));
}

// Map "YYYY-MM-DD" -> tareas de ese día
export function groupByDay(tasks) {
  const map = new Map();
  for (const t of tasks) {
    const key = toInputDate(t.due);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(t);
  }
  return map;
}

// Sin completar primero
export const sortDay = (list) => [...list].sort((a, b) => Number(isDone(a)) - Number(isDone(b)) || a.id - b.id);

export const dayTitle = (d) => `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()}`;

export const taskTone = (t) => (isDone(t) ? 'done' : isUrgent(t) ? 'urgent' : t.estado === 'En progreso' ? 'progress' : 'pending');
