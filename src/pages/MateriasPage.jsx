import Welcome from '../components/Welcome.jsx';
import SubjectCard from '../components/SubjectCard.jsx';
import { averageFromTasks, countByEstado, subjectGrade } from '../utils/tasks.js';
import './MateriasPage.css';

export default function MateriasPage({ subjects, tasks, onAdd, onDelete }) {
  const { value, detail } = averageFromTasks(subjects, tasks);
  const subtitle = `${subjects.length} ${subjects.length === 1 ? 'materia' : 'materias'} · promedio ${value}`;

  const handleDelete = (subject, count) => {
    if (count > 0) {
      const msg = `«${subject.nombre}» tiene ${count} ${count === 1 ? 'tarea' : 'tareas'}. Si la eliminas, también se borrarán esas tareas. ¿Continuar?`;
      if (!window.confirm(msg)) return;
    }
    onDelete(subject);
  };

  return (
    <main className="page">
      <Welcome title="Materias" subtitle={subtitle} onAdd={onAdd} actionLabel="Agregar materia" />
      {subjects.length > 0 ? (
        <ul className="subjects" aria-label={detail}>
          {subjects.map((subject) => {
            const own = tasks.filter((t) => t.materia === subject.nombre);
            return (
              <SubjectCard
                key={subject.id}
                subject={subject}
                counts={countByEstado(own)}
                grade={subjectGrade(subject.nombre, tasks)}
                onDelete={() => handleDelete(subject, own.length)}
              />
            );
          })}
        </ul>
      ) : (
        <p className="empty">Aún no tienes materias. Usa «Agregar materia».</p>
      )}
    </main>
  );
}
