import React from 'react';
import { tokens } from '../../shared/design/tokens';

export function AppHeader({ school, currentUser, users, onSwitchUser }) {
  return (
    <header className={`border-b ${tokens.color.border} ${tokens.color.surface}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div>
          <p className={`${tokens.typography.eyebrow} ${tokens.color.primary}`}>School Tool Hub</p>
          <h1 className="text-xl font-extrabold text-slate-900">{school.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
            <p className={`text-xs font-medium uppercase tracking-wide ${tokens.color.textSoft}`}>{currentUser.role}</p>
          </div>
          <select
            value={currentUser.id}
            onChange={(event) => onSwitchUser(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-sky-500"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
