import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Briefcase, Store, Settings, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Do not render the mobile navigation on the public landing page
  const isStore = location.pathname === '/';
  if (isStore) return null;

  const isAdminPath = location.pathname.startsWith('/admin');

  const { auth, logout } = useApp();

  // Build mobile nav based on auth state. Show logout when authenticated.
  const navItems = isAdminPath
    ? [
        { name: 'لوحة التحكم', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { name: 'المواعيد', icon: <Calendar size={20} />, path: '/admin/appointments' },
        { name: 'العملاء', icon: <Users size={20} />, path: '/admin/customers' },
        { name: 'الخدمات', icon: <Briefcase size={20} />, path: '/admin/services' },
        { name: 'المنتجات', icon: <Store size={20} />, path: '/admin/products' },
        { name: 'الإعدادات', icon: <Settings size={20} />, path: '/admin/settings' },
        { name: 'تسجيل الخروج', icon: <LogOut size={20} />, action: 'logout' },
      ]
    : [
        { name: 'الرئيسية', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'المواعيد', icon: <Calendar size={20} />, path: '/booking' },
        { name: 'الخدمات', icon: <Briefcase size={20} />, path: '/services' },
        { name: 'المنتجات', icon: <Store size={20} />, path: '/products' },
      ];

  // If user is authenticated and not already showing admin link, add logout and admin (if owner)
  if (auth?.isAuthenticated) {
    // add admin link for owners
    const isOwner = auth.role === 'owner' || auth.user?.admin || auth.user?.role === 'owner';
    if (isOwner && !navItems.find(i => i.path === '/admin')) {
      navItems.unshift({ name: 'لوحة التحكم', icon: <LayoutDashboard size={20} />, path: '/admin' });
    }
    // ensure logout exists
    if (!navItems.find(i => i.action === 'logout')) {
      navItems.push({ name: 'تسجيل الخروج', icon: <LogOut size={20} />, action: 'logout' });
    }
  }

  return (
    <nav className="mobile-nav" dir="rtl">
      <div className="mobile-nav-inner">
        {navItems.map((item) => {
          if (item.action === 'logout') {
            return (
              <button key="logout" onClick={async (e) => { e.preventDefault(); await logout(); navigate('/'); }} className="mobile-nav-item" style={{ background: 'transparent', border: 'none' }}>
                <span className="icon-wrapper">{item.icon}</span>
                <span className="label">{item.name}</span>
              </button>
            );
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="icon-wrapper">{item.icon}</span>
              <span className="label">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
