import React from 'react';

function Sparkline({ values = [], color = 'var(--gold)' }) {
  if (!values || values.length === 0) return null;
  const w = 80; const h = 28; const max = Math.max(...values); const min = Math.min(...values);
  const points = values.map((v, i) => {
    const x = (i / Math.max(1, values.length - 1)) * w;
    const y = h - ((v - min) / Math.max(1, max - min)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardKPI({ title, value, delta, spark = [] }) {
  return (
    <div className="stat-card" role="group" aria-label={title}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.86rem', color: 'var(--muted)', fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: 6 }}>{value}</div>
        {typeof delta !== 'undefined' && <div style={{ marginTop: 6, color: delta >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>{delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%</div>}
      </div>
      <div style={{ width: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Sparkline values={spark} />
      </div>
    </div>
  );
}
