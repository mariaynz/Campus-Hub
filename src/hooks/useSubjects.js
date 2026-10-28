import { useEffect, useState } from 'react';
import { initialSubjects } from '../data/mock.js';

const KEY = 'campus-hub:subjects:v1';

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : initialSubjects;
  } catch {
    return initialSubjects;
  }
}

export default function useSubjects() {
  const [subjects, setSubjects] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(subjects));
    } catch {
      /* sin almacenamiento: la app sigue funcionando, solo no guarda */
    }
  }, [subjects]);

  const addSubject = ({ nombre }) =>
    setSubjects((prev) => [...prev, { id: Math.max(0, ...prev.map((s) => s.id)) + 1, nombre }]);

  const removeSubject = (id) => setSubjects((prev) => prev.filter((s) => s.id !== id));

  const resetSubjects = () => setSubjects(initialSubjects);

  return { subjects, addSubject, removeSubject, resetSubjects };
}
