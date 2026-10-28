import { useMemo, useState } from 'react';
import Welcome from '../components/Welcome.jsx';
import FilterChips from '../components/FilterChips.jsx';
import TaskList from '../components/TaskList.jsx';
import Icon from '../components/Icon.jsx';
import { ESTADOS, isDone, sortTasks } from '../utils/tasks.js';
import './TasksPage.css';

export default function TasksPage({ tasks, materia, onAdd, onCycle, onGrade, onReschedule, onDelete }) {
  const [filter, setFilter] = useState('Todas');
  // Si llegas desde Materias, solo se ven las tareas de esa materia
  const scoped = useMemo(() => (materia ? tasks.filter((t) => t.materia === materia) : tasks), [tasks, materia]);
  const sorted = useMemo(() => sortTasks(scoped), [scoped]);
  const visible = filter === 'Todas' ? sorted : sorted.filter((t) => t.estado === filter);
  const pending = sorted.filter((t) => !isDone(t)).length;

  const options = ['Todas', ...ESTADOS].map((value) => ({
    value,
    label: value,
    count: value === 'Todas' ? sorted.length : sorted.filter((t) => t.estado === value).length,
  }));

  const base = `${sorted.length} ${sorted.length === 1 ? 'tarea' : 'tareas'} · ${pending} por entregar`;
  const subtitle = materia ? `${materia} · ${base}` : base;

  return (
    <main className="page">
      <Welcome title="Tareas" subtitle={subtitle} onAdd={onAdd} />
      <FilterChips options={options} value={filter} onChange={setFilter}>
        {materia && (
          <button
            type="button"
            className="chip chip--active"
            onClick={() => { window.location.hash = '#/tareas'; }}
            aria-label={`Quitar filtro de materia ${materia}`}
          >
            {materia} <Icon name="x" size={14} />
          </button>
        )}
      </FilterChips>
      {visible.length > 0 ? (
        <TaskList tasks={visible} onCycle={onCycle} onGrade={onGrade} onReschedule={onReschedule} onDelete={onDelete} showHeader={false} />
      ) : (
        <p className="empty">
          {sorted.length > 0 ? 'No hay tareas con este estado.' : materia ? `No hay tareas en ${materia}.` : 'Aún no tienes tareas. Usa «Agregar tarea».'}
        </p>
      )}
    </main>
  );
}
