import React, { useMemo, useState } from 'react';

export default function Table({ columns = [], data = [], pageSize = 10, className = '', idKey = 'id' }) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(1);

  const sorted = useMemo(() => {
    if (!sortKey) return data.slice();
    const t = data.slice().sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sortDir;
      return String(av).localeCompare(String(bv)) * sortDir;
    });
    return t;
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(dir => -dir);
    else { setSortKey(key); setSortDir(1); }
    setPage(1);
  }

  return (
    <div className={`table-wrapper ${className}`} role="region" aria-label="data table">
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ textAlign: col.align || 'right', padding: '0.6rem 0.75rem', fontWeight: 700 }} scope="col">
                <div style={{ display: 'flex', justifyContent: col.align === 'left' ? 'flex-start' : 'flex-end', gap: 8, alignItems: 'center' }}>
                  {col.sortable ? (
                    <button className="btn-ghost" onClick={() => toggleSort(col.key)} aria-label={`ترتيب حسب ${col.label}`}>{col.label} {sortKey === col.key && <span aria-hidden>{sortDir === 1 ? '▲' : '▼'}</span>}</button>
                  ) : (
                    <span className="label">{col.label}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 && (
            <tr><td colSpan={columns.length} style={{ padding: '1.2rem', textAlign: 'center', color: 'var(--muted)' }}>لا توجد بيانات</td></tr>
          )}
          {pageData.map(row => (
            <tr key={row[idKey] || JSON.stringify(row)}>
              {columns.map(col => (
                <td key={col.key} style={{ padding: '0.7rem 0.75rem', borderTop: '1px solid var(--border)', textAlign: col.align || 'right' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
        <button className="btn-ghost" onClick={() => setPage(1)} disabled={page === 1} aria-label="first page">«</button>
        <button className="btn-ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="previous page">‹</button>
        <div style={{ alignSelf: 'center', color: 'var(--muted)' }}>{page} / {totalPages}</div>
        <button className="btn-ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="next page">›</button>
        <button className="btn-ghost" onClick={() => setPage(totalPages)} disabled={page === totalPages} aria-label="last page">»</button>
      </div>
    </div>
  );
}
