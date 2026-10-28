import { useEffect, useRef, useState } from 'react';
import Button from './Button.jsx';
import Icon from './Icon.jsx';
import './AddTaskDialog.css'; // mismos estilos de modal y campos

const EMPTY = { nombre: '' };
const norm = (s) => s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function AddSubjectDialog({ open, onClose, onSubmit, existing }) {
  const ref = useRef(null);
  const nameRef = useRef(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) {
      setForm(EMPTY);
      nameRef.current.setCustomValidity('');
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleName = (e) => {
    const nombre = e.target.value;
    setForm((f) => ({ ...f, nombre }));
    const repeated = existing.some((n) => norm(n) === norm(nombre));
    e.target.setCustomValidity(repeated ? 'Ya tienes una materia con ese nombre' : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre: form.nombre.trim() });
  };

  return (
    <dialog className="modal" ref={ref} onClose={onClose} aria-labelledby="add-subject-title">
      <form onSubmit={handleSubmit}>
        <h2 id="add-subject-title">Agregar materia</h2>
        <p className="modal__sub">Su calificación se calcula con las tareas que completes.</p>

        <label className="field">
          <span className="field__label">Nombre</span>
          <input
            className="field__input" type="text" ref={nameRef} value={form.nombre} onChange={handleName}
            placeholder="Ej. Redes de Computadoras" autoComplete="off" required
          />
        </label>

        <div className="modal__actions">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">
            <Icon name="plus" size={18} />
            Guardar materia
          </Button>
        </div>
      </form>
    </dialog>
  );
}
