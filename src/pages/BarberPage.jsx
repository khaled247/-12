import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BarberPanel from '../components/BarberPanel';

export default function BarberPage() {
  const { state, auth } = useApp();
  const navigate = useNavigate();
  const [barberId, setBarberId] = useState(state.barbers[0]?.id || null);

  if (!(auth?.role === 'owner' || auth?.role === 'admin')) {
    return (
      <div style={{ padding: '2rem', direction: 'rtl' }}>
        <h2>غير مصرح</h2>
        <p style={{ color: 'var(--muted)' }}>يجب أن تكون مسؤولاً لعرض لوحة الحلاق.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>لوحة الحلاق</h1>
          <p style={{ color: 'var(--muted)' }}>تابع الصف والمُعالجة الحالية للحلاق المختار</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select className="input-field" value={barberId || ''} onChange={e => setBarberId(e.target.value)}>
            {state.barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <button className="btn-gold btn-sm" onClick={() => navigate('/admin/barber/screen')}>فتح شاشة المحل</button>
          <button className="btn-ghost btn-sm" onClick={() => navigate(-1)}>رجوع</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1rem' }}>
        <div>
          <div className="glass" style={{ padding: '1rem', borderRadius: 12 }}>
            <h3 style={{ marginBottom: '0.75rem' }}>تفاصيل الطابور</h3>
            <p style={{ color: 'var(--muted)' }}>يمكنك إدارة الطابور وإكمال الخلع وتنبيه العملاء من هنا.</p>
            {/* Future: add larger list/table or controls here */}
          </div>
        </div>
        <div>
          <BarberPanel barberId={barberId} />
        </div>
      </div>
    </div>
  );
}
