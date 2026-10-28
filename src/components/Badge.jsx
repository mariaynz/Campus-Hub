import './Badge.css';

const TONE = { 'En progreso': 'progress', Pendiente: 'pending', Completada: 'done' };

export default function Badge({ estado }) {
  return <span className={`badge badge--${TONE[estado]}`}>{estado}</span>;
}
