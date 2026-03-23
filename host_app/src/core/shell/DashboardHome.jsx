import React from 'react';

export function DashboardHome({ schoolContext }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Platform MVP</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">School host shell</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          This is the first platform shell for your single-school modular app system. It will eventually host
          classroom tools like Classroom Economy inside one shared experience.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Teachers</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{schoolContext.teachers.length}</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Classrooms</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{schoolContext.classrooms.length}</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Students</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{schoolContext.students.length}</p>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-bold text-slate-900">What this host owns</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Shared navigation and layout</li>
          <li>Shared school data context</li>
          <li>Module registration and app launching</li>
          <li>Role-aware access boundaries</li>
        </ul>
      </section>
    </div>
  );
}
