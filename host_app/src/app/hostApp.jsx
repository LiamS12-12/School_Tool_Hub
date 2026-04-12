import React, { useEffect, useMemo, useState } from 'react';
import { AppHeader } from '../core/shell/AppHeader';
import { AppSidebar } from '../core/shell/AppSidebar';
import { DashboardHome } from '../core/shell/DashboardHome';
import { moduleRegistry } from '../modules/moduleRegistry';
import {
  createSchoolContext,
  initialUsers,
  initialClassrooms,
  initialStudents,
} from '../shared/data/createSchoolContext';
import { AppShellPanel } from '../shared/ui/AppShellPanel';
import { getEnabledModules } from '../shared/permissions/schoolPermissions';
import { loadStoredValue, saveStoredValue } from '../shared/utils/localStorage';

const HOST_APP_STORAGE_KEY = 'school-tool-hub:host-app';

export default function HostApp() {
  const [persistedHostState, setPersistedHostState] = useState(() =>
    loadStoredValue(HOST_APP_STORAGE_KEY, {
      currentUserId: 'teacher-1',
      activeModuleId: null,
    })
  );

  const [users] = useState(initialUsers);
  const [classrooms] = useState(initialClassrooms);
  const [students, setStudents] = useState(initialStudents);

  const { currentUserId, activeModuleId } = persistedHostState;

  const schoolContext = useMemo(
    () =>
      createSchoolContext({
        currentUserId,
        users,
        classrooms,
        students,
      }),
    [currentUserId, users, classrooms, students]
  );

  const availableModules = useMemo(
    () => getEnabledModules(schoolContext.currentUser, moduleRegistry),
    [schoolContext.currentUser]
  );

  const setCurrentUserId = (nextUserId) => {
    setPersistedHostState((prev) => ({
      ...prev,
      currentUserId: nextUserId,
    }));
  };

  const setActiveModuleId = (nextModuleId) => {
    setPersistedHostState((prev) => ({
      ...prev,
      activeModuleId: nextModuleId,
    }));
  };

  const addStudentToClassroom = ({ firstName, lastName, classroomId }) => {
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    if (!cleanFirstName || !classroomId) return;

    setStudents((prev) => [
      ...prev,
      {
        id: `student-${Date.now()}`,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        classroomId,
      },
    ]);
  };

  useEffect(() => {
    saveStoredValue(HOST_APP_STORAGE_KEY, persistedHostState);
  }, [persistedHostState]);

  useEffect(() => {
    if (
      activeModuleId &&
      !availableModules.some((module) => module.id === activeModuleId)
    ) {
      setActiveModuleId(null);
    }
  }, [activeModuleId, availableModules]);

  const activeModule = useMemo(
    () => availableModules.find((module) => module.id === activeModuleId) || null,
    [activeModuleId, availableModules]
  );

  const ActiveScreen = activeModule?.screen || DashboardHome;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AppHeader
        school={schoolContext.school}
        currentUser={schoolContext.currentUser}
        users={users}
        onSwitchUser={setCurrentUserId}
      />

      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
        <AppSidebar
          modules={availableModules}
          activeModuleId={activeModuleId}
          onSelectModule={setActiveModuleId}
        />

        <main className="min-w-0 flex-1">
          <AppShellPanel>
            <ActiveScreen
              schoolContext={schoolContext}
              onAddStudent={addStudentToClassroom}
            />
          </AppShellPanel>
        </main>
      </div>
    </div>
  );
}