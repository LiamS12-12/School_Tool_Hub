import React, { useEffect, useMemo, useState } from 'react';
import { AppHeader } from '../core/shell/AppHeader';
import { AppSidebar } from '../core/shell/AppSidebar';
import { DashboardHome } from '../core/shell/DashboardHome';
import { moduleRegistry } from '../modules/moduleRegistry';
import { createSchoolContext } from '../shared/data/createSchoolContext';
import { AppShellPanel } from '../shared/ui/AppShellPanel';
import { tokens } from '../shared/design/tokens';
import { getEnabledModules } from '../shared/permissions/schoolPermissions';

export default function HostApp() {
  const [currentUserId, setCurrentUserId] = useState('teacher-1');
  const [activeModuleId, setActiveModuleId] = useState(null);
  const schoolContext = useMemo(() => createSchoolContext(currentUserId), [currentUserId]);
  const availableModules = useMemo(
    () => getEnabledModules(schoolContext.currentUser, moduleRegistry),
    [schoolContext.currentUser]
  );

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
