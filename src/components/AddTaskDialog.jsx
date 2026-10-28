import { useEffect, useRef, useState } from 'react';
import Button from './Button.jsx';
import Icon from './Icon.jsx';
import { today, toInputDate } from '../utils/tasks.js';
import './AddTaskDialog.css';

const EMPTY = { materia: '', tarea: '', fecha: '' };

export default function AddTaskDialog({ open, onClose, onSubmit, subjects, defaultDate = '' }) {
  const ref = useRef(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) {
      setForm({ ...EMPTY, fecha: defaultDate });
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, tarea: form.tarea.trim() });
  };

  return (
    <dialog className="modal" ref={ref} onClose={onClose} aria-labelledby="add-title">
      <form onSubmit={handleSubmit}>
        <h2 id="add-title">Agregar tarea</h2>
        <p className="modal__sub">Anótala ahora, antes de que se te olvide.</p>

        <label className="field">
          <span className="field__label">Materia</span>
          <select className="field__input field__input--select" value={form.materia} onChange={set('materia')} required>
            <option value="" disabled>
              {subjects.length ? 'Selecciona una materia' : 'Primero agrega una materia'}
            </option>
            {subjects.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Tarea</span>
          <input
            className="field__input" type="text" value={form.tarea} onChange={set('tarea')}
            placeholder="Ej. Tarea 4: árboles binarios" autoComplete="off" required
          />
        </label>

        <label className="field">
          <span className="field__label">Fecha de entrega</span>
          <input
            className="field__input field__input--date" type="date" value={form.fecha} onChange={set('fecha')}
            min={toInputDate(today())} required
          />
        </label>

        <div className="modal__actions">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">
            <Icon name="plus" size={18} />
            Guardar tarea
          </Button>
        </div>
      </form>
    </dialog>
  );
}
