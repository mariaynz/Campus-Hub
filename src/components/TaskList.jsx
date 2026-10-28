import TaskCard from './TaskCard.jsx';
import './TaskList.css';

export default function TaskList({ tasks, onCycle, onGrade, onReschedule, onDelete, showHeader = true }) {
  const list = (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onCycle={onCycle} onGrade={onGrade} onReschedule={onReschedule} onDelete={onDelete} />
      ))}
    </ul>
  );

  if (!showHeader) return list;

  return (
    <section className="tasks" aria-labelledby="tasks-title">
      <div className="section-head">
        <h2 id="tasks-title">Próximas entregas</h2>
        <a className="link" href="#/tareas">Ver todas</a>
      </div>
      {list}
    </section>
  );
}
