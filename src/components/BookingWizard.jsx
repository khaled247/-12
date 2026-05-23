import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { X, Check, ChevronRight, ChevronLeft, Scissors, Clock, DollarSign, User, Phone, FileText, Star } from 'lucide-react';

const CATEGORIES = ['Haircuts', 'Beard', 'Treatments', 'Combos'];

function StepIndicator({ current }) {
  const steps = ['الخدمات', 'الحلاق', 'الوقت', 'تأكيد الحجز'];
  return (
    <div className="step-indicator">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className={`step-dot ${i < current ? 'done' : i === current ? 'active' : ''}`}>
            {i < current ? <Check size={14} /> : i + 1}
          </div>
          {i < steps.length - 1 && <div className={`step-line ${i < current ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Step 1: Services ──────────────────────────────────────────────────────────
function StepServices({ selected, onToggle, total }) {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('Haircuts');

  const filtered = state.services.filter(s => s.category === activeTab);

  return (
    <div dir="rtl">
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem' }}>اختر الخدمات</h3>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>يمكنك اختيار أكثر من خدمة في وقت واحد.</p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)}
            style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === cat ? 'var(--gold)' : 'var(--bg3)',
              color: activeTab === cat ? '#000' : 'var(--muted)',
              borderColor: activeTab === cat ? 'var(--gold)' : 'var(--border)' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr' }}>
        {filtered.map(svc => {
          const isSelected = selected.includes(svc.id);
          return (
            <div key={svc.id} className={`service-card ${isSelected ? 'selected' : ''}`} onClick={() => onToggle(svc)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'rgba(212,175,55,0.08)' }}>
                  {svc.image ? <img src={svc.image} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : svc.icon}
                </div>
                {isSelected && <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} color="#000" /></div>}
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{svc.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>{svc.description}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{svc.duration} min</span>
              </div>
            </div>
          );
        })}
      </div>

      {total.price > 0 && (
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Total: <strong style={{ color: 'var(--text)' }}>{selected.length} service(s) • {total.duration} min</strong></span>
          <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.2rem' }}></span>
        </div>
      )}
    </div>
  );
}

// ── Step 2: Barber ────────────────────────────────────────────────────────────
function StepBarber({ selectedBarber, onSelect }) {
  const { state } = useApp();
  return (
    <div dir="rtl">
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem' }}>اختر الحلاق المفضل</h3>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>جميع حلاقينا هم محترفون من الدرجة الأولى.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {state.barbers.map(b => (
          <div key={b.id} onClick={() => onSelect(b.id)}
            style={{ padding: '1.25rem', background: 'var(--bg3)', border: `2px solid ${selectedBarber === b.id ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '1rem',
              boxShadow: selectedBarber === b.id ? '0 0 20px var(--gold-glow)' : 'none' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${b.color}22`, border: `2px solid ${b.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {b.image ? <img src={b.image} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.4rem' }}>💈</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem' }}>{b.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{b.specialty}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={14} fill="currentColor" />{b.rating}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{b.reviews} reviews</div>
            </div>
            {selectedBarber === b.id && <Check color="var(--gold)" size={20} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 3: Date & Time ───────────────────────────────────────────────────────
function StepDateTime({ barberId, date, time, totalDuration, onDateChange, onTimeChange }) {
  const { timeSlots, getBookedSlots } = useApp();

  const booked = barberId && date ? getBookedSlots(barberId, date) : [];

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];

  const slots = timeSlots.filter(slot => {
    const [h] = slot.split(':').map(Number);
    return h >= 9 && h < 20;
  });

  const sessions = {
    'Morning (9AM–12PM)': slots.filter(s => { const h = parseInt(s); return h >= 9 && h < 12; }),
    'Afternoon (12PM–5PM)': slots.filter(s => { const h = parseInt(s); return h >= 12 && h < 17; }),
    'Evening (5PM–9PM)': slots.filter(s => { const h = parseInt(s); return h >= 17 && h < 20; }),
  };

  const isBooked = (slot) => {
    if (!barberId || !date) return false;
    const [h, m] = slot.split(':').map(Number);
    let t = h * 60 + m;
    for (let i = 0; i < Math.ceil(totalDuration / 30); i++) {
      const key = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
      if (booked.includes(key)) return true;
      t += 30;
    }
    return false;
  };

  return (
    <div dir="rtl">
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem' }}>اختر التاريخ والوقت</h3>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>الأوقات المظللة محجوزة مسبقاً وغير متاحة.</p>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>تاريخ الحجز</label>
        <input type="date" className="input-field" value={date} min={today} onChange={e => onDateChange(e.target.value)}
          style={{ colorScheme: 'dark' }} />
      </div>

      {date && Object.entries(sessions).map(([session, slots]) => (
        <div key={session} style={{ marginBottom: '1.25rem' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>{session}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.4rem' }}>
            {slots.map(slot => {
              const busy = isBooked(slot);
              return (
                <div key={slot} onClick={() => !busy && onTimeChange(slot)}
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
}

// ── Step 4: Confirm ───────────────────────────────────────────────────────────
function StepConfirm({ booking, onChange }) {
  const { state } = useApp();
  const barber = state.barbers.find(b => b.id === booking.barberId);
  const services = state.services.filter(s => booking.services.includes(s.id));

  return (
    <div dir="rtl">
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem' }}>تأكيد الحجز وبياناتك</h3>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>يرجى مراجعة تفاصيل الحجز وإدخال بياناتك للتأكيد.</p>

      {/* Summary */}
      <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          {[
            { label: 'الحلاق', value: barber?.name, icon: '💈' },
            { label: 'التاريخ', value: booking.date, icon: '📅' },
            { label: 'الوقت', value: booking.time, icon: '🕐' },
            { label: 'المدة الزمنية', value: `${booking.totalDuration} دقيقة`, icon: '⏱️' },
          ].map(item => (
            <div key={item.label} style={{ minWidth: '45%' }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: '0.2rem' }}>{item.icon} {item.label}</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '1rem', paddingTop: '1rem' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>الخدمات المطلوبة</div>
            {services.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              <span>{s.icon} {s.name}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <span>الإجمالي</span>
            <span style={{ color: 'var(--gold)' }}>{booking.totalDuration} دقيقة</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--gold)' }}>الاسم الكامل *</label>
          <input className="input-field" placeholder="مثال: أحمد الرشيد" value={booking.customerName}
            onChange={e => onChange('customerName', e.target.value)} onFocus={e => e.currentTarget.scrollIntoView({behavior: 'smooth', block: 'center'})} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--gold)' }}>رقم الجوال *</label>
          <input className="input-field" placeholder="مثال: 0501234567" value={booking.customerPhone} dir="ltr"
            type="tel" inputMode="tel" pattern="[0-9+\- ()]{7,20}" onFocus={e => e.currentTarget.scrollIntoView({behavior: 'smooth', block: 'center'})}
            onChange={e => onChange('customerPhone', e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>ملاحظات إضافية (اختياري)</label>
          <textarea className="input-field" rows={3} placeholder="أي طلبات خاصة للحلاق..." value={booking.notes}
            onFocus={e => e.currentTarget.scrollIntoView({behavior: 'smooth', block: 'center'})} onChange={e => onChange('notes', e.target.value)} style={{ resize: 'vertical' }} />
        </div>
      </div>
    </div>
  );
}

// ── Main Wizard ───────────────────────────────────────────────────────────────
export default function BookingWizard({ onClose, onSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, createAppointment, isSlotAvailable, auth } = useApp();
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [barberId, setBarberId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successApt, setSuccessApt] = useState(null);

  const totals = React.useMemo(() => {
    const svcs = state.services.filter(s => selectedServices.includes(s.id));
    return { price: svcs.reduce((a, s) => a + s.price, 0), duration: svcs.reduce((a, s) => a + s.duration, 0) };
  }, [selectedServices, state.services]);

  // Find earliest available slot across barbers (search window days)
  const findEarliestSlot = (duration, daysAhead = 14) => {
    const slots = generateSearchSlots();
    const today = new Date();
    for (let d = 0; d <= daysAhead; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dateStr = date.toISOString().split('T')[0];
      for (let b of state.barbers) {
        for (let slot of slots) {
          if (isSlotAvailableLocal(b.id, dateStr, slot, duration)) {
            return { barberId: b.id, date: dateStr, time: slot };
          }
        }
      }
    }
    return null;
  };

  const generateSearchSlots = () => {
    // use context timeSlots but keep within working hours
    return (state.timeSlots || []).filter(s => {
      const h = Number(s.split(':')[0]);
      return h >= 9 && h < 20;
    });
  };

  const isSlotAvailableLocal = (barberId, date, time, duration) => {
    try { return isSlotAvailable(barberId, date, time, duration); } catch { return false; }
  };

  const toggleService = (svc) => {
    setSelectedServices(prev => prev.includes(svc.id) ? prev.filter(id => id !== svc.id) : [...prev, svc.id]);
  };

  const canNext = () => {
    if (step === 0) return selectedServices.length > 0;
    if (step === 1) return !!barberId;
    if (step === 2) return !!date && !!time;
    if (step === 3) return !!customerName.trim() && !!customerPhone.trim() && phoneRegexValid(customerPhone);
    return false;
  };

  function phoneRegexValid(phone) {
    const phoneRegex = /^[\+]?([0-9][ \-\(\)]?){7,20}[0-9]$/;
    return phoneRegex.test(String(phone).trim());
  }

  const handleSubmit = () => {
    setError('');
    if (!auth?.isAuthenticated) {
      navigate('/login', { state: { from: location.pathname || '/booking' } });
      return;
    }
    if (!customerName.trim()) { setError('يرجى إدخال الاسم الكامل.'); return; }
    if (!phoneRegexValid(customerPhone)) { setError('يرجى إدخال رقم جوال صالح، مثال: 0501234567'); return; }
    setSubmitting(true);
    const customerEmail = auth?.user?.email;
    try {
      const apt = createAppointment({ barberId, services: selectedServices, date, time, totalPrice: totals.price, totalDuration: totals.duration, customerName: customerName.trim(), customerPhone: customerPhone.trim(), customerEmail, notes });
      setSuccess(true);
      setSuccessApt(apt);
      setSubmitting(false);
      if (onSuccess) onSuccess(apt);
    } catch (e) {
      setError(e.message || 'خطأ أثناء الحجز. حاول مرة أخرى.');
      setSubmitting(false);
    }
  };

  const handleQuickBook = () => {
    setError('');
    if (!auth?.isAuthenticated) {
      navigate('/login', { state: { from: location.pathname || '/booking' } });
      return;
    }
    if (selectedServices.length === 0) { setError('اختر خدمة واحدة على الأقل للحجز السريع.'); return; }
    const duration = totals.duration;
    const slot = findEarliestSlot(duration, 21);
    if (!slot) { setError('لم أجد مواعيد متاحة خلال الأيام القادمة. حاول اختيار خدمة أخرى.'); return; }
    // prefill and skip to confirm step
    setBarberId(slot.barberId);
    setDate(slot.date);
    setTime(slot.time);
    setStep(3);
  };

  return (
    <div className="modal-backdrop" onClick={e => { if (window.innerWidth >= 768 && e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Booking wizard" style={{ maxWidth: 640, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', direction: 'rtl' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            <span className="gold">احجز</span> موعدك
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X size={22} /></button>
        </div>

        <StepIndicator current={step} />

        {/* Quick book action (skip date/time selection) */}
        {step === 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
            <button className="btn-ghost" onClick={handleQuickBook} style={{ padding: '0.6rem 0.9rem' }}>حجز سريع - أسرع وقت متاح</button>
          </div>
        )}

        {success ? (
          <div dir="rtl" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Check size={48} color="var(--gold)" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>تم الحجز بنجاح!</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>رقم الحجز: <strong>{successApt?.id}</strong></p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
              <button className="btn-ghost" onClick={() => { setSuccess(false); onClose(); }} style={{ padding: '0.85rem 1.25rem', fontSize: '1rem' }}>اغلاق</button>
              <button className="btn-gold" onClick={() => { /* could navigate to appointment details */ onClose(); }} style={{ padding: '0.85rem 1.25rem', fontSize: '1rem' }}>عرض الحجز</button>
            </div>
          </div>
        ) : (
          <>
            {step === 0 && <StepServices selected={selectedServices} onToggle={toggleService} total={totals} />}
            {step === 1 && <StepBarber selectedBarber={barberId} onSelect={setBarberId} />}
            {step === 2 && <StepDateTime barberId={barberId} date={date} time={time} totalDuration={totals.duration}
              onDateChange={v => { setDate(v); setTime(''); }} onTimeChange={setTime} />}
            {step === 3 && <StepConfirm
              booking={{ barberId, services: selectedServices, date, time, totalPrice: totals.price, totalDuration: totals.duration, customerName, customerPhone, notes }}
              onChange={(k, v) => { if (k === 'customerName') setCustomerName(v); if (k === 'customerPhone') setCustomerPhone(v); if (k === 'notes') setNotes(v); }} />}
          </>
        )}

        {error && <p style={{ color: 'var(--danger)', fontSize: '0.95rem', marginTop: '1rem', padding: '0.75rem', background: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.14)' }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', direction: 'rtl', position: 'sticky', bottom: 0, background: 'linear-gradient(180deg, rgba(15,17,23,0.02), transparent)', paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
          <button className="btn-ghost" onClick={() => step === 0 ? onClose() : setStep(s => s - 1)} style={{ visibility: step === 0 ? 'hidden' : 'visible', padding: '0.75rem 1rem', fontSize: '0.98rem' }}>
            <ChevronRight size={18} /> رجوع
          </button>
          {!success && (step < 3
            ? <button className="btn-gold" onClick={() => {
                if (canNext()) { setStep(s => s + 1); setError(''); }
                else {
                  if (step === 0) setError('اختر خدمة واحدة على الأقل للمتابعة.');
                  else if (step === 1) setError('اختر الحلاق للمتابعة.');
                  else if (step === 2) setError('اختر تاريخاً ووقتاً صالحين.');
                }
              }} disabled={!canNext()} style={{ padding: '0.85rem 1.2rem', fontSize: '1rem' }}>
                التالي <ChevronLeft size={18} />
              </button>
            : <button className="btn-gold" onClick={handleSubmit} disabled={!canNext() || submitting} style={{ padding: '0.85rem 1.2rem', fontSize: '1rem' }}>
                {submitting ? 'جاري الحجز...' : '✓ تأكيد الحجز'}
              </button>)}
        </div>
      </div>
    </div>
  );
}
