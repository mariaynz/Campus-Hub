import Welcome from '../components/Welcome.jsx';
import StatCard from '../components/StatCard.jsx';
import Panel from '../components/Panel.jsx';
import GradeInput from '../components/GradeInput.jsx';
import SubjectGradeRow from '../components/SubjectGradeRow.jsx';
import {
  PASSING_GRADE, averageFromTasks, gradeStatus, gradedTasksOf, isGraded, subjectGrade, ungradedTasks,
} from '../utils/tasks.js';
import './GradesPage.css';

export default function GradesPage({ subjects, tasks, onGrade }) {
  const rows = subjects.map((s) => ({ subject: s, grade: subjectGrade(s.nombre, tasks), graded: gradedTasksOf(s.nombre, tasks) }));
  const average = averageFromTasks(subjects, tasks);
  const approved = rows.filter((r) => gradeStatus(r.grade) === 'Aprobada').length;
  const toGrade = ungradedTasks(tasks);
  const gradedCount = tasks.filter(isGraded).length;

  const subtitle = `${gradedCount} ${gradedCount === 1 ? 'tarea calificada' : 'tareas calificadas'} · mínima aprobatoria ${PASSING_GRADE}`;

  return (
    <main className="page">
      <Welcome title="Calificaciones" subtitle={subtitle} />

      <section className="stats" aria-label="Resumen de calificaciones">
        <StatCard label="Tareas por calificar" value={toGrade.length} detail="Completadas sin calificación" />
        <StatCard
          featured
          label="Promedio general"
          value={average.value}
          detail={average.detail}
          urgent={average.mean !== null && Math.round(average.mean * 10) / 10 < PASSING_GRADE}
        />
        <StatCard
          label="Materias aprobadas"
          value={approved}
          detail={`De ${subjects.length} ${subjects.length === 1 ? 'materia' : 'materias'}`}
        />
      </section>

      <div className="columns">
        <section className="tasks" aria-labelledby="by-subject-title">
          <div className="section-head">
            <h2 id="by-subject-title">Calificación por materia</h2>
          </div>
          {rows.length > 0 ? (
            <>
              <ul className="gr-list">
                {rows.map(({ subject, grade, graded }) => (
                  <SubjectGradeRow key={subject.id} name={subject.nombre} grade={grade} graded={graded} onGrade={onGrade} />
                ))}
              </ul>
              <p className="gr-note">La marca gris de cada barra indica la calificación mínima aprobatoria ({PASSING_GRADE}).</p>
            </>
          ) : (
            <p className="gr-note">Aún no tienes materias. Agrégalas en la pestaña Materias.</p>
          )}
        </section>

        <Panel title="Por calificar" id="to-grade-title">
          {toGrade.length > 0 ? (
            <ul className="todo">
              {toGrade.map((t) => (
                <li key={t.id} className="todo__item">
                  <span className="todo__info">
                    <span className="todo__subject">{t.materia}</span>
                    <span className="todo__title">{t.tarea}</span>
                  </span>
                  <div className="grade">
                    <GradeInput id={`todo-${t.id}`} value={t.calificacion} onCommit={(g) => onGrade(t.id, g)} />
                    <span className="grade__max">/ 10</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="gr-note">No tienes tareas por calificar.</p>
          )}
        </Panel>
      </div>
    </main>
  );
}
