import { useState } from 'react';
import Topbar from './components/Topbar.jsx';
import AddTaskDialog from './components/AddTaskDialog.jsx';
import AddSubjectDialog from './components/AddSubjectDialog.jsx';
import HomePage from './pages/HomePage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import MateriasPage from './pages/MateriasPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import GradesPage from './pages/GradesPage.jsx';
import useTasks from './hooks/useTasks.js';
import useSubjects from './hooks/useSubjects.js';
import useProfile from './hooks/useProfile.js';
import AuthPage from './pages/AuthPage.jsx';
import useAuth from './hooks/useAuth.js';
import useHashRoute from './hooks/useHashRoute.js';
import { supabase } from './lib/supabase.js';
import { photoPath } from './utils/avatar.js';
import './App.css';

// Sin sesión solo se ve el login; con sesión, la app (una instancia por usuario)
export default function App() {
  const session = useAuth();
  if (session === undefined) return null; // revisando la sesión
  if (!session) return <AuthPage />;
  return <Dashboard key={session.user.id} userId={session.user.id} email={session.user.email} />;
}

function Dashboard({ userId, email }) {
  const tasksStore = useTasks();
  const { tasks, addTask, cycleStatus, setTaskGrade, moveTask, removeTask, removeTasksByMateria } = tasksStore;
  const subjectsStore = useSubjects();
  const { subjects, addSubject, removeSubject } = subjectsStore;
  const profile = useProfile(userId);
  const route = useHashRoute();
  const [dialog, setDialog] = useState(null); // 'task' | 'subject' | null
  const [taskDate, setTaskDate] = useState(''); // fecha sugerida al agregar una tarea (YYYY-MM-DD)

  const closeDialog = () => setDialog(null);
  const openTask = (date = '') => {
    setTaskDate(typeof date === 'string' ? date : '');
    setDialog('task');
  };

  // Al eliminar una materia también se eliminan sus tareas
  const deleteSubject = (subject) => {
    removeTasksByMateria(subject.nombre);
    removeSubject(subject.id);
  };

  const resetData = async () => {
    await supabase.rpc('restablecer_datos');
    await Promise.all([tasksStore.reload(), subjectsStore.reload()]);
  };
  const signOut = () => supabase.auth.signOut();
  const deleteAccount = async () => {
    await supabase.storage.from('avatars').remove([photoPath(userId)]); // la foto no se borra sola con la cuenta
    const { error } = await supabase.rpc('eliminar_cuenta');
    if (error) return error;
    await supabase.auth.signOut({ scope: 'local' }); // la cuenta ya no existe: solo limpia la sesión de este navegador
    return null;
  };

  const names = subjects.map((s) => s.nombre);

  if (tasksStore.loading || subjectsStore.loading || !profile.ready) {
    return <main className="page"><p className="welcome__sub">Cargando tus datos…</p></main>;
  }

  return (
    <>
      <Topbar route={route.path} profile={profile} email={email} onResetData={resetData} onSignOut={signOut} onDeleteAccount={deleteAccount} />
      {route.path === '/tareas' && (
        <TasksPage tasks={tasks} materia={route.materia} onAdd={openTask} onCycle={cycleStatus} onGrade={setTaskGrade} onReschedule={moveTask} onDelete={removeTask} />
      )}
      {route.path === '/materias' && (
        <MateriasPage
          subjects={subjects}
          tasks={tasks}
          onAdd={() => setDialog('subject')}
          onDelete={deleteSubject}
        />
      )}
      {route.path === '/calendario' && (
        <CalendarPage tasks={tasks} onAdd={openTask} onCycle={cycleStatus} onMove={moveTask} />
      )}
      {route.path === '/calificaciones' && <GradesPage subjects={subjects} tasks={tasks} onGrade={setTaskGrade} />}
      {route.path === '/' && <HomePage name={profile.first} tasks={tasks} subjects={subjects} onAdd={openTask} onCycle={cycleStatus} />}

      <AddTaskDialog
        open={dialog === 'task'}
        subjects={names}
        defaultDate={taskDate}
        onClose={closeDialog}
        onSubmit={(data) => { addTask(data); closeDialog(); }}
      />
      <AddSubjectDialog
        open={dialog === 'subject'}
        existing={names}
        onClose={closeDialog}
        onSubmit={(data) => { addSubject(data); closeDialog(); }}
      />
    </>
  );
}
