import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, TrendingUp, DollarSign, Calendar as CalendarIcon, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Finances() {
  const { state } = useApp();
  const navigate = useNavigate();

  const data = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const completed = state.appointments.filter(a => a.status === 'completed');

    let total = 0, todayTotal = 0, weekTotal = 0;
    const d = new Date();
    d.setDate(d.getDate() - 7);
    const lastWeek = d.toISOString().split('T')[0];

    completed.forEach(a => {
      total += a.totalPrice;
      if (a.date === today) todayTotal += a.totalPrice;
      if (a.date >= lastWeek) weekTotal += a.totalPrice;
    });

    return { total, todayTotal, weekTotal, count: completed.length };
  }, [state.appointments]);

  return (
    <div style={{ padding: '2rem', direction: 'rtl' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost btn-sm" style={{ padding: '0.6rem', borderRadius: '50%' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>المالية والإيرادات</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>نظرة شاملة على الأداء المالي للصالون</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass animate-in" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>إيرادات اليوم</div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>—</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700 }}>
            <ArrowUpRight size={14} /> 12% مقارنة بأمس
          </div>
        </div>

        <div className="glass animate-in" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>إيرادات الأسبوع</div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.1)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarIcon size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>—</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700 }}>
            <ArrowUpRight size={14} /> 8.5% مقارنة بالأسبوع الماضي
          </div>
        </div>

        <div className="glass animate-in" style={{ padding: '1.5rem', animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>إجمالي الإيرادات</div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>—</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
            من {data.count} موعد مكتمل
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass animate-in" style={{ padding: '0', animationDelay: '0.3s' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>سجل العمليات الأخير</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>رقم الفاتورة</th>
                <th>العميل</th>
                <th>الخدمات</th>
                <th>الحالة</th>
                <th>المبلغ</th>
              </tr>
            </thead>
            <tbody>
              {state.appointments.filter(a => a.status === 'completed').map(apt => (
                <tr key={apt.id}>
                  <td style={{ fontWeight: 600 }}>{apt.date}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.85rem', fontFamily: 'monospace' }}>#{apt.id.slice(-6)}</td>
                  <td style={{ fontWeight: 700 }}>{apt.customerName}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{apt.services.length} خدمة</td>
                  <td><span className="badge badge-completed">مدفوع</span></td>
                  <td style={{ color: 'var(--gold)', fontWeight: 800 }}>—</td>
                </tr>
              ))}
              {state.appointments.filter(a => a.status === 'completed').length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                    لا توجد فواتير مكتملة حتى الآن
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
