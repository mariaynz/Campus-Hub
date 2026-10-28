import { useMemo, useState } from 'react';
import Welcome from '../components/Welcome.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import MonthGrid from '../components/MonthGrid.jsx';
import TaskList from '../components/TaskList.jsx';
import { MESES, dayTitle, groupByDay, sortDay } from '../utils/calendar.js';
import { isDone, toInputDate, today } from '../utils/tasks.js';
import './CalendarPage.css';

export default function CalendarPage({ tasks, onAdd, onCycle, onMove }) {
  const now = useMemo(today, []);
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selected, setSelected] = useState(now);

  const byDay = useMemo(() => groupByDay(tasks), [tasks]);
  const monthTasks = tasks.filter((t) => t.due.getFullYear() === view.year && t.due.getMonth() === view.month);
  const monthPending = monthTasks.filter((t) => !isDone(t)).length;
  const dayTasks = sortDay(byDay.get(toInputDate(selected)) ?? []);

  const goMonth = (delta) => {
    const d = new Date(view.year, view.month + delta, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  };
  const goToday = () => {
    setView({ year: now.getFullYear(), month: now.getMonth() });
    setSelected(now);
  };
  const select = (date) => {
    setSelected(date);
    if (date.getMonth() !== view.month || date.getFullYear() !== view.year) {
      setView({ year: date.getFullYear(), month: date.getMonth() });
    }
  };
  const move = (id, date) => {
    onMove(id, date);
    setSelected(date);
  };

  const subtitle = `${monthTasks.length} ${monthTasks.length === 1 ? 'tarea' : 'tareas'} en ${MESES[view.month].toLowerCase()} · ${monthPending} por entregar`;
  const monthLabel = `${MESES[view.month]} ${view.year}`;

  return (
    <main className="page">
      {/* El botón agrega la tarea con el día seleccionado como fecha (si no es un día pasado) */}
      <Welcome
        title="Calendario"
        subtitle={subtitle}
        onAdd={() => onAdd(selected >= now ? toInputDate(selected) : '')}
      />

      <section className="cal" aria-label="Calendario mensual">
        <div className="cal__bar">
          <h2 className="cal__title" aria-live="polite">{monthLabel}</h2>
          <div className="cal__controls">
            <button type="button" className="cal__nav" onClick={() => goMonth(-1)} aria-label="Mes anterior">
              <Icon name="chevron-left" size={18} />
            </button>
            <Button variant="secondary" onClick={goToday}>Hoy</Button>
            <button type="button" className="cal__nav" onClick={() => goMonth(1)} aria-label="Mes siguiente">
              <Icon name="chevron-right" size={18} />
            </button>
          </div>
        </div>
        <MonthGrid
          year={view.year}
          month={view.month}
          byDay={byDay}
          today={now}
          selected={selected}
          onSelect={select}
          onMove={move}
        />
      </section>

      <section className="day" aria-labelledby="day-title" aria-live="polite">
        <h2 id="day-title">{dayTitle(selected)}</h2>
        {dayTasks.length > 0 ? (
          <TaskList tasks={dayTasks} onCycle={onCycle} onReschedule={move} showHeader={false} />
        ) : (
          <p className="cal-empty">Sin tareas este día.</p>
        )}
      </section>
    </main>
  );
}
