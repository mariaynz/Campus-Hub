import { useEffect, useState } from 'react';
import { initialTasks } from '../data/mock.js';
import { fromStored, nextEstado, parseInputDate, today, toStored } from '../utils/tasks.js';

const KEY = 'campus-hub:tasks:v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialTasks;
    const saved = JSON.parse(raw);
    return Array.isArray(saved) ? saved.map(fromStored) : initialTasks;
  } catch {
    return initialTasks;
  }
}

export default function useTasks() {
  const [tasks, setTasks] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(tasks.map(toStored)));
    } catch {
      /* sin almacenamiento: la app sigue funcionando, solo no guarda */
    }
  }, [tasks]);

  const addTask = ({ materia, tarea, fecha }) =>
    setTasks((prev) => [
      ...prev,
      {
        id: Math.max(0, ...prev.map((t) => t.id)) + 1,
        materia,
        tarea,
        due: parseInputDate(fecha),
        estado: 'Pendiente',
        completedAt: null,
        calificacion: null,
      },
    ]);

  // Pendiente → En progreso → Completada → Pendiente
  const cycleStatus = (id) =>
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const estado = nextEstado(t.estado);
        return { ...t, estado, completedAt: estado === 'Completada' ? today() : null };
      })
    );

  const setTaskGrade = (id, calificacion) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, calificacion } : t)));

  const moveTask = (id, due) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, due } : t)));

  const removeTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const removeTasksByMateria = (materia) => setTasks((prev) => prev.filter((t) => t.materia !== materia));

  const resetTasks = () => setTasks(initialTasks);

  return { tasks, addTask, cycleStatus, setTaskGrade, moveTask, removeTask, removeTasksByMateria, resetTasks };
}
