import React from 'react';
import { Card } from '../../shared/ui/Card';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { tokens } from '../../shared/design/tokens';

export function DashboardHome({ schoolContext }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Platform MVP"
        title="School host shell"
        description="This is the first platform shell for your single-school modular app system. It will eventually host classroom tools like Classroom Economy inside one shared experience."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-50">
          <p className={`${tokens.typography.eyebrow} ${tokens.color.textSoft}`}>Users</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{schoolContext.users.length}</p>
        </Card>
        <Card className="bg-slate-50">
          <p className={`${tokens.typography.eyebrow} ${tokens.color.textSoft}`}>Classrooms</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{schoolContext.classrooms.length}</p>
        </Card>
        <Card className="bg-slate-50">
          <p className={`${tokens.typography.eyebrow} ${tokens.color.textSoft}`}>Visible Students</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{schoolContext.visibleStudents.length}</p>
        </Card>
      </section>

      <Card>
        <h3 className="text-lg font-bold text-slate-900">What this host owns</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Shared navigation and layout</li>
          <li>Shared school data context</li>
          <li>Module registration and app launching</li>
          <li>Role-aware access boundaries</li>
        </ul>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-slate-900">Current teacher scope</h3>
        <p className="mt-2 text-sm text-slate-600">
          The current signed-in user should only see classrooms and students within their allowed scope.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {schoolContext.visibleClassrooms.map((classroom) => (
            <div key={classroom.id} className={`rounded-xl border ${tokens.color.border} ${tokens.color.surfaceMuted} px-4 py-3`}>
              <p className="font-bold text-slate-900">{classroom.name}</p>
              <p className="text-sm text-slate-600">Grade {classroom.gradeLevel}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
