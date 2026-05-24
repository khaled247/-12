import React, { useRef, useEffect, useCallback } from 'react';

function getFocusable(el) {
  if (!el) return [];
  return Array.from(el.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
    .filter(n => !n.hasAttribute('disabled') && n.getAttribute('aria-hidden') !== 'true');
}

export default function ModalWrapper({ children, onClose = () => {}, ariaLabel = 'Dialog', className = '' }) {
  const containerRef = useRef(null);
  const prevFocusRef = useRef(null);

  useEffect(() => {
    prevFocusRef.current = document.activeElement;
    const focusable = getFocusable(containerRef.current);
    if (focusable.length) focusable[0].focus();
    else if (containerRef.current) containerRef.current.focus();

    function handleKey(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const nodes = getFocusable(containerRef.current);
        if (nodes.length === 0) {
          e.preventDefault();
          return;
        }
        const idx = nodes.indexOf(document.activeElement);
        if (e.shiftKey) {
          if (idx === 0 || document.activeElement === containerRef.current) {
            e.preventDefault();
            nodes[nodes.length - 1].focus();
          }
        } else {
          if (idx === nodes.length - 1) {
            e.preventDefault();
            nodes[0].focus();
          }
        }
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      try { prevFocusRef.current?.focus?.(); } catch (e) {}
    };
  }, [onClose]);

  const onBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onBackdropClick} style={{ zIndex: 1200 }}>
      <div ref={containerRef} role="dialog" aria-modal="true" aria-label={ariaLabel} tabIndex={-1} className={`modal ${className}`}>
        {children}
      </div>
    </div>
  );
}
