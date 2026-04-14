import React from 'react';

export function AppShellPanel({ children, className = '', theme }) {
  return (
    <div
      className={className}
      style={{
        borderRadius: '24px',
        border: `1px solid ${theme.border}`,
        background: theme.panelBg,
        padding: '24px',
        boxShadow:
          theme.panelBg === '#ffffff'
            ? '0 10px 30px rgba(15, 23, 42, 0.06)'
            : '0 10px 30px rgba(0, 0, 0, 0.28)',
      }}
    >
      {children}
    </div>
  );
}