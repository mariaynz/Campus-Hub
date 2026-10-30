import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

export default function useSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const { data, error } = await supabase.from('materias').select('id, nombre').order('id');
    if (!error) setSubjects(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addSubject = async ({ nombre }) => {
    const { data, error } = await supabase.from('materias').insert({ nombre }).select('id, nombre').single();
    if (error) return reload();
    setSubjects((prev) => [...prev, data]);
  };

  const removeSubject = async (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    const { error } = await supabase.from('materias').delete().eq('id', id);
    if (error) reload();
  };

  return { subjects, loading, reload, addSubject, removeSubject };
}
