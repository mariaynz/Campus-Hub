import { useMemo } from 'react';
import Welcome from '../components/Welcome.jsx';
import StatCard from '../components/StatCard.jsx';
import TaskList from '../components/TaskList.jsx';
import ProgressPanel from '../components/ProgressPanel.jsx';
import ActivityPanel from '../components/ActivityPanel.jsx';
import { activityFromTasks } from '../utils/activity.js';
import { greetingFor } from '../utils/greeting.js';
import { daysLeft, dueLabel, isDone, isUrgent, progressFromTasks, sortTasks, averageFromTasks } from '../utils/tasks.js';

export default function HomePage({ name, tasks, subjects, onAdd, onCycle }) {
  const sorted = useMemo(() => sortTasks(tasks), [tasks]);
  const pending = sorted.filter((t) => !isDone(t));
  const inProgress = pending.filter((t) => t.estado === 'En progreso').length;
  const next = pending[0];
  const average = useMemo(() => averageFromTasks(subjects, tasks), [subjects, tasks]);
  const progress = useMemo(() => progressFromTasks(tasks), [tasks]);
  const activity = useMemo(() => activityFromTasks(tasks), [tasks]);

  let subtitle = 'No tienes tareas por entregar. ¡Buen trabajo!';
  if (next) {
    const d = daysLeft(next);
    const when = d < 0 ? 'ya venció' : d === 0 ? 'vence hoy' : d === 1 ? 'vence mañana' : `vence en ${d} días`;
    subtitle = `Tienes ${pending.length} ${pending.length === 1 ? 'tarea' : 'tareas'} por entregar. La más urgente ${when}.`;
  }

  return (
    <main className="page">
      <Welcome title={`${greetingFor(new Date().getHours())}, ${name}`} subtitle={subtitle} onAdd={onAdd} />

      <section className="stats" aria-label="Resumen">
        <StatCard
          label="Tareas pendientes"
          value={pending.length}
          detail={`${inProgress} en progreso · ${pending.length - inProgress} sin empezar`}
        />
        <StatCard
          featured
          label="Próxima entrega"
          value={next ? dueLabel(next) : '—'}
          detail={next ? `${next.tarea} · ${next.materia}` : 'Todo al día'}
          urgent={next ? isUrgent(next) : false}
        />
        <StatCard label="Promedio general" value={average.value} detail={average.detail} />
      </section>

      <div className="columns">
        <TaskList tasks={sorted} onCycle={onCycle} />
        <ProgressPanel segments={progress} />
      </div>

      <ActivityPanel items={activity} />
    </main>
  );
}
