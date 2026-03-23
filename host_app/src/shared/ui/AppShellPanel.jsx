import React from 'react';
import { tokens } from '../design/tokens';

export function AppShellPanel({ children, className = '' }) {
  return (
    <div className={`${tokens.radius.panel} border ${tokens.color.border} ${tokens.color.surface} ${tokens.spacing.panel} ${tokens.shadow.panel} ${className}`.trim()}>
      {children}
    </div>
  );
}
