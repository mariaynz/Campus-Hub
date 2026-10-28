import Badge from './Badge.jsx';
import GradeInput from './GradeInput.jsx';
import Icon from './Icon.jsx';
import { PASSING_GRADE, formatGrade, gradeStatus } from '../utils/tasks.js';
import './SubjectGradeRow.css';

// Fila de una materia: calificación, barra de 0 a 10 y, al abrirla, el desglose por tarea
export default function SubjectGradeRow({ name, grade, graded, onGrade }) {
  const status = gradeStatus(grade);
  const pct = grade === null ? 0 : Math.min(100, grade * 10);

  return (
    <li>
      <details className="gr">
        <summary className="gr__summary">
          <span className="gr__main">
            <span className="gr__name">{name}</span>
            <span className="gr__meta">
              {graded.length} {graded.length === 1 ? 'tarea calificada' : 'tareas calificadas'}
            </span>
          </span>

          <span className="gr__bar" aria-hidden="true">
            <span className={'gr__fill' + (status === 'Reprobada' ? ' gr__fill--fail' : '')} style={{ width: `${pct}%` }} />
            <span className="gr__min" style={{ left: `${PASSING_GRADE * 10}%` }} />
          </span>

          <span className="gr__result">
            <span className="gr__grade">{grade === null ? '—' : formatGrade(grade)}</span>
            <Badge estado={status} />
          </span>

          <span className="gr__chev"><Icon name="chevron-down" size={18} /></span>
        </summary>

        <div className="gr__body">
          {graded.length > 0 ? (
            <ul>
              {graded.map((t) => (
                <li key={t.id} className="gr__task">
                  <span className="gr__task-name">{t.tarea}</span>
                  <div className="grade">
                    <GradeInput id={`gr-${t.id}`} value={t.calificacion} onCommit={(g) => onGrade(t.id, g)} />
                    <span className="grade__max">/ 10</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="gr__empty">Aún no hay tareas calificadas en esta materia.</p>
          )}
        </div>
      </details>
    </li>
  );
}
