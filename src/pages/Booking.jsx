import React, { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Scissors } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Booking() {
  const navigate = useNavigate();
  const { state, createAppointment, createQueueTicket, timeSlots, isSlotAvailable, auth } = useApp();
  const [date, setDate] = useState('');
  const location = useLocation();
  const [barberId, setBarberId] = useState(location.state?.barberId || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [confirmedApt, setConfirmedApt] = useState(null);

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
