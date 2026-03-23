import React from 'react';
import { Card } from '../../shared/ui/Card';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { canManageClassroom } from '../../shared/permissions/schoolPermissions';

export function ClassroomEconomyModule({ schoolContext }) {
  const teacherClassrooms = schoolContext.visibleClassrooms;
  const teacherStudents = schoolContext.visibleStudents;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module"
        title="Classroom Economy"
        description="This is the first host-managed module boundary for the classroom economy app. The current class_bank prototype can now migrate into this space incrementally."
      />

      <Card className="bg-slate-50">
        <h3 className="text-lg font-bold text-slate-900">Module contract</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>The host provides current user, visible classrooms, and visible students.</li>
          <li>The module owns economy-specific workflows like balances, rewards, and transactions.</li>
          <li>The host remains responsible for layout, navigation, and teacher-scoped access.</li>
        </ul>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-bold text-slate-900">Visible classrooms</h3>
          <div className="mt-4 space-y-3">
            {teacherClassrooms.map((classroom) => (
              <div key={classroom.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{classroom.name}</p>
                    <p className="text-sm text-slate-600">Grade {classroom.gradeLevel}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${canManageClassroom(schoolContext.currentUser, classroom) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                    {canManageClassroom(schoolContext.currentUser, classroom) ? 'Manage' : 'View'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-slate-900">Visible students</h3>
          <div className="mt-4 space-y-3">
            {teacherStudents.map((student) => (
              <div key={student.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-bold text-slate-900">{student.displayName}</p>
                <p className="text-sm text-slate-600">Classroom ID: {student.classroomId}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-slate-900">Migration next step</h3>
        <p className="mt-2 text-sm text-slate-600">
          The next practical move is to port one part of the existing class_bank prototype into this module, starting with shared data consumption and a teacher-facing economy dashboard.
        </p>
      </Card>
    </div>
  );
}
