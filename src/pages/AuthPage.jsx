import { useState } from 'react';
import Button from '../components/Button.jsx';
import { supabase } from '../lib/supabase.js';
import './AuthPage.css';

const MESSAGES = {
  invalid_credentials: 'Correo o contraseña incorrectos.',
  user_already_exists: 'Ese correo ya tiene una cuenta. Inicia sesión.',
  email_exists: 'Ese correo ya tiene una cuenta. Inicia sesión.',
  weak_password: 'La contraseña debe tener al menos 6 caracteres.',
  email_not_confirmed: 'Confirma tu correo antes de entrar.',
  over_request_rate_limit: 'Demasiados intentos. Espera un momento.',
  over_email_send_rate_limit: 'Demasiados intentos. Espera un momento.',
};

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const signup = mode === 'signup';
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const switchMode = () => {
    setMode(signup ? 'login' : 'signup');
    setError('');
    setInfo('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setInfo('');
    const { email, password, nombre } = form;
    const { data, error: err } = signup
      ? await supabase.auth.signUp({ email, password, options: { data: { nombre } } })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) setError(MESSAGES[err.code] || 'No se pudo completar. Inténtalo de nuevo.');
    else if (signup && !data.session) setInfo('Te enviamos un correo para confirmar tu cuenta. Después inicia sesión.');
  };

  return (
    <main className="auth">
      <form className="auth__card" onSubmit={submit}>
        <div className="logo">
          <span className="logo__mark">C</span>
          <span className="logo__name">Campus Hub</span>
        </div>
        <div>
          <h1 className="auth__title">{signup ? 'Crea tu cuenta' : 'Inicia sesión'}</h1>
          <p className="auth__sub">{signup ? 'Tus tareas y materias se guardan en tu cuenta.' : 'Entra para ver tus tareas y materias.'}</p>
        </div>

        {signup && (
          <label className="field">
            <span className="field__label">Nombre</span>
            <input className="field__input" type="text" value={form.nombre} onChange={set('nombre')} maxLength={40} autoComplete="name" placeholder="Ej. María Yáñez" />
          </label>
        )}
        <label className="field">
          <span className="field__label">Correo</span>
          <input className="field__input" type="email" value={form.email} onChange={set('email')} required autoComplete="email" placeholder="tu@correo.com" />
        </label>
        <label className="field">
          <span className="field__label">Contraseña</span>
          <input
            className="field__input" type="password" value={form.password} onChange={set('password')}
            required minLength={6} autoComplete={signup ? 'new-password' : 'current-password'} placeholder="Mínimo 6 caracteres"
          />
        </label>

        {error && <p className="auth__msg auth__msg--error" role="alert">{error}</p>}
        {info && <p className="auth__msg auth__msg--info" role="status">{info}</p>}

        <Button type="submit" disabled={busy}>{busy ? 'Un momento…' : signup ? 'Crear cuenta' : 'Entrar'}</Button>

        <p className="auth__switch">
          {signup ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}{' '}
          <button type="button" className="auth__link" onClick={switchMode}>{signup ? 'Inicia sesión' : 'Crea una'}</button>
        </p>
      </form>
    </main>
  );
}
