import React, { useRef, useEffect } from 'react';

export default function ConfirmDialog({ open, title = 'تأكيد', message, onConfirm, onCancel }) {
  const confirmRef = useRef(null);
  useEffect(() => {
    if (open && confirmRef.current) confirmRef.current.focus();
    return () => {};
  }, [open]);
  if (!open) return null;
  return (
    <div className="confirm-backdrop" role="dialog" aria-modal="true">
      <div className="confirm-box glass" style={{ maxWidth: 420, margin: '6rem auto', padding: '1rem' }}>
        <h3 style={{ marginBottom: 8 }}>{title}</h3>
        <p style={{ color: 'var(--muted)', marginBottom: 12 }}>{message}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onCancel}>إلغاء</button>
          <button ref={confirmRef} className="btn-gold" onClick={onConfirm}>تأكيد</button>
        </div>
      </div>
    </div>
  );
}
