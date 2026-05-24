import React from 'react';
import Button from './UI/Button';

export default function EntityGrid({ title, description, items = [], renderItem, createProps }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: 12, flexWrap: 'wrap' }}>
        <div>
          {title && <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{title}</h1>}
          {description && <div style={{ color: 'var(--muted)', marginTop: 6 }}>{description}</div>}
        </div>
        {createProps ? (
          <div style={{ marginLeft: 'auto' }}>
            <Button {...createProps} />
          </div>
        ) : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {items.map((it, i) => (
          <div key={it.id || i}>
            {renderItem(it, i)}
          </div>
        ))}
      </div>
    </div>
  );
}
