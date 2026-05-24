import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Scissors } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Booking() {
  const navigate = useNavigate();
  const { state, createAppointment, createQueueTicket, timeSlots, isSlotAvailable, isSlotAvailableExcluding, auth, updateAppointment } = useApp();
  const [date, setDate] = useState('');
  const location = useLocation();
  const [barberId, setBarberId] = useState(location.state?.barberId || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [time, setTime] = useState('');
  const [confirmedApt, setConfirmedApt] = useState(null);
  const [editing, setEditing] = useState(false);
  const aptId = location.state?.aptId;

  useEffect(() => {
    if (location.state?.edit && aptId) {
      const apt = state.appointments.find(a => a.id === aptId);
      if (apt) {
        setDate(apt.date || '');
        setBarberId(apt.barberId || '');
        setServiceId((apt.services && apt.services[0]) || '');
        setTime(apt.time || '');
        setCustomerName(apt.customerName || '');
        setCustomerPhone(apt.customerPhone || '');
        setEditing(true);
      }
    }
  }, [location.state, aptId, state.appointments]);

  // Check if user is logged in via context
  const isAuth = auth?.isAuthenticated;
  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: '/booking' }} />;
  }

  const handleBook = (e) => {
    e.preventDefault();
    // Ensure user is still authenticated before booking
    if (!isAuth) {
      navigate('/login', { replace: true, state: { from: '/booking' } });
      return;
    }
    if (!date || !serviceId) return alert('الرجاء اختيار التاريخ والخدمة');
    if (!customerName || !customerPhone) return alert('الرجاء إدخال الاسم ورقم الجوال');

    const selectedService = state.services.find(s => s.id === serviceId);
    if (!selectedService) return;

    const totalDuration = selectedService.duration || 30;
    const customerEmail = auth?.user?.email;
    // find earliest available time slot for chosen barber on date
    const chosenBarber = barberId || (state.barbers[0] && state.barbers[0].id);
    const available = timeSlots.find(slot => isSlotAvailable(chosenBarber, date, slot, totalDuration));
    // if user selected a specific time, prefer that
    if (time) {
      // if editing, allow checking excluding this apt id
      if (editing && aptId) {
        try {
          const apt = updateAppointment({ ...(state.appointments.find(a => a.id === aptId) || {}), barberId: chosenBarber, services: [serviceId], date, time, totalDuration, customerName, customerPhone });
          setConfirmedApt(apt);
          return;
        } catch (e) { if (e.message) return alert(e.message); }
      } else {
        // creating new appointment with selected time
        try {
          const apt = createAppointment({ barberId: chosenBarber, services: [serviceId], date, time, totalPrice: selectedService.price, totalDuration, customerName: customerName, customerPhone: customerPhone, customerEmail, notes: '' });
          setConfirmedApt(apt);
          return;
        } catch (e) { if (e.message) return alert(e.message); }
      }
    }
    if (editing && aptId) {
      const orig = state.appointments.find(a => a.id === aptId);
      if (!orig) return alert('الحجز غير موجود');
      const updated = { ...orig, barberId: chosenBarber, services: [serviceId], date, customerName: customerName, customerPhone: customerPhone };
      try {
        updateAppointment(updated);
        setConfirmedApt(updated);
        return;
      } catch (e) { if (e.message) return alert(e.message); }
    }

    if (available) {
      try {
        const apt = createAppointment({ barberId: chosenBarber, services: [serviceId], date, time: available, totalPrice: selectedService.price, totalDuration, customerName: customerName, customerPhone: customerPhone, customerEmail, notes: '' });
        setConfirmedApt(apt);
        return;
      } catch (e) {
        if (e.message) return alert(e.message);
      }
    }

    // if no available time, create a queue ticket
    try {
      const ticket = createQueueTicket({ customerName: customerName, customerPhone: customerPhone, customerEmail, barberId: chosenBarber });
      setConfirmedApt(ticket);
    } catch (e) {
      if (e.message) return alert(e.message);
    }
  };

  const formatBookingTime = (iso) => {
    try {
      if (!iso) return null;
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return null; }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem', direction: 'rtl' }}>
      {/* confirmation will show inline where the form used to be (so user sees it immediately) */}
      <button onClick={() => navigate(-1)} className="btn-ghost btn-sm" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> رجوع
      </button>

      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', textAlign: 'center' }}>حجز موعد</h1>
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2.5rem' }}>اختر الخدمة والتاريخ. سيتم تحديد الوقت تلقائياً حسب أول فتحة متاحة.</p>
        {confirmedApt ? (
          <div style={{ maxWidth: '100%', margin: '0 auto 1rem' }}>
            <div className="glass animate-in" style={{ padding: '1.25rem', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900 }}>✓</div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900 }}>تم تأكيد الحجز</div>
                  <div style={{ color: 'var(--muted)' }}>رقم الحجز: <strong>{confirmedApt.id}</strong></div>
                  <div style={{ color: 'var(--muted)', marginTop: '0.25rem' }}>{confirmedApt.customerName} • {confirmedApt.customerPhone}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <div style={{ minWidth: 100 }}>
                  <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>التاريخ</div>
                  <div style={{ fontWeight: 700 }}>{confirmedApt.date}</div>
                </div>
                <div style={{ minWidth: 100 }}>
                  <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>الوقت / دور</div>
                  <div style={{ fontWeight: 700 }}>
                    {confirmedApt.createdAt ? formatBookingTime(confirmedApt.createdAt) : (confirmedApt.time ? confirmedApt.time : (confirmedApt.queueNumber ? `رقم ${confirmedApt.queueNumber} (في الطابور)` : '—'))}
                  </div>
                </div>
                {/* السعر مخفي */}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-gold" onClick={() => { navigate('/'); }} style={{ padding: '0.7rem 1rem' }}>العودة للرئيسية</button>
                  <button className="btn-ghost" onClick={() => { setConfirmedApt(null); }} style={{ padding: '0.7rem 1rem' }}>أغلق</button>
                  <button className="btn-ghost" onClick={() => { navigate('/receipts'); }} style={{ padding: '0.7rem 1rem' }}>عرض الحجز</button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBook} className="glass animate-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRadius: 16 }}>
          <div>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 700 }}>
              <Scissors size={16} className="gold" /> الخدمة المطلوبة
            </label>
            <select className="input-field" value={serviceId} onChange={e => setServiceId(e.target.value)} required>
              <option value="">اختر خدمة...</option>
              {state.services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 700 }}>
              <Calendar size={16} className="gold" /> التاريخ
            </label>
            <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
          </div>

          <div>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 700 }}>
              <Clock size={16} className="gold" /> الوقت (اختياري)
            </label>
            <input type="time" className="input-field" value={time} onChange={e => setTime(e.target.value)} step="60" min="00:00" max="23:59" />
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.35rem' }}>يمكنك إدخال وقت منسق بنظام 24 ساعة (مثال: 14:30)</div>
          </div>

          {date && serviceId && (
            (() => {
              const selectedService = state.services.find(s => s.id === serviceId) || {};
              const totalDuration = selectedService.duration || 30;
              const slots = timeSlots.filter(s => { const h = Number(s.split(':')[0]); return h >= 9 && h < 20; });
              const sessions = {
                'الصباح (9AM–12PM)': slots.filter(s => { const h = Number(s.split(':')[0]); return h >= 9 && h < 12; }),
                'بعد الظهر (12PM–5PM)': slots.filter(s => { const h = Number(s.split(':')[0]); return h >= 12 && h < 17; }),
                'المساء (5PM–9PM)': slots.filter(s => { const h = Number(s.split(':')[0]); return h >= 17 && h < 20; }),
              };
              return (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ color: 'var(--muted)', marginBottom: '0.5rem', fontWeight: 700 }}>اختر الوقت (اختياري)</div>
                  {Object.entries(sessions).map(([label, sls]) => (
                    <div key={label} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>{label}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.4rem' }}>
                        {sls.map(slot => {
                          const busy = editing && aptId ? !isSlotAvailableExcluding(barberId || (state.barbers[0] && state.barbers[0].id), date, slot, totalDuration, aptId) : !isSlotAvailable(barberId || (state.barbers[0] && state.barbers[0].id), date, slot, totalDuration);
                          return (
                            <div key={slot} onClick={() => { if (!busy) setTime(slot); }}
                              className={`time-slot ${time === slot ? 'selected' : ''} ${busy ? 'booked' : ''}`}>
                              {slot}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          )}

          {/* الزمن يحدد تلقائياً، لا حاجة لاختيار الوقت */}

          <div>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 700 }}>
              <User size={16} className="gold" /> اختيار الحلاق (اختياري)
            </label>
            <select className="input-field" value={barberId} onChange={e => setBarberId(e.target.value)}>
              <option value="">أي حلاق متاح</option>
              {state.barbers.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 700 }}>
              <User size={16} className="gold" /> اسمك
            </label>
            <input className="input-field" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="الاسم الكامل" required />
          </div>

          <div>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 700 }}>
              <User size={16} className="gold" /> رقم الجوال
            </label>
            <input className="input-field" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="05xxxxxxxx" required />
          </div>

          <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
            تأكيد الحجز
          </button>
          </form>
        )}
      </div>
    </div>
  );
}
