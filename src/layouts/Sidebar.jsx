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

  const { logout, auth, state } = useApp();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} dir="rtl">
      <div className="sidebar-glow" />

      <button className="brand" onClick={() => navigate('/')} title="الرئيسية" aria-label="الرئيسية">
        <div className="brand-icon" aria-hidden><Scissors size={20} /></div>
        {!isCollapsed && (
          <div className="brand-text">
            <div className="brand-name">{state?.salon?.name || 'صدام العالمي'}</div>
            <div className="brand-sub">لوحة الإدارة الفاخرة</div>
          </div>
        )}
      </button>

      <button onClick={() => document.querySelector('.app-shell')?.classList.remove('sidebar-open')} className="mobile-only sidebar-close" aria-label="Close sidebar">
        <X size={18} />
      </button>

      <button onClick={toggleCollapse} className="collapse-toggle btn-ghost" aria-label="Toggle sidebar">
        <Menu size={18} />
        <span className="collapse-label">{isCollapsed ? 'توسيع القائمة' : 'تقليل القائمة'}</span>
      </button>

      <nav className="sidebar-nav">
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

      <div className="sidebar-footer">
        <button onClick={() => navigate('/')} className="btn-ghost sidebar-action"> <Store size={18} className="gold" /> زيارة المتجر</button>
        {auth?.isAuthenticated && (<button onClick={handleLogout} className="btn-ghost sidebar-action danger"> <LogOut size={18} /> تسجيل الخروج</button>)}
      </div>
    </aside>
  );
}
