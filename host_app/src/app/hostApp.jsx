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
      isDarkMode: false,
    })
  );

  const [users] = useState(initialUsers);
  const [classrooms] = useState(initialClassrooms);
  const [students, setStudents] = useState(initialStudents);

  const { currentUserId, activeModuleId, isDarkMode } = persistedHostState;

  const theme = isDarkMode
    ? {
        pageBg: '#020617',
        panelBg: '#0f172a',
        cardBg: '#111827',
        border: '#334155',
        text: '#f8fafc',
        mutedText: '#94a3b8',
        accentBg: '#082f49',
      }
    : {
        pageBg: '#f1f5f9',
        panelBg: '#ffffff',
        cardBg: '#ffffff',
        border: '#e2e8f0',
        text: '#0f172a',
        mutedText: '#64748b',
        accentBg: '#e0f2fe',
      };

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

  const toggleDarkMode = () => {
    setPersistedHostState((prev) => ({
      ...prev,
      isDarkMode: !prev.isDarkMode,
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
    <div
      style={{
        minHeight: '100vh',
        background: theme.pageBg,
        color: theme.text,
      }}
    >
      <AppHeader
        school={schoolContext.school}
        currentUser={schoolContext.currentUser}
        users={users}
        onSwitchUser={setCurrentUserId}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        theme={theme}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          gap: '24px',
          padding: '24px',
        }}
      >
        <AppSidebar
          modules={availableModules}
          activeModuleId={activeModuleId}
          onSelectModule={setActiveModuleId}
          isDarkMode={isDarkMode}
          theme={theme}
        />

        <main
          style={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <AppShellPanel>
            <ActiveScreen
              schoolContext={schoolContext}
              onAddStudent={addStudentToClassroom}
              isDarkMode={isDarkMode}
              theme={theme}
            />
          </AppShellPanel>
        </main>
      </div>
    </div>
  );
}