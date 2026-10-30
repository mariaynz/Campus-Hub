import { daysFromNow } from '../utils/tasks.js';

// Materias de ejemplo (la calificación de cada una se calcula con sus tareas)
export const initialSubjects = [
  { id: 1, nombre: 'Diseño de Interfaces' },
  { id: 2, nombre: 'Estructuras de Datos' },
  { id: 3, nombre: 'Matemáticas Discretas' },
  { id: 4, nombre: 'Bases de Datos' },
  { id: 5, nombre: 'Inglés' },
];

// Las fechas son relativas a hoy
export const initialTasks = [
  { id: 1, materia: 'Diseño de Interfaces', tarea: 'Proyecto final', due: daysFromNow(2), estado: 'En progreso', completedAt: null, calificacion: null },
  { id: 2, materia: 'Estructuras de Datos', tarea: 'Tarea 3', due: daysFromNow(4), estado: 'Pendiente', completedAt: null, calificacion: null },
  { id: 3, materia: 'Matemáticas Discretas', tarea: 'Ejercicios 5 a 8', due: daysFromNow(8), estado: 'Pendiente', completedAt: null, calificacion: null },
  { id: 4, materia: 'Bases de Datos', tarea: 'Práctica de consultas', due: daysFromNow(-1), estado: 'Completada', completedAt: daysFromNow(-1), calificacion: 9.0 },
];

// `to`: ruta a la que lleva. Las pestañas sin `to` todavía no tienen pantalla.
export const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Materias', to: '/materias' },
  { label: 'Tareas', to: '/tareas' },
  { label: 'Calendario', to: '/calendario' },
  { label: 'Calificaciones', to: '/calificaciones' },
];
