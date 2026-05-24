import React from 'react';
import Button from './Button';
import IconButton from './IconButton';

export default function RowActions({ actions = [], className = '' }) {
  return (
    <div className={`row-actions ${className}`} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {actions.map((a, i) => {
        if (a.type === 'icon') return (
          <IconButton key={a.key || i} title={a.title} onClick={a.onClick} disabled={a.disabled}>{a.icon ?? a.label}</IconButton>
        );
        return (
          <Button key={a.key || i} variant={a.variant || 'ghost'} size={a.size || 'md'} onClick={a.onClick} disabled={a.disabled}>{a.icon ? <span style={{ marginInlineStart: 6 }}>{a.icon}</span> : null}{a.label}</Button>
        );
      })}
    </div>
  );
}
