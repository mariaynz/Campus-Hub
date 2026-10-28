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
  if (isDone(task)) {
    const n = task.completedAt ? Math.round((today() - task.completedAt) / MS_DAY) : -d;
    return n <= 0 ? 'Entregada hoy' : n === 1 ? 'Entregada ayer' : `Entregada hace ${n} días`;
  }
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

// Estados, en el orden en que cambian al hacer clic en una tarea
export const ESTADOS = ['Pendiente', 'En progreso', 'Completada'];

export const nextEstado = (estado) => ESTADOS[(ESTADOS.indexOf(estado) + 1) % ESTADOS.length];

// Guardado en localStorage: las fechas se guardan como "YYYY-MM-DD"
export const toStored = (t) => ({
  ...t,
  due: toInputDate(t.due),
  completedAt: t.completedAt ? toInputDate(t.completedAt) : null,
});

export const fromStored = (t) => ({
  ...t,
  due: parseInputDate(t.due),
  completedAt: t.completedAt ? parseInputDate(t.completedAt) : null,
});

// Porcentaje de tareas por estado (suma siempre 100; método del resto mayor)
export function progressFromTasks(tasks) {
  const defs = [
    ['Completada', 'Completado', 'success'],
    ['En progreso', 'En progreso', 'progress'],
    ['Pendiente', 'Pendiente', 'pending'],
  ];
  const total = tasks.length;
  const raw = defs.map(([estado]) => (total ? (tasks.filter((t) => t.estado === estado).length * 100) / total : 0));
  const values = raw.map(Math.floor);
  if (total) {
    let rest = 100 - values.reduce((a, b) => a + b, 0);
    [0, 1, 2]
      .sort((a, b) => raw[b] - values[b] - (raw[a] - values[a]))
      .forEach((i) => { if (rest-- > 0) values[i] += 1; });
  }
  return defs.map(([, name, tone], i) => ({ name, value: values[i], tone }));
}

// Calificación de una materia: promedio de sus tareas completadas que tienen calificación (o null)
export function subjectGrade(nombre, tasks) {
  const grades = tasks
    .filter((t) => t.materia === nombre && isDone(t) && typeof t.calificacion === 'number')
    .map((t) => t.calificacion);
  return grades.length ? grades.reduce((a, b) => a + b, 0) / grades.length : null;
}

// Calificación mínima aprobatoria
export const PASSING_GRADE = 6;

export const isGraded = (t) => isDone(t) && typeof t.calificacion === 'number';

export const gradedTasksOf = (nombre, tasks) => tasks.filter((t) => t.materia === nombre && isGraded(t));

// Tareas completadas que todavía no tienen calificación (las más recientes primero)
export const ungradedTasks = (tasks) =>
  tasks.filter((t) => isDone(t) && typeof t.calificacion !== 'number').sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

export function gradeStatus(grade) {
  if (grade === null) return 'Sin calificar';
  return Math.round(grade * 10) / 10 >= PASSING_GRADE ? 'Aprobada' : 'Reprobada';
}

export const formatGrade = (g) => (Math.round(g * 10) / 10).toFixed(1);

// Promedio general: promedio de las calificaciones de las materias que ya tienen una
const WORDS = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

export function averageFromTasks(subjects, tasks) {
  const grades = subjects.map((s) => subjectGrade(s.nombre, tasks)).filter((g) => g !== null);
  if (grades.length === 0) return { value: '—', detail: 'Sin calificaciones', mean: null };
  const n = grades.length;
  const mean = grades.reduce((a, b) => a + b, 0) / n;
  return { mean, value: formatGrade(mean), detail: `De 10 · ${WORDS[n] ?? n} ${n === 1 ? 'materia' : 'materias'}` };
}

export const countByEstado = (tasks) =>
  Object.fromEntries(ESTADOS.map((e) => [e, tasks.filter((t) => t.estado === e).length]));
