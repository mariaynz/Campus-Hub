import Panel from './Panel.jsx';
import './ProgressPanel.css';

const R = 78.3;

export default function ProgressPanel({ segments }) {
  let offset = 0;
  const label = segments.map((s) => `${s.value}% ${s.name.toLowerCase()}`).join(', ');
  return (
    <Panel title="Progreso del semestre" id="progress-title">
      <div className="donut">
        <svg viewBox="0 0 180 180" width="180" height="180" role="img" aria-label={label}>
          <g fill="none" strokeWidth="23.4" transform="rotate(-90 90 90)">
            {segments.map((s) => {
              const circle = (
                <circle
                  key={s.name}
                  cx="90" cy="90" r={R}
                  pathLength="100"
                  stroke={`var(--status-${s.tone})`}
                  strokeDasharray={`${s.value} ${100 - s.value}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += s.value;
              return circle;
            })}
          </g>
        </svg>
        <div className="donut__center">
          <span className="donut__pct">{segments[0].value}%</span>
          <span className="donut__label">completado</span>
        </div>
      </div>
      <ul className="legend">
        {segments.map((s) => (
          <li key={s.name}>
            <span className={`dot dot--${s.tone}`} />
            <span className="legend__name">{s.name}</span>
            <strong>{s.value}%</strong>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
