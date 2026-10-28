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
import useHashRoute from './hooks/useHashRoute.js';
import './App.css';

export default function App() {
  const { tasks, addTask, cycleStatus, setTaskGrade, moveTask, removeTask, removeTasksByMateria, resetTasks } = useTasks();
  const { subjects, addSubject, removeSubject, resetSubjects } = useSubjects();
  const profile = useProfile();
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

  const resetData = () => { resetTasks(); resetSubjects(); };

  const names = subjects.map((s) => s.nombre);

  return (
    <>
      <Topbar route={route.path} profile={profile} onResetData={resetData} />
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
