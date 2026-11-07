import { useEffect, useId, useRef, useState } from 'react';
import { THEMES, MODES, FONTS, STYLES } from '../utils/profile.js';
import Icon from './Icon.jsx';
import AccountPanel from './AccountPanel.jsx';
import Avatar from './Avatar.jsx';
import './ProfileMenu.css';

const TABS = [
  { id: 'cuenta', label: 'Cuenta' },
  { id: 'personalizacion', label: 'Personalización' },
];

// Perfil: ventana centrada con el fondo desenfocado. Los cambios se aplican al instante
// y la ventana se queda abierta hasta cerrarla con la X (o con Escape).
export default function ProfileMenu({ profile, email, onResetData, onSignOut, onDeleteAccount }) {
  const { name, initials, photo, theme, mode, font, style, setTheme, setMode, setFont, setStyle } = profile;
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('cuenta'); // 'cuenta' | 'personalizacion'
  const [session, setSession] = useState(0); // al reabrir, la pestaña Cuenta empieza limpia
  const dialog = useRef(null);
  const id = useId();

  useEffect(() => {
    const d = dialog.current;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  const openDialog = () => {
    setTab('cuenta');
    setSession((n) => n + 1);
    setOpen(true);
  };

  return (
    <div className="profile">
      <button type="button" className="avatar" aria-label={`Perfil de ${name}`} aria-haspopup="dialog" onClick={openDialog}>
        <Avatar photo={photo} initials={initials} />
      </button>

      <dialog className="profile-dialog" ref={dialog} onClose={() => setOpen(false)} aria-labelledby={`${id}-title`}>
        <div className="profile-dialog__head">
          <h2 id={`${id}-title`}>Perfil</h2>
          <button type="button" className="profile-dialog__close" aria-label="Cerrar" onClick={() => setOpen(false)}>
            <Icon name="x" />
          </button>
        </div>

        <div className="profile-body">
          <div className="profile-tabs" role="tablist" aria-label="Secciones del perfil" aria-orientation="vertical">
            {TABS.map((t) => (
              <button
                key={t.id} type="button" role="tab" id={`${id}-tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`${id}-panel-${t.id}`}
                className={'profile-tabs__tab' + (tab === t.id ? ' profile-tabs__tab--active' : '')} onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="profile-panels">
          <div role="tabpanel" id={`${id}-panel-personalizacion`} aria-labelledby={`${id}-tab-personalizacion`} hidden={tab !== 'personalizacion'}>
            <div className="profile__section" role="radiogroup" aria-labelledby={`${id}-theme`}>
              <span className="profile__label" id={`${id}-theme`}>
                Tema de color · <span className="profile__current">{THEMES.find((t) => t.id === theme)?.label}</span>
              </span>
              <div className="profile__themes">
                {THEMES.map((t) => (
                  <label key={t.id} className="swatch" title={t.label}>
                    <input type="radio" name={`${id}-theme`} value={t.id} checked={theme === t.id} onChange={() => setTheme(t.id)} aria-label={t.label} />
                    <span className="swatch__dot" style={{ background: t.swatch }}>
                      {theme === t.id && <Icon name="check" size={16} />}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Segmented id={`${id}-mode`} label="Apariencia" options={MODES} value={mode} onChange={setMode} />
            <Segmented id={`${id}-style`} label="Estilo" options={STYLES} value={style} onChange={setStyle} />
            <Segmented id={`${id}-font`} label="Tipografía" options={FONTS} value={font} onChange={setFont} fonts last />
          </div>

          <div role="tabpanel" id={`${id}-panel-cuenta`} aria-labelledby={`${id}-tab-cuenta`} hidden={tab !== 'cuenta'}>
            <AccountPanel key={session} profile={profile} email={email} onResetData={onResetData} onSignOut={onSignOut} onDeleteAccount={onDeleteAccount} />
          </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

function Segmented({ id, label, options, value, onChange, fonts = false, last = false }) {
  return (
    <div className={'profile__section' + (last ? ' profile__section--last' : '')} role="radiogroup" aria-labelledby={id}>
      <span className="profile__label" id={id}>{label}</span>
      <div className="seg">
        {options.map((o) => (
          <label key={o.id} className="seg__opt" style={fonts ? { fontFamily: o.family } : undefined}>
            <input type="radio" name={id} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
