import { useEffect, useId, useRef, useState } from 'react';
import { THEMES, MODES, FONTS, MAX_NAME } from '../utils/profile.js';
import Icon from './Icon.jsx';
import './ProfileMenu.css';

// Un clic real del mouse (detail > 0) cierra el menú al elegir; con teclado se queda abierto
// para poder recorrer las opciones con las flechas. Escape siempre lo cierra.
const byMouse = (e) => e.detail > 0;

export default function ProfileMenu({ profile, onResetData, onSignOut }) {
  const { name, initials, theme, mode, font, setName, setTheme, setMode, setFont } = profile;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(name);
  const [confirming, setConfirming] = useState(false);
  const wrap = useRef(null);
  const button = useRef(null);
  const id = useId();

  const close = (returnFocus = false) => {
    setOpen(false);
    setConfirming(false);
    if (returnFocus) button.current?.focus();
  };

  const toggle = () => {
    if (open) return close();
    setDraft(name);
    setOpen(true);
  };

  // Cerrar al hacer clic fuera, con Escape o al sacar el foco del menú
  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => { if (!wrap.current?.contains(e.target)) close(); };
    const onKey = (e) => { if (e.key === 'Escape') close(true); };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const commitName = () => {
    if (draft.trim()) setName(draft);
    else setDraft(name); // vacío: vuelve al nombre anterior
  };

  return (
    <div className="profile" ref={wrap} onBlur={(e) => { if (open && !wrap.current?.contains(e.relatedTarget) && e.relatedTarget) close(); }}>
      <button
        ref={button}
        type="button"
        className="avatar"
        aria-label={`Perfil de ${name}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
      >
        {initials}
      </button>

      {open && (
        <div className="profile__menu" id={id} role="dialog" aria-label="Perfil">
          <form
            className="profile__section"
            onSubmit={(e) => { e.preventDefault(); commitName(); close(true); }}
          >
            <label className="profile__label" htmlFor={`${id}-name`}>Nombre</label>
            <input
              id={`${id}-name`}
              className="profile__input"
              value={draft}
              maxLength={MAX_NAME}
              autoComplete="off"
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitName}
            />
          </form>

          <div className="profile__section" role="radiogroup" aria-labelledby={`${id}-theme`}>
            <span className="profile__label" id={`${id}-theme`}>
              Tema de color · <span className="profile__current">{THEMES.find((t) => t.id === theme)?.label}</span>
            </span>
            <div className="profile__themes">
              {THEMES.map((t) => (
                <label key={t.id} className="swatch" title={t.label}>
                  <input
                    type="radio"
                    name={`${id}-theme`}
                    value={t.id}
                    checked={theme === t.id}
                    onChange={() => setTheme(t.id)}
                    onClick={(e) => { if (byMouse(e)) close(); }}
                    aria-label={t.label}
                  />
                  <span className="swatch__dot" style={{ background: t.swatch }}>
                    {theme === t.id && <Icon name="check" size={16} />}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="profile__section" role="radiogroup" aria-labelledby={`${id}-mode`}>
            <span className="profile__label" id={`${id}-mode`}>Apariencia</span>
            <div className="seg">
              {MODES.map((m) => (
                <label key={m.id} className="seg__opt">
                  <input
                    type="radio"
                    name={`${id}-mode`}
                    value={m.id}
                    checked={mode === m.id}
                    onChange={() => setMode(m.id)}
                    onClick={(e) => { if (byMouse(e)) close(); }}
                  />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="profile__section" role="radiogroup" aria-labelledby={`${id}-font`}>
            <span className="profile__label" id={`${id}-font`}>Tipografía</span>
            <div className="seg">
              {FONTS.map((f) => (
                <label key={f.id} className="seg__opt" style={{ fontFamily: f.family }}>
                  <input
                    type="radio"
                    name={`${id}-font`}
                    value={f.id}
                    checked={font === f.id}
                    onChange={() => setFont(f.id)}
                    onClick={(e) => { if (byMouse(e)) close(); }}
                  />
                  <span>{f.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="profile__section">
            {!confirming ? (
              <button type="button" className="profile__row profile__row--link" onClick={() => setConfirming(true)}>
                Restablecer datos de ejemplo
              </button>
            ) : (
              <div className="profile__confirm" role="alertdialog" aria-label="Confirmar restablecer">
                <p>Se borrarán tus tareas y materias y volverán los datos de ejemplo. Tu nombre y tema se quedan.</p>
                <div className="profile__confirm-actions">
                  <button type="button" className="profile__btn" onClick={() => setConfirming(false)}>Cancelar</button>
                  <button type="button" className="profile__btn profile__btn--danger" onClick={() => { onResetData(); close(true); }}>
                    Restablecer
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="profile__section profile__section--last">
            <button type="button" className="profile__row profile__row--link" onClick={onSignOut}>Cerrar sesión</button>
          </div>
        </div>
      )}
    </div>
  );
}
