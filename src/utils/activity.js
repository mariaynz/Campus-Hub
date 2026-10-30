import { formatGrade, isDone, isGraded, today } from './tasks.js';

const MS_DAY = 24 * 60 * 60 * 1000;

function timeLabel(date) {
  const days = Math.round((today() - date) / MS_DAY);
  if (days <= 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  return `Hace ${days} días`;
}

// Actividad reciente real: tareas completadas y calificaciones, de la más nueva a la más vieja
export function activityFromTasks(tasks, limit = 3) {
  const events = [];
  for (const t of tasks) {
    if (!isDone(t) || !t.completedAt) continue;
    events.push({
      id: `c${t.id}`, icon: 'check', tone: 'success', order: 0, date: t.completedAt, key: t.id,
      text: `Completaste «${t.tarea}» de ${t.materia}`,
    });
    if (isGraded(t)) {
      events.push({
        id: `g${t.id}`, icon: 'star', tone: 'progress', order: 1, date: t.completedAt, key: t.id,
        text: `Nueva calificación en ${t.materia}: ${formatGrade(t.calificacion)} en «${t.tarea}»`,
      });
    }
  }
  events.sort((a, b) => b.date - a.date || b.order - a.order || b.key - a.key);
  return events.slice(0, limit).map((e) => ({ id: e.id, icon: e.icon, tone: e.tone, text: e.text, time: timeLabel(e.date) }));
}
