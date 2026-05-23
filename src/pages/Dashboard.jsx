import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Users, DollarSign, Calendar, TrendingUp, Clock, CheckCircle, XCircle, ArrowLeft, Scissors } from 'lucide-react';
import BarberPanel from '../components/BarberPanel';

export default function Dashboard() {
  const { state, dispatch, completeAppointment, auth } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayApts = state.appointments.filter(a => a.date === today);
    const confirmed = todayApts.filter(a => a.status === 'confirmed').length;
    const revenue = state.appointments
      .filter(a => a.status !== 'cancelled')
      .reduce((sum, a) => sum + a.totalPrice, 0);
    return [
      { label: 'مواعيد اليوم', value: todayApts.length, icon: <Calendar size={22} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', path: '/admin/appointments' },
      { label: 'مؤكّدة', value: confirmed, icon: <CheckCircle size={22} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)', path: '/admin/appointments' },
      { label: 'إجمالي العملاء', value: new Set(state.appointments.map(a => a.customerPhone)).size, icon: <Users size={22} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', path: '/admin/customers' },
      { label: 'إجمالي الإيرادات', value: `$${revenue}`, icon: <DollarSign size={22} />, color: '#d4af37', bg: 'rgba(212,175,55,0.1)', path: '/admin/finances' },
    ];
  }, [state.appointments]);

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return state.appointments
      .filter(a => a.date >= today && a.status !== 'cancelled')
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 6);
  }, [state.appointments]);

  const getBarberName = (id) => state.barbers.find(b => b.id === id)?.name || '—';
  const getServiceNames = (ids) => ids.map(id => state.services.find(s => s.id === id)?.name).filter(Boolean).join('، ');

  const statusBadge = (status) => {
    const map = { confirmed: ['badge-confirmed', 'مؤكّد'], completed: ['badge-completed', 'مكتمل'], cancelled: ['badge-cancelled', 'ملغى'], pending: ['badge-pending', 'قيد الانتظار'] };
    const [cls, label] = map[status] || ['badge-pending', status];
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  const changeStatus = (id, status) => {
    if (status === 'completed') return completeAppointment(id);
    return dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id, status } });
  };

  return (
    <div style={{ padding: '2rem', direction: 'rtl' }}>

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.4rem' }}>مرحباً بعودتك، <span className="shimmer-text">المدير</span> 👋</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>إليك نظرة عامة على نشاط صالون صدام العالمي اليوم</p>
        </div>
        <button className="btn-gold" onClick={() => navigate('/admin/appointments')} style={{ boxShadow: '0 4px 20px rgba(212,175,55,0.2)' }}>
          <Calendar size={17} /> موعد جديد
        </button>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate(s.path)}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color, boxShadow: `0 0 15px ${s.color}30` }}>
              {s.icon}
            </div>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>{s.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem', alignItems: 'start' }}>
        <div>
          {/* Upcoming Appointments (existing) */}
        </div>
        <div>
          {(auth?.role === 'owner' || auth?.role === 'admin') && (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                <button className="btn-gold btn-sm" onClick={() => navigate('/admin/barber')}>فتح لوحة الحلاق</button>
              </div>
              <BarberPanel />
            </>
          )}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="glass" style={{ padding: '1.75rem', background: 'var(--bg3)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
              <Clock size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>المواعيد القادمة</h3>
          </div>
          <button className="btn-ghost btn-sm" onClick={() => navigate('/admin/appointments')}>
            عرض الكل <ArrowLeft size={15} />
          </button>
        </div>

        {upcoming.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.01)', borderRadius: '14px', border: '1px dashed var(--border)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(212,175,55,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--gold)' }}>
              <Calendar size={36} />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>لا توجد مواعيد اليوم</h4>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '300px', margin: '0 auto 1.5rem' }}>
              يبدو أن الجدول فارغ حالياً. يمكنك إضافة مواعيد جديدة يدوياً أو انتظار حجوزات العملاء.
            </p>
            <button className="btn-ghost" onClick={() => navigate('/admin/appointments')}>إضافة موعد</button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>العميل</th>
                  <th>التاريخ والوقت</th>
                  <th>الحلاق</th>
                  <th>الخدمات</th>
                  <th>الإجمالي</th>
                  <th>الحالة</th>
                  <th style={{ textAlign: 'right' }}>إجراء</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map(apt => (
                  <tr key={apt.id}>
                    <td data-label="العميل">
                      <div style={{ fontWeight: 800 }}>{apt.customerName}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{apt.customerPhone}</div>
                    </td>
                    <td data-label="التاريخ والوقت">
                      <div style={{ fontWeight: 600 }}>{apt.date}</div>
                      <div style={{ color: 'var(--gold)', fontSize: '0.88rem', fontWeight: 800, marginTop: '0.2rem' }}>{apt.time}</div>
                    </td>
                    <td data-label="الحلاق" style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600 }}>{getBarberName(apt.barberId)}</td>
                    <td data-label="الخدمات" style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: 200, lineHeight: 1.4 }}>{getServiceNames(apt.services)}</td>
                    <td data-label="الإجمالي" style={{ color: 'var(--gold)', fontWeight: 900, fontSize: '1.05rem' }}>${apt.totalPrice}</td>
                    <td data-label="الحالة">{statusBadge(apt.status)}</td>
                    <td data-label="إجراء">
                      <div className="actions" style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        {apt.status === 'confirmed' && (
                          <>
                            <button onClick={() => changeStatus(apt.id, 'completed')}
                              style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.4rem 0.7rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, transition: 'all 0.2s' }} className="hover-scale">
                              ✓ أكمل
                            </button>
                            <button onClick={() => changeStatus(apt.id, 'cancelled')}
                              style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.4rem 0.7rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, transition: 'all 0.2s' }} className="hover-scale">
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
