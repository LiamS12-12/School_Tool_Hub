import React, { useMemo, useState } from 'react';
import { AppHeader } from '../core/shell/AppHeader';
import { AppSidebar } from '../core/shell/AppSidebar';
import { DashboardHome } from '../core/shell/DashboardHome';
import { moduleRegistry } from '../modules/moduleRegistry';
import { schoolContext } from '../shared/data/mockSchoolContext';

export default function HostApp() {
  const [activeModuleId, setActiveModuleId] = useState(null);

  const activeModule = useMemo(
    () => moduleRegistry.find((module) => module.id === activeModuleId) || null,
    [activeModuleId]
  );

  const ActiveScreen = activeModule?.screen || DashboardHome;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AppHeader school={schoolContext.school} currentUser={schoolContext.currentUser} />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
        <AppSidebar
          modules={moduleRegistry}
          activeModuleId={activeModuleId}
          onSelectModule={setActiveModuleId}
        />
        <main className="min-h-[70vh] flex-1 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <ActiveScreen schoolContext={schoolContext} />
        </main>
      </div>
    </div>
  );
}
