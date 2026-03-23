import React, { useMemo, useState } from 'react';
import { Card } from '../../shared/ui/Card';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { canManageClassroom } from '../../shared/permissions/schoolPermissions';
import { Button } from '../../shared/ui/Button';
import { classroomEconomyData } from './economyData';

export function ClassroomEconomyModule({ schoolContext }) {
  const teacherClassrooms = schoolContext.visibleClassrooms;
  const [selectedClassroomId, setSelectedClassroomId] = useState(teacherClassrooms[0]?.id || null);

  const selectedClassroom = useMemo(
    () => teacherClassrooms.find((classroom) => classroom.id === selectedClassroomId) || teacherClassrooms[0] || null,
    [selectedClassroomId, teacherClassrooms]
  );

  const classroomStudents = useMemo(
    () => schoolContext.visibleStudents.filter((student) => student.classroomId === selectedClassroom?.id),
    [schoolContext.visibleStudents, selectedClassroom]
  );

  const classroomGoal = selectedClassroom ? classroomEconomyData.classroomGoals[selectedClassroom.id] : null;
  const storeItems = selectedClassroom ? classroomEconomyData.storeItems[selectedClassroom.id] || [] : [];

  const studentSummaries = classroomStudents.map((student) => {
    const account = classroomEconomyData.accounts[student.id] || {
      balance: 0,
      jobTitle: 'Unassigned',
      weeklySalary: 0,
      savingsGoal: null
    };

    return {
      ...student,
      ...account
    };
  });

  const totalClassBalance = studentSummaries.reduce((sum, student) => sum + student.balance, 0);
  const totalWeeklyPayroll = studentSummaries.reduce((sum, student) => sum + student.weeklySalary, 0);
  const goalProgress = classroomGoal
    ? Math.min(100, Math.round((totalClassBalance / classroomGoal.targetAmount) * 100))
    : 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module"
        title="Classroom Economy"
        description="This is the first host-managed Classroom Economy MVP. It uses host-scoped classrooms and students while keeping economy-specific balances, rewards, and goals inside the module."
      />

      {teacherClassrooms.length > 1 && (
        <Card className="bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Choose classroom</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {teacherClassrooms.map((classroom) => (
              <Button
                key={classroom.id}
                onClick={() => setSelectedClassroomId(classroom.id)}
                variant={selectedClassroom?.id === classroom.id ? 'primary' : 'secondary'}
              >
                {classroom.name}
              </Button>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-50">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Students</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{studentSummaries.length}</p>
        </Card>
        <Card className="bg-slate-50">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Class Balance</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">${totalClassBalance}</p>
        </Card>
        <Card className="bg-slate-50">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Weekly Payroll</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">${totalWeeklyPayroll}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-bold text-slate-900">Current classroom</h3>
          {selectedClassroom ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{selectedClassroom.name}</p>
                  <p className="text-sm text-slate-600">Grade {selectedClassroom.gradeLevel}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${canManageClassroom(schoolContext.currentUser, selectedClassroom) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                  {canManageClassroom(schoolContext.currentUser, selectedClassroom) ? 'Manage' : 'View'}
                </span>
              </div>
              {classroomGoal && (
                <div className="mt-4">
                  <p className="text-sm font-bold text-slate-900">{classroomGoal.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    ${totalClassBalance} of ${classroomGoal.targetAmount} saved
                  </p>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-sky-500" style={{ width: `${goalProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">No classroom is currently available for this user.</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-slate-900">Class store</h3>
          <div className="mt-4 space-y-3">
            {storeItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    ${item.cost}
                  </span>
                </div>
              </div>
            ))}
            {storeItems.length === 0 && (
              <p className="text-sm text-slate-600">No store items have been added for this classroom yet.</p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-slate-900">Student accounts</h3>
        <div className="mt-4 space-y-3">
          {studentSummaries.map((student) => (
            <div key={student.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-slate-900">{student.displayName}</p>
                  <p className="text-sm text-slate-600">{student.jobTitle} - ${student.weeklySalary}/week</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-lg font-extrabold text-slate-900">${student.balance}</p>
                  <p className="text-sm text-slate-600">
                    Goal: {student.savingsGoal ? `${student.savingsGoal.name} ($${student.savingsGoal.targetAmount})` : 'No goal set'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {studentSummaries.length === 0 && (
            <p className="text-sm text-slate-600">No visible students are available in this classroom.</p>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-slate-900">Module contract</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>The host provides current user, visible classrooms, and visible students.</li>
          <li>The module owns economy-specific workflows like balances, rewards, and transactions.</li>
          <li>The host remains responsible for layout, navigation, and teacher-scoped access.</li>
        </ul>
      </Card>
    </div>
  );
}
