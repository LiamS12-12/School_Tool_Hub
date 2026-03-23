import React from 'react';

export function AppHeader({ school, currentUser }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">School Tool Hub</p>
          <h1 className="text-xl font-extrabold text-slate-900">{school.name}</h1>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{currentUser.role}</p>
        </div>
      </div>
    </header>
  );
}
