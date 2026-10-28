import Badge from './Badge.jsx';
import Icon from './Icon.jsx';
import { dueLabel, isDone, isUrgent } from '../utils/tasks.js';
import './TaskCard.css';

export default function TaskCard({ task }) {
  const done = isDone(task);
  const cls = 'task' + (isUrgent(task) ? ' task--urgent' : '') + (done ? ' task--done' : '');
  return (
    <li className={cls}>
      <div className="task__info">
        <p className="task__subject">{task.materia}</p>
        <p className="task__title">{task.tarea}</p>
      </div>
      <div className="task__side">
        <p className="task__due">
          <Icon name={done ? 'check' : 'clock'} size={16} />
          <span>{dueLabel(task)}</span>
        </p>
        <Badge estado={task.estado} />
      </div>
    </li>
  );
}
