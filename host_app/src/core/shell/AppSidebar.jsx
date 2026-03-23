import React from 'react';

export function AppSidebar({ modules, activeModuleId, onSelectModule }) {
  return (
    <aside className="w-full max-w-xs rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Apps</h2>
        <p className="mt-1 text-sm text-slate-600">This is the shared host navigation for school tools.</p>
      </div>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => onSelectModule(null)}
          className={`w-full rounded-2xl px-4 py-3 text-left font-bold transition-colors ${
            activeModuleId === null
              ? 'bg-sky-500 text-white'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Home
        </button>
        {modules.map((module) => (
          <button
            key={module.id}
            type="button"
            onClick={() => onSelectModule(module.id)}
            className={`w-full rounded-2xl px-4 py-3 text-left font-bold transition-colors ${
              activeModuleId === module.id
                ? 'bg-sky-500 text-white'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="block">{module.name}</span>
            <span className={`text-xs font-medium ${activeModuleId === module.id ? 'text-sky-100' : 'text-slate-500'}`}>
              {module.description}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
