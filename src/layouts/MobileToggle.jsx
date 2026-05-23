import React from 'react';
import { Menu } from 'lucide-react';

export default function MobileToggle() {
  const toggle = () => {
    const appShell = document.querySelector('.app-shell');
    if (!appShell) return;
    appShell.classList.toggle('sidebar-open');
  };

  return (
    <button className="mobile-toggle" onClick={toggle} aria-label="Toggle sidebar">
      <Menu size={18} />
    </button>
  );
}
