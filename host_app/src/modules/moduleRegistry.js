import React from 'react';

function ClassroomEconomyPlaceholder({ schoolContext }) {
  const teacherClassrooms = schoolContext.visibleClassrooms;
  const teacherStudents = schoolContext.visibleStudents;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Module Placeholder</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Classroom Economy</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          This is the first planned host module. The current `class_bank` prototype will eventually move behind this module boundary.
        </p>
      </div>

      <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-900">Teacher-scoped view</h3>
        <p className="mt-2 text-sm text-slate-600">
          For MVP, the host should show only classrooms owned by the signed-in teacher unless they have admin access.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {teacherClassrooms.map((classroom) => (
            <li key={classroom.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              {classroom.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-900">Visible students</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {teacherStudents.map((student) => (
            <li key={student.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              {student.displayName}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export const moduleRegistry = [
  {
    id: 'classroom-economy',
    name: 'Classroom Economy',
    description: 'Banking, jobs, goals, and rewards',
    screen: ClassroomEconomyPlaceholder
  }
];
