const MS_DAY = 24 * 60 * 60 * 1000;

export function today() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export const daysFromNow = (n) => new Date(today().getTime() + n * MS_DAY);

export const daysLeft = (task) => Math.round((task.due - today()) / MS_DAY);

export const isDone = (task) => task.estado === 'Completada';

// Urgente: sin completar y con 2 días o menos
export const isUrgent = (task) => !isDone(task) && daysLeft(task) <= 2;

export function dueLabel(task) {
  const d = daysLeft(task);
  if (isDone(task)) return d === -1 ? 'Entregada ayer' : `Entregada hace ${-d} días`;
  if (d < 0) return `Venció hace ${-d} ${d === -1 ? 'día' : 'días'}`;
  if (d === 0) return 'Hoy';
  if (d === 1) return 'Mañana';
  return `En ${d} días`;
}

// Pendientes primero por fecha; completadas al final
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (isDone(a) !== isDone(b)) return isDone(a) ? 1 : -1;
    return a.due - b.due;
  });
}

// "YYYY-MM-DD" (input date) -> Date local
export function parseInputDate(value) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toInputDate(date) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}
