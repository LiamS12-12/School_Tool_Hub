import React from 'react';
import { tokens } from '../design/tokens';

export function Card({ children, className = '' }) {
  return (
    <section className={`${tokens.radius.card} border ${tokens.color.border} ${tokens.color.surface} ${tokens.spacing.card} ${tokens.shadow.card} ${className}`.trim()}>
      {children}
    </section>
  );
}
