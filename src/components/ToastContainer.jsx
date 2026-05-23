import React from 'react';
import { useApp } from '../context/AppContext';
import './ToastContainer.css';

export default function ToastContainer(){
  const { toasts } = useApp();
  return (
    <div className="rc-toasts-root" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className="rc-toast">
          <div className="rc-toast-title">{t.title}</div>
          <div className="rc-toast-body">{t.body}</div>
        </div>
      ))}
    </div>
  );
}
