import { daysFromNow } from '../utils/tasks.js';

export const SUBJECTS = [
  'Diseño de Interfaces',
  'Estructuras de Datos',
  'Matemáticas Discretas',
  'Bases de Datos',
  'Inglés',
];

// Las fechas son relativas a hoy
export const initialTasks = [
  { id: 1, materia: 'Diseño de Interfaces', tarea: 'Proyecto final', due: daysFromNow(2), estado: 'En progreso' },
  { id: 2, materia: 'Estructuras de Datos', tarea: 'Tarea 3', due: daysFromNow(4), estado: 'Pendiente' },
  { id: 3, materia: 'Matemáticas Discretas', tarea: 'Ejercicios 5 a 8', due: daysFromNow(8), estado: 'Pendiente' },
  { id: 4, materia: 'Bases de Datos', tarea: 'Práctica de consultas', due: daysFromNow(-1), estado: 'Completada' },
];

export const progress = [
  { name: 'Completado', value: 72, tone: 'success' },
  { name: 'En progreso', value: 20, tone: 'progress' },
  { name: 'Pendiente', value: 8, tone: 'pending' },
];

export const activity = [
  { id: 1, icon: 'file', tone: 'brand', text: 'Subiste «avance.pdf» a Diseño de Interfaces', time: 'Hace 2 horas' },
  { id: 2, icon: 'message', tone: 'progress', text: 'Nuevo comentario en Estructuras de Datos', time: 'Ayer' },
  { id: 3, icon: 'star', tone: 'success', text: 'Nueva calificación en Matemáticas Discretas', time: 'Hace 2 días' },
];

export const navItems = ['Inicio', 'Materias', 'Tareas', 'Calendario', 'Calificaciones'];
export const average = { value: '8.6', detail: 'De 10 · cinco materias' };
