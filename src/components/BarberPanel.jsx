import React from 'react';
import { useApp } from '../context/AppContext';

export default function BarberPanel({ barberId, date }) {
  const { state, completeAppointment, dispatch } = useApp();
  const formatBookingTime = (iso) => {
    try {
      if (!iso) return null;
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return null; }
  };
  const today = new Date().toISOString().split('T')[0];
  const targetDate = date || today;
  const barber = state.barbers.find(b => b.id === (barberId || state.barbers[0]?.id));
  if (!barber) return null;
  const active = state.appointments.find(a => a.barberId === barber.id && a.date >= targetDate && a.status === 'active');
  // include upcoming bookings (today and future) and queue tickets, exclude cancelled
  const upcoming = state.appointments
    .filter(a => a.barberId === barber.id && a.date >= targetDate && a.status !== 'cancelled' && a.status !== 'completed')
    .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));

  // pending list: upcoming excluding currently active
  const pending = upcoming.filter(a => a.id !== (active && active.id) && (a.status === 'pending' || a.status === 'confirmed'));

  // debug info to help trace why list may be empty
  try {
    // eslint-disable-next-line no-console
    console.debug('BarberPanel debug', { barberId: barber.id, targetDate, upcomingCount: upcoming.length, pendingCount: pending.length, activeId: active?.id });
  } catch (e) {}

  return (
    <div className="glass" style={{ padding: '1rem', borderRadius: 12, minWidth: 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, background: barber.color || 'var(--gold)' }} />
        <div style={{ fontWeight: 900 }}>{barber.name}</div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>العميل النشط</div>
        {active ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800 }}>{active.customerName}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{active.customerPhone} • {active.createdAt ? formatBookingTime(active.createdAt) : (active.time ? active.time : (active.queueNumber ? `رقم ${active.queueNumber}` : '—'))}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-gold" onClick={() => completeAppointment(active.id)} style={{ padding: '0.5rem 0.75rem' }}>✓ تم</button>
              <button className="btn-ghost" onClick={() => {
                // complete current and let createAppointment/completeAppointment logic promote next
                completeAppointment(active.id);
              }} style={{ padding: '0.5rem 0.75rem' }}>▶ التالي</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--muted)' }}>لا يوجد عميل نشط حالياً</div>
            <div>
              <button className="btn-ghost" onClick={() => {
                const next = pending[0];
                if (!next) return;
                // no active, promote next to active
                dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id: next.id, status: 'active' } });
              }} style={{ padding: '0.4rem 0.7rem' }}>▶ التالي</button>
            </div>
          </div>
        )}
      </div>

      <div>
        <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>قائمة الانتظار</div>
        {pending.length === 0 ? (
          <div style={{ color: 'var(--muted)' }}>لا يوجد عملاء في الانتظار</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pending.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{p.customerName}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{p.customerPhone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 900 }}>{p.createdAt ? formatBookingTime(p.createdAt) : (typeof p.queueNumber === 'number' ? `#${p.queueNumber}` : (p.time ? p.time : '—'))}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{p.status === 'confirmed' ? 'محجوز' : (p.status === 'pending' ? 'في الانتظار' : p.status)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
