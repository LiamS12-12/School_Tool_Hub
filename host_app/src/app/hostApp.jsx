import React, { useEffect, useMemo, useState } from 'react';
import { AppHeader } from '../core/shell/AppHeader';
import { AppSidebar } from '../core/shell/AppSidebar';
import { DashboardHome } from '../core/shell/DashboardHome';
import { moduleRegistry } from '../modules/moduleRegistry';
import { createSchoolContext } from '../shared/data/createSchoolContext';
import { AppShellPanel } from '../shared/ui/AppShellPanel';
import { tokens } from '../shared/design/tokens';
import { getEnabledModules } from '../shared/permissions/schoolPermissions';
import { loadStoredValue, saveStoredValue } from '../shared/utils/localStorage';

const HOST_APP_STORAGE_KEY = 'school-tool-hub:host-app';

export default function HostApp() {
  const [persistedHostState, setPersistedHostState] = useState(() =>
    loadStoredValue(HOST_APP_STORAGE_KEY, {
      currentUserId: 'teacher-1',
      activeModuleId: null
    })
  );
  const { currentUserId, activeModuleId } = persistedHostState;
  const schoolContext = useMemo(() => createSchoolContext(currentUserId), [currentUserId]);
  const availableModules = useMemo(
    () => getEnabledModules(schoolContext.currentUser, moduleRegistry),
    [schoolContext.currentUser]
  );

  const setCurrentUserId = (nextUserId) => {
    setPersistedHostState((prev) => ({
      ...prev,
      currentUserId: nextUserId
    }));
  };

  const setActiveModuleId = (nextModuleId) => {
    setPersistedHostState((prev) => ({
      ...prev,
      activeModuleId: nextModuleId
    }));
  };

  useEffect(() => {
    saveStoredValue(HOST_APP_STORAGE_KEY, persistedHostState);
  }, [persistedHostState]);

  useEffect(() => {
    if (activeModuleId && !availableModules.some((module) => module.id === activeModuleId)) {
      setActiveModuleId(null);
    }
  }, [activeModuleId, availableModules]);

  const activeModule = useMemo(
    () => availableModules.find((module) => module.id === activeModuleId) || null,
    [activeModuleId, availableModules]
  );

  const ActiveScreen = activeModule?.screen || DashboardHome;

  return (
    <div className={`min-h-screen ${tokens.color.background} ${tokens.color.text}`}>
      <AppHeader
        school={schoolContext.school}
        currentUser={schoolContext.currentUser}
        users={schoolContext.users}
        onSwitchUser={setCurrentUserId}
      />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
        <AppSidebar
          modules={availableModules}
          activeModuleId={activeModuleId}
          onSelectModule={setActiveModuleId}
        />
        <AppShellPanel className="min-h-[70vh] flex-1">
          <ActiveScreen schoolContext={schoolContext} />
        </AppShellPanel>
      </div>
    </div>
  );
}
