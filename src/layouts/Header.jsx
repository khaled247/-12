import React from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import MobileToggle from './MobileToggle';
import { Bell, Search, User, Users, Users2, DollarSign, Settings } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'لوحة التحكم';
    if (path.includes('/appointments')) return 'المواعيد';
    if (path.includes('/customers')) return 'العملاء';
    if (path.includes('/services')) return 'الخدمات';
    if (path.includes('/products')) return 'المنتجات';
    if (path.includes('/staff')) return 'الفريق';
    if (path.includes('/finances')) return 'المالية';
    if (path.includes('/settings')) return 'الإعدادات';
    return 'الإدارة';
  };

  const { state } = useApp();

  const secondaryMenu = [
    { name: 'العملاء', icon: <Users size={16} />, path: '/admin/customers' },
    { name: 'الفريق', icon: <Users2 size={16} />, path: '/admin/staff' },
    { name: 'المالية', icon: <DollarSign size={16} />, path: '/admin/finances' },
    { name: 'الإعدادات', icon: <Settings size={16} />, path: '/admin/settings' },
  ];

  return (
    <>
      <header className="admin-header" dir="rtl">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="mobile-only">
            <MobileToggle />
          </div>
        
          <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{getPageTitle()}</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
            {state?.salon?.name || 'صدام العالمي'} / {getPageTitle()}
          </div>
        </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Search */}
          <div className="mobile-hidden" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input 
              type="text" 
              placeholder="بحث سريع..." 
              style={{ 
                background: 'var(--bg2)', 
                border: '1px solid var(--border)', 
                borderRadius: '50px', 
                padding: '0.6rem 2.5rem 0.6rem 1rem',
                color: 'var(--text)',
                fontSize: '0.85rem',
                outline: 'none',
                width: '200px'
              }} 
            />
          </div>

          {/* Notifications */}
          <button style={{ background: 'var(--bg3)', border: '1px solid var(--border)', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', position: 'relative', cursor: 'pointer' }}>
            <Bell size={18} />
            <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%', border: '2px solid var(--bg3)' }}></span>
          </button>

          {/* Profile + logout */}
          <ProfileHeader />
        </div>
        </div>
      </header>

      {/* Mobile Horizontal Menu */}
      <div className="mobile-only horizontal-scroll mobile-topbar" dir="rtl">
        {secondaryMenu.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `btn-ghost btn-sm ${isActive ? 'active-mobile-tab' : ''}`}
            style={({ isActive }) => ({
              whiteSpace: 'nowrap',
              flexShrink: 0,
              background: isActive ? 'var(--gold)' : 'var(--bg3)',
              color: isActive ? '#000' : 'var(--muted)',
              border: isActive ? '1px solid var(--gold)' : '1px solid var(--border)'
            })}
          >
            {item.icon} {item.name}
          </NavLink>
        ))}
      </div>
    </>
  );
}

function ProfileHeader() {
  const navigate = useNavigate();
  const { auth, logout } = useApp();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
        <User size={18} />
      </div>
      <div className="mobile-hidden" style={{ paddingLeft: '0.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1 }}>{auth?.user?.displayName || (auth?.role === 'owner' ? 'المدير' : 'مستخدم')}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{auth?.user?.email || (auth?.role || 'guest')}</div>
      </div>
      <button onClick={handleLogout} title="تسجيل الخروج" style={{ background: 'transparent', border: 'none', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem', borderRadius: 10 }}>
        <LogOut size={16} />
      </button>
    </div>
  );
}
