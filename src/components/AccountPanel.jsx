import { useId, useRef, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { MAX_NAME } from '../utils/profile.js';
import { MAX_PHOTO_MB } from '../utils/avatar.js';
import Avatar from './Avatar.jsx';

const CONFIRM_WORD = 'ELIMINAR';

const MESSAGES = {
  email_exists: 'Ese correo ya está en uso.',
  email_address_invalid: 'Ese correo no es válido.',
  same_password: 'Esa ya es tu contraseña actual.',
  weak_password: 'La contraseña debe tener al menos 6 caracteres.',
  reauthentication_needed: 'Por seguridad, cierra sesión y vuelve a entrar para hacer este cambio.',
  over_email_send_rate_limit: 'Demasiados intentos. Espera un momento.',
  over_request_rate_limit: 'Demasiados intentos. Espera un momento.',
};
const messageFor = (err) => MESSAGES[err.code] || 'No se pudo completar. Inténtalo de nuevo.';

// Pestaña "Cuenta": nombre, correo, contraseña, datos de ejemplo, cerrar sesión y eliminar cuenta
export default function AccountPanel({ profile, email, onResetData, onSignOut, onDeleteAccount }) {
  const id = useId();
  const { name, setName, photo, initials, setPhoto, removePhoto } = profile;
  const fileInput = useRef(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const pickPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (!file) return;
    setPhotoError('');
    setPhotoBusy(true);
    const err = await setPhoto(file);
    setPhotoBusy(false);
    if (err) setPhotoError(err.message === 'tipo' ? 'Usa una imagen JPG, PNG o WebP.' : err.message === 'tamano' ? `La foto pesa más de ${MAX_PHOTO_MB} MB.` : 'No se pudo subir la foto. Inténtalo de nuevo.');
  };
  const dropPhoto = async () => {
    setPhotoError('');
    setPhotoBusy(true);
    const err = await removePhoto();
    setPhotoBusy(false);
    if (err) setPhotoError('No se pudo quitar la foto. Inténtalo de nuevo.');
  };

  const [draft, setDraft] = useState(name);
  const commitName = () => {
    if (draft.trim()) setName(draft);
    else setDraft(name); // vacío: vuelve al nombre anterior
  };

  const [newEmail, setNewEmail] = useState('');
  const [emailMsg, setEmailMsg] = useState(null); // { ok, text }
  const [emailBusy, setEmailBusy] = useState(false);
  const changeEmail = async (e) => {
    e.preventDefault();
    setEmailBusy(true);
    setEmailMsg(null);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setEmailBusy(false);
    if (error) setEmailMsg({ ok: false, text: messageFor(error) });
    else {
      setNewEmail('');
      setEmailMsg({ ok: true, text: 'Te enviamos un correo para confirmar el cambio. Tu correo actual sigue activo hasta entonces.' });
    }
  };

  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [passMsg, setPassMsg] = useState(null);
  const [passBusy, setPassBusy] = useState(false);
  const changePassword = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    if (pass.length < 6) return setPassMsg({ ok: false, text: MESSAGES.weak_password });
    if (pass !== pass2) return setPassMsg({ ok: false, text: 'Las contraseñas no coinciden.' });
    setPassBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pass });
    setPassBusy(false);
    if (error) setPassMsg({ ok: false, text: messageFor(error) });
    else {
      setPass('');
      setPass2('');
      setPassMsg({ ok: true, text: 'Contraseña actualizada.' });
    }
  };

  const [confirming, setConfirming] = useState(null); // 'reset' | 'delete' | null
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const deleteAccount = async () => {
    setBusy(true);
    setError('');
    const err = await onDeleteAccount();
    if (err) {
      setBusy(false);
      setError('No se pudo eliminar la cuenta. Inténtalo de nuevo.');
    }
    // si salió bien, la sesión se cierra y la app vuelve al login
  };

  return (
    <>
      <div className="profile__section profile__photo">
        <Avatar photo={photo} initials={initials} className="profile__photo-img" />
        <div className="profile__photo-body">
          <span className="profile__label">Foto de perfil</span>
          <div className="profile__photo-actions">
            <button type="button" className="profile__btn" disabled={photoBusy} onClick={() => fileInput.current?.click()}>
              {photoBusy ? 'Guardando…' : photo ? 'Cambiar foto' : 'Subir foto'}
            </button>
            {photo && !photoBusy && <button type="button" className="profile__btn" onClick={dropPhoto}>Quitar</button>}
          </div>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={pickPhoto} aria-label="Elegir foto de perfil" />
          {photoError && <p className="profile__error" role="alert">{photoError}</p>}
        </div>
      </div>

      <form className="profile__section" onSubmit={(e) => { e.preventDefault(); commitName(); }}>
        <label className="profile__label" htmlFor={`${id}-name`}>Nombre</label>
        <input id={`${id}-name`} className="profile__input" value={draft} maxLength={MAX_NAME} autoComplete="off" onChange={(e) => setDraft(e.target.value)} onBlur={commitName} />
      </form>

      <form className="profile__section" onSubmit={changeEmail}>
        <label className="profile__label" htmlFor={`${id}-email`}>Correo</label>
        <p className="profile__hint">Actual: {email}</p>
        <input id={`${id}-email`} className="profile__input" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Nuevo correo" autoComplete="email" required />
        {emailMsg && <p className={emailMsg.ok ? 'profile__ok' : 'profile__error'} role={emailMsg.ok ? 'status' : 'alert'}>{emailMsg.text}</p>}
        <div className="profile__confirm-actions">
          <button type="submit" className="profile__btn" disabled={emailBusy || !newEmail.trim() || newEmail.trim() === email}>{emailBusy ? 'Enviando…' : 'Cambiar correo'}</button>
        </div>
      </form>

      <form className="profile__section" onSubmit={changePassword}>
        <label className="profile__label" htmlFor={`${id}-pass`}>Contraseña nueva</label>
        <input id={`${id}-pass`} className="profile__input" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
        <input className="profile__input" type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} placeholder="Repite la contraseña" autoComplete="new-password" aria-label="Repite la contraseña" />
        {passMsg && <p className={passMsg.ok ? 'profile__ok' : 'profile__error'} role={passMsg.ok ? 'status' : 'alert'}>{passMsg.text}</p>}
        <div className="profile__confirm-actions">
          <button type="submit" className="profile__btn" disabled={passBusy || !pass}>{passBusy ? 'Guardando…' : 'Cambiar contraseña'}</button>
        </div>
      </form>

      <div className="profile__section">
        {confirming !== 'reset' ? (
          <button type="button" className="profile__row profile__row--link" onClick={() => setConfirming('reset')}>Restablecer datos de ejemplo</button>
        ) : (
          <div className="profile__confirm" role="alertdialog" aria-label="Confirmar restablecer">
            <p>Se borrarán tus tareas y materias y volverán los datos de ejemplo. Tu nombre y tema se quedan.</p>
            <div className="profile__confirm-actions">
              <button type="button" className="profile__btn" onClick={() => setConfirming(null)}>Cancelar</button>
              <button type="button" className="profile__btn profile__btn--danger" onClick={() => { onResetData(); setConfirming(null); }}>Restablecer</button>
            </div>
          </div>
        )}
      </div>

      <div className="profile__section">
        <button type="button" className="profile__row profile__row--link" onClick={onSignOut}>Cerrar sesión</button>
      </div>

      <div className="profile__section profile__section--last">
        {confirming !== 'delete' ? (
          <button type="button" className="profile__row profile__row--danger" onClick={() => { setConfirming('delete'); setTyped(''); setError(''); }}>Eliminar cuenta</button>
        ) : (
          <div className="profile__confirm" role="alertdialog" aria-label="Confirmar eliminar cuenta">
            <p>Se eliminarán tu cuenta y todos tus datos (tareas, materias y perfil) para siempre. No se puede deshacer.</p>
            <label className="profile__label" htmlFor={`${id}-del`}>Escribe {CONFIRM_WORD} para confirmar</label>
            <input id={`${id}-del`} className="profile__input" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
            {error && <p className="profile__error" role="alert">{error}</p>}
            <div className="profile__confirm-actions">
              <button type="button" className="profile__btn" onClick={() => setConfirming(null)} disabled={busy}>Cancelar</button>
              <button type="button" className="profile__btn profile__btn--danger" disabled={busy || typed.trim().toUpperCase() !== CONFIRM_WORD} onClick={deleteAccount}>
                {busy ? 'Eliminando…' : 'Eliminar cuenta'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
