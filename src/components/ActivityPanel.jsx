import Icon from './Icon.jsx';
import Panel from './Panel.jsx';
import './ActivityPanel.css';

export default function ActivityPanel({ items }) {
  return (
    <Panel title="Actividad reciente" id="activity-title">
      {items.length === 0 && (
        <p className="activity__empty">Aún no hay actividad. Completa una tarea y aparecerá aquí.</p>
      )}
      <ul className="activity__list">
        {items.map((item) => (
          <li key={item.id} className="activity__item">
            <span className={`activity__icon activity__icon--${item.tone}`}>
              <Icon name={item.icon} size={20} />
            </span>
            <div>
              <p className="activity__text">{item.text}</p>
              <p className="activity__time">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
