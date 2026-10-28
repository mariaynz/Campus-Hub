import { formatGrade } from '../utils/tasks.js';
import './GradeInput.css'; // estilos de la calificación
import IconButton from './IconButton.jsx';
import './SubjectCard.css';

const COUNTS = [
  ['Pendiente', 'pending', 'pendiente', 'pendientes'],
  ['En progreso', 'progress', 'en progreso', 'en progreso'],
  ['Completada', 'success', 'completada', 'completadas'],
];

export default function SubjectCard({ subject, counts, grade, onDelete }) {
  const total = counts.Pendiente + counts['En progreso'] + counts.Completada;
  return (
    <li className="subject">
      <div className="subject__head">
        <div>
          <h2 className="subject__name">{subject.nombre}</h2>
          <p className="subject__total">{total} {total === 1 ? 'tarea' : 'tareas'}</p>
        </div>
        <IconButton icon="trash" label={`Eliminar ${subject.nombre}`} onClick={onDelete} />
      </div>

      <ul className="subject__counts">
        {COUNTS.map(([estado, tone, one, many]) => (
          <li key={estado} className="subject__count">
            <span className={`dot dot--${tone}`} />
            {counts[estado]} {counts[estado] === 1 ? one : many}
          </li>
        ))}
      </ul>

      <div className="subject__foot">
        <div className="grade" title="Promedio de tus tareas completadas con calificación">
          <span className="grade__label">Calificación</span>
          <span className="grade__value">{grade === null ? '—' : formatGrade(grade)}</span>
          <span className="grade__max">/ 10</span>
        </div>
        <a className="link" href={`#/tareas?materia=${encodeURIComponent(subject.nombre)}`}>Ver tareas</a>
      </div>
    </li>
  );
}
