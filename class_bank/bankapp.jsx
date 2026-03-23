import React, { useState } from 'react';
import { initialDb } from './appData';
import { TeacherDashboard } from './teacherViews';
import { RoleSelector, StudentDashboard, StudentLogin, TeacherLogin } from './studentViews';

export default function App() {
  const [db, setDb] = useState(initialDb);
  const [currentView, setCurrentView] = useState('role_selector');
  const [currentStudentId, setCurrentStudentId] = useState(null);

  const navigate = (view, studentId = null) => {
    setCurrentView(view);
    setCurrentStudentId(studentId);
  };

  return (
    <div className="font-sans text-slate-800 antialiased selection:bg-sky-200">
      {currentView === 'role_selector' && <RoleSelector navigate={navigate} />}
      {currentView === 'teacher_login' && <TeacherLogin db={db} navigate={navigate} />}
      {currentView === 'teacher_dash' && <TeacherDashboard classId={db.classes[0]?.id} db={db} updateDb={setDb} navigate={navigate} />}
      {currentView === 'student_login' && <StudentLogin db={db} navigate={navigate} />}
      {currentView === 'student_dash' && <StudentDashboard studentId={currentStudentId} db={db} updateDb={setDb} navigate={navigate} />}
    </div>
  );
}
