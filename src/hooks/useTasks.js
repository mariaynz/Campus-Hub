import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { fromStored, nextEstado, today, toInputDate } from '../utils/tasks.js';

// Fila de la tabla `tareas` → tarea de la app (las fechas pasan a Date)
const fromRow = (r) =>
  fromStored({
    id: r.id,
    materia: r.materia,
    tarea: r.tarea,
    due: r.due,
    estado: r.estado,
    completedAt: r.completed_at,
    calificacion: r.calificacion === null ? null : Number(r.calificacion),
  });

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const { data, error } = await supabase.from('tareas').select('*').order('id');
    if (!error) setTasks(data.map(fromRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // La pantalla cambia al instante; si Supabase falla, se vuelve a leer lo guardado
  const save = async (query) => {
    const { error } = await query;
    if (error) reload();
  };

  const addTask = async ({ materia, tarea, fecha }) => {
    const { data, error } = await supabase.from('tareas').insert({ materia, tarea, due: fecha }).select().single();
    if (error) return reload();
    setTasks((prev) => [...prev, fromRow(data)]);
  };

  // Pendiente → En progreso → Completada → Pendiente
  const cycleStatus = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const estado = nextEstado(task.estado);
    const completedAt = estado === 'Completada' ? today() : null;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, estado, completedAt } : t)));
    save(
      supabase
        .from('tareas')
        .update({ estado, completed_at: completedAt ? toInputDate(completedAt) : null })
        .eq('id', id)
    );
  };

  const setTaskGrade = (id, calificacion) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, calificacion } : t)));
    save(supabase.from('tareas').update({ calificacion }).eq('id', id));
  };

  const moveTask = (id, due) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, due } : t)));
    save(supabase.from('tareas').update({ due: toInputDate(due) }).eq('id', id));
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    save(supabase.from('tareas').delete().eq('id', id));
  };

  const removeTasksByMateria = (materia) => {
    setTasks((prev) => prev.filter((t) => t.materia !== materia));
    save(supabase.from('tareas').delete().eq('materia', materia));
  };

  return { tasks, loading, reload, addTask, cycleStatus, setTaskGrade, moveTask, removeTask, removeTasksByMateria };
}
