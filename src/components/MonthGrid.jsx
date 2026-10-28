import { useState } from 'react';
import { DOW, dayTitle, monthGrid, sameDay, sortDay, taskTone } from '../utils/calendar.js';
import { toInputDate } from '../utils/tasks.js';
import './MonthGrid.css';

const MAX_VISIBLE = 2;

// Cuadrícula de un mes. Las tareas se pueden arrastrar a otro día (no a días pasados).
export default function MonthGrid({ year, month, byDay, today, selected, onSelect, onMove }) {
  const [dragOver, setDragOver] = useState(null);
  const canDrop = (day) => day >= today;

  return (
    <div className="cal__gridwrap">
      <div className="cal__grid">
        {DOW.map((d) => (
          <div key={d} className="cal__dow">{d}</div>
        ))}

        {monthGrid(year, month).map((day) => {
          const key = toInputDate(day);
          const list = sortDay(byDay.get(key) ?? []);
          const isSelected = sameDay(day, selected);
          const isToday = sameDay(day, today);
          const cls =
            'cal__cell' +
            (day.getMonth() !== month ? ' cal__cell--out' : '') +
            (isSelected ? ' cal__cell--selected' : '') +
            (dragOver === key ? ' cal__cell--drop' : '');

          return (
            <div
              key={key}
              className={cls}
              onClick={() => onSelect(day)}
              onDragOver={(e) => {
                if (!canDrop(day)) return;
                e.preventDefault();
                if (dragOver !== key) setDragOver(key);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(null);
                const id = Number(e.dataTransfer.getData('text/plain'));
                if (id && canDrop(day)) onMove(id, day);
              }}
            >
              <button
                type="button"
                className={'cal__day' + (isToday ? ' cal__day--today' : '')}
                aria-label={`${dayTitle(day)}, ${list.length} ${list.length === 1 ? 'tarea' : 'tareas'}`}
                aria-current={isToday ? 'date' : undefined}
                aria-pressed={isSelected}
                onClick={(e) => { e.stopPropagation(); onSelect(day); }}
              >
                {day.getDate()}
              </button>

              {/* Escritorio: etiquetas arrastrables */}
              {list.slice(0, MAX_VISIBLE).map((t) => (
                <div
                  key={t.id}
                  className={`cal__task cal__task--${taskTone(t)}`}
                  draggable
                  title={`${t.materia} · ${t.tarea}`}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', String(t.id));
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragEnd={() => setDragOver(null)}
                >
                  {t.tarea}
                </div>
              ))}
              {list.length > MAX_VISIBLE && <span className="cal__more">+{list.length - MAX_VISIBLE} más</span>}

              {/* Móvil: puntos de color en lugar de etiquetas */}
              {list.length > 0 && (
                <span className="cal__dots" aria-hidden="true">
                  {list.slice(0, 4).map((t) => (
                    <span key={t.id} className={`cal__dot cal__dot--${taskTone(t)}`} />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
