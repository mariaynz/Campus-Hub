import Badge from './Badge.jsx';
import Icon from './Icon.jsx';
import GradeInput from './GradeInput.jsx';
import IconButton from './IconButton.jsx';
import DateButton from './DateButton.jsx';
import { dueLabel, isDone, isUrgent, toInputDate, today } from '../utils/tasks.js';
import './TaskCard.css';

// onCycle: clic en la tarjeta cambia el estado.
// onGrade (opcional): muestra el campo de calificación en las tareas completadas.
// onReschedule (opcional): muestra el botón para cambiar la fecha de entrega.
// onDelete (opcional): muestra el botón de eliminar.
export default function TaskCard({ task, onCycle, onGrade, onReschedule, onDelete }) {
  const done = isDone(task);
  const cls = 'task' + (isUrgent(task) ? ' task--urgent' : '') + (done ? ' task--done' : '') + (onGrade ? ' task--grading' : '');
  return (
    <li className={cls}>
      <button
        type="button"
        className="task__main"
        onClick={() => onCycle(task.id)}
        title="Clic para cambiar el estado"
      >
        <span className="task__info">
          <span className="task__subject">{task.materia}</span>
          <span className="task__title">{task.tarea}</span>
        </span>
        <span className="task__side">
          <span className="task__due">
            <Icon name={done ? 'check' : 'clock'} size={16} />
            <span>{dueLabel(task)}</span>
          </span>
          <Badge estado={task.estado} />
        </span>
      </button>
      {onGrade && (
        <div className={'task__grade' + (done ? '' : ' task__grade--empty')}>
          {done && (
            <>
              <label className="grade__label" htmlFor={`task-grade-${task.id}`}>Calificación</label>
              <div className="grade">
                <GradeInput id={`task-grade-${task.id}`} value={task.calificacion} onCommit={(g) => onGrade(task.id, g)} />
                <span className="grade__max">/ 10</span>
              </div>
            </>
          )}
        </div>
      )}
      {(onReschedule || onDelete) && (
        <div className="task__actions">
          {onReschedule && (
            <DateButton
              label={`Cambiar fecha de ${task.tarea}`}
              value={toInputDate(task.due)}
              min={toInputDate(today())}
              onChange={(date) => onReschedule(task.id, date)}
            />
          )}
          {onDelete && (
            <IconButton icon="trash" label={`Eliminar ${task.tarea}`} onClick={() => onDelete(task.id)} />
          )}
        </div>
      )}
    </li>
  );
}
