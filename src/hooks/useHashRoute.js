import { useEffect, useState } from 'react';

const PAGES = ['/tareas', '/materias', '/calendario', '/calificaciones'];

// Lee #/tareas, #/materias, #/calendario, #/calificaciones o #/tareas?materia=Nombre. Cualquier otra cosa es el inicio.
function read() {
  const [path, query = ''] = window.location.hash.slice(1).split('?');
  return {
    path: PAGES.includes(path) ? path : '/',
    materia: new URLSearchParams(query).get('materia'),
  };
}

// Rutas con hash: no necesita librería ni configurar el servidor
export default function useHashRoute() {
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => {
      setRoute(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
