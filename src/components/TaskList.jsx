import TaskCard from './TaskCard.jsx';
import './TaskList.css';

export default function TaskList({ tasks }) {
  return (
    <section className="tasks" aria-labelledby="tasks-title">
      <div className="section-head">
        <h2 id="tasks-title">Próximas entregas</h2>
        <a className="link" href="#">Ver todas</a>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ul>
    </section>
  );
}
