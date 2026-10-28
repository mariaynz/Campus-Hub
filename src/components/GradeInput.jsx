import { useEffect, useState } from 'react';
import './GradeInput.css';

// Campo de calificación (0 a 10). Se guarda al salir del campo o con Enter.
// Vacío = sin calificación; fuera de rango se ajusta; texto inválido se ignora.
export default function GradeInput({ id, value, onCommit }) {
  const show = (v) => (typeof v === 'number' ? String(v) : '');
  const [text, setText] = useState(show(value));

  useEffect(() => setText(show(value)), [value]);

  const commit = () => {
    const raw = text.trim().replace(',', '.');
    if (raw !== '' && Number.isNaN(Number(raw))) {
      setText(show(value)); // texto inválido: se conserva la calificación anterior
      return;
    }
    const next = raw === '' ? null : Math.round(Math.min(10, Math.max(0, Number(raw))) * 10) / 10;
    setText(show(next));
    if (next !== value) onCommit(next);
  };

  return (
    <input
      id={id}
      className="grade__input"
      type="text"
      inputMode="decimal"
      placeholder="—"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
    />
  );
}
