import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Scissors, LayoutDashboard, Calendar, Users, Briefcase, Users2, DollarSign, Settings, Store, LogOut, User, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  // Close sidebar when clicking overlay on mobile
  React.useEffect(() => {
    const handleClick = (e) => {
      const appShell = document.querySelector('.app-shell');
      if (!appShell) return;
      if (!appShell.classList.contains('sidebar-open')) return;
      // if click outside sidebar, close
      const aside = document.querySelector('aside.sidebar');
      if (aside && !aside.contains(e.target)) {
        appShell.classList.remove('sidebar-open');
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'الرئيسية', icon: <LayoutDashboard size={19} />, path: '/admin' },
    { name: 'المواعيد', icon: <Calendar size={19} />, path: '/admin/appointments' },
    { name: 'العملاء', icon: <Users size={19} />, path: '/admin/customers' },
    { name: 'الخدمات', icon: <Briefcase size={19} />, path: '/admin/services' },
    { name: 'المنتجات', icon: <Store size={19} />, path: '/admin/products' },
    { name: 'الفريق', icon: <Users2 size={19} />, path: '/admin/staff' },
    { name: 'المالية', icon: <DollarSign size={19} />, path: '/admin/finances' },
    { name: 'الإعدادات', icon: <Settings size={19} />, path: '/admin/settings' },
  ];

  const { logout, auth } = useApp();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} dir="rtl" style={{ background: 'var(--bg2)', borderLeft: '1px solid var(--border)', position: 'relative', transition: 'width 0.3s ease' }}>
      {/* Decorative Glow */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '150px', background: 'radial-gradient(ellipse at top, rgba(212,175,55,0.05), transparent)', pointerEvents: 'none' }} />

      {/* Brand */}
      <div
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2.5rem', cursor: 'pointer', padding: '0.5rem', borderRadius: 12, transition: 'all 0.3s' }}
        className="hover-scale"
      >
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, var(--gold), #b38b22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flexShrink: 0, boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}>
          <Scissors size={20} />
        </div>
                {!isCollapsed && (
          <div className="brand-text" style={{ transition: 'opacity 0.3s' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, lineHeight: 1.2, color: 'var(--text)' }}>صدام العالمي</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.05em' }}>لوحة الإدارة الفاخرة</div>
          </div>
        )}

      </div>

      {/* Mobile close (visible when expanded) */}
      <button onClick={() => document.querySelector('.app-shell')?.classList.remove('sidebar-open')} className="mobile-only sidebar-close" aria-label="Close sidebar">
        <X size={18} />
      </button>

      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapse}
        className="btn-ghost"
        style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0', background: 'transparent', color: 'var(--muted)', border: 'none', marginBottom: '1rem' }}
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
        <span style={{ marginLeft: '0.5rem', fontWeight: 600 }}>
          {isCollapsed ? 'توسيع القائمة' : 'تقليل القائمة'}
        </span>
      </button>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {menuItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ position: 'relative', overflow: 'hidden' }}
            title={item.name}
          >
            {({ isActive }) => (
              <>
                {isActive && <div style={{ position: 'absolute', right: 0, top: '20%', bottom: '20%', width: '3px', background: 'var(--gold)', borderRadius: '4px 0 0 4px', boxShadow: '0 0 10px var(--gold)' }} />}
                <span style={{ flexShrink: 0, zIndex: 2, color: isActive ? 'var(--gold)' : 'inherit' }}>{item.icon}</span>
                <span className="label" style={{ zIndex: 2, fontWeight: isActive ? 800 : 600 }}>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile & Actions */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={() => navigate('/')}
          className="btn-ghost"
          style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'rgba(255,255,255,0.02)', color: 'var(--text)' }}
        >
          <Store size={18} className="gold" />
          زيارة المتجر
        </button>
        <button
          onClick={handleLogout}
          className="btn-ghost"
          style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'rgba(239,68,68,0.05)', color: 'var(--danger)' }}
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
