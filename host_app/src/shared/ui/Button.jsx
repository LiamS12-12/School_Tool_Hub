import React from 'react';
import { tokens } from '../design/tokens';

export function Button({ children, type = 'button', variant = 'secondary', className = '', ...props }) {
  const variants = {
    primary: `${tokens.color.primarySurface} ${tokens.color.primarySurfaceHover} ${tokens.color.primaryTextOnSolid}`,
    secondary: `${tokens.color.surfaceMuted} text-slate-700 hover:bg-slate-100`
  };

  return (
    <button
      type={type}
      className={`${tokens.radius.control} ${tokens.spacing.control} font-bold transition-colors ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
