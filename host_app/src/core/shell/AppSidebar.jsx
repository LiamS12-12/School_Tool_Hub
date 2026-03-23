import React from 'react';
import { tokens } from '../../shared/design/tokens';
import { Button } from '../../shared/ui/Button';
import { AppShellPanel } from '../../shared/ui/AppShellPanel';

export function AppSidebar({ modules, activeModuleId, onSelectModule }) {
  return (
    <AppShellPanel className="w-full max-w-xs p-4">
      <div className="mb-4">
        <h2 className={`${tokens.typography.eyebrow} ${tokens.color.textSoft}`}>Apps</h2>
        <p className={`mt-1 ${tokens.typography.body} ${tokens.color.textMuted}`}>This is the shared host navigation for school tools.</p>
      </div>
      <div className="space-y-2">
        <Button
          onClick={() => onSelectModule(null)}
          variant={activeModuleId === null ? 'primary' : 'secondary'}
          className="w-full text-left"
        >
          Home
        </Button>
        {modules.map((module) => (
          <Button
            key={module.id}
            onClick={() => onSelectModule(module.id)}
            variant={activeModuleId === module.id ? 'primary' : 'secondary'}
            className="w-full text-left"
          >
            <span className="block">{module.name}</span>
            <span className={`text-xs font-medium ${activeModuleId === module.id ? 'text-sky-100' : 'text-slate-500'}`}>
              {module.description}
            </span>
          </Button>
        ))}
      </div>
    </AppShellPanel>
  );
}
