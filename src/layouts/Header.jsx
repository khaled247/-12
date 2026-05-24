import React from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import MobileToggle from './MobileToggle';
import { Bell, Search, User, Users, Users2, DollarSign, Settings, FileText } from 'lucide-react';
import { LogOut } from 'lucide-react';
import Button from '../components/UI/Button';
import IconButton from '../components/UI/IconButton';
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
    { name: 'التأكيدات', icon: <FileText size={16} />, path: '/receipts' },
    { name: 'الإعدادات', icon: <Settings size={16} />, path: '/admin/settings' },
  ];

  return (
    <>
      <header className="admin-header" dir="rtl">
        <div className="header-inner">
          <div className="mobile-only">
            <MobileToggle />
          </div>

          <div className="title-block">
            <h2>{getPageTitle()}</h2>
            <div className="title-sub">{state?.salon?.name || 'صدام العالمي'} / {getPageTitle()}</div>
          </div>

          <div className="actions">
            {/* Search */}
              <div className="mobile-hidden search-input">
                <Search size={16} className="search-icon" />
                <input type="text" placeholder="بحث سريع..." className="input-field" />
              </div>

            {/* Notifications */}
            <IconButton title="الإشعارات" className="notif-btn">
              <div style={{ position: 'relative' }}>
                <Bell size={18} />
                <span className="notif-dot" />
              </div>
            </IconButton>

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
            className={({ isActive }) => `mobile-tab ${isActive ? 'active-mobile-tab' : ''}`}
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
    <div className="profile-header">
      <div className="avatar"><User size={18} /></div>
      <div className="mobile-hidden meta">
        <div className="name">{auth?.user?.displayName || (auth?.role === 'owner' ? 'المدير' : 'مستخدم')}</div>
        <div className="sub">{auth?.user?.email || (auth?.role || 'guest')}</div>
      </div>
      <IconButton title="تسجيل الخروج" onClick={handleLogout}>
        <LogOut size={16} />
      </IconButton>
    </div>
  );
}
