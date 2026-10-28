import { useMemo, useState } from 'react';
import Topbar from './components/Topbar.jsx';
import Welcome from './components/Welcome.jsx';
import StatCard from './components/StatCard.jsx';
import TaskList from './components/TaskList.jsx';
import ProgressPanel from './components/ProgressPanel.jsx';
import ActivityPanel from './components/ActivityPanel.jsx';
import AddTaskDialog from './components/AddTaskDialog.jsx';
import { initialTasks, progress, activity, average } from './data/mock.js';
import { daysLeft, dueLabel, isDone, isUrgent, parseInputDate, sortTasks } from './utils/tasks.js';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sorted = useMemo(() => sortTasks(tasks), [tasks]);
  const pending = sorted.filter((t) => !isDone(t));
  const inProgress = pending.filter((t) => t.estado === 'En progreso').length;
  const next = pending[0];

  let subtitle = 'No tienes tareas por entregar. ¡Buen trabajo!';
  if (next) {
    const d = daysLeft(next);
    const when = d <= 0 ? 'hoy' : d === 1 ? 'mañana' : `en ${d} días`;
    subtitle = `Tienes ${pending.length} ${pending.length === 1 ? 'tarea' : 'tareas'} por entregar. La más urgente vence ${when}.`;
  }

  const addTask = ({ materia, tarea, fecha }) => {
    setTasks((prev) => [
      ...prev,
      { id: Math.max(0, ...prev.map((t) => t.id)) + 1, materia, tarea, due: parseInputDate(fecha), estado: 'Pendiente' },
    ]);
    setDialogOpen(false);
  };

  return (
    <>
      <Topbar />
      <main className="page">
        <Welcome name="María" subtitle={subtitle} onAdd={() => setDialogOpen(true)} />

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
          <TaskList tasks={sorted} />
          <ProgressPanel segments={progress} />
        </div>

        <ActivityPanel items={activity} />
      </main>

      <AddTaskDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={addTask} />
    </>
  );
}
