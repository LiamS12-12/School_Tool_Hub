import React from 'react';
import { tokens } from '../design/tokens';

export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div>
      {eyebrow && <p className={`${tokens.typography.eyebrow} ${tokens.color.primary}`}>{eyebrow}</p>}
      <h2 className={`mt-2 ${tokens.typography.pageTitle} ${tokens.color.text}`}>{title}</h2>
      {description && <p className={`mt-2 max-w-2xl ${tokens.typography.body} ${tokens.color.textMuted}`}>{description}</p>}
    </div>
  );
}
