import { useRef } from 'react';
import IconButton from './IconButton.jsx';
import { parseInputDate } from '../utils/tasks.js';
import './DateButton.css';

// Botón con ícono de calendario que abre el selector de fecha del navegador
export default function DateButton({ label, value, min, onChange }) {
  const ref = useRef(null);

  const open = () => {
    const input = ref.current;
    try {
      input.showPicker();
    } catch {
      input.focus();
      input.click();
    }
  };

  return (
    <span className="date-btn">
      <IconButton icon="calendar" label={label} tone="neutral" onClick={open} />
      <input
        ref={ref}
        className="date-btn__input"
        type="date"
        value={value}
        min={min}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => e.target.value && onChange(parseInputDate(e.target.value))}
      />
    </span>
  );
}
