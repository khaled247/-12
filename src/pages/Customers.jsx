import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Users, ArrowLeft, Phone, Calendar, Star } from 'lucide-react';
import { X } from 'lucide-react';
import IconButton from '../components/UI/IconButton';
import EntityGrid from '../components/EntityGrid';

export default function Customers() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [notesMap, setNotesMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customer_notes') || '{}'); } catch { return {}; }
  });

  const saveNotes = (phone, text) => {
    const next = { ...notesMap, [phone]: text };
    setNotesMap(next);
    localStorage.setItem('customer_notes', JSON.stringify(next));
  };

  // Build unique customers from appointments
  const customers = useMemo(() => {
    const map = new Map();
    state.appointments.forEach(apt => {
      const key = apt.customerPhone;
      if (!map.has(key)) {
        map.set(key, { name: apt.customerName, phone: apt.customerPhone, visits: 0, totalSpent: 0, lastVisit: '' });
      }
      const c = map.get(key);
      if (apt.status !== 'cancelled') {
        c.visits++;
        c.totalSpent += apt.totalPrice;
      }
      if (!c.lastVisit || apt.date > c.lastVisit) c.lastVisit = apt.date;
    });
    return Array.from(map.values())
      .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [state.appointments, search]);

  const getMembershipLabel = (visits) => {
    if (visits >= 10) return { label: 'VIP 👑', color: '#d4af37' };
    if (visits >= 5)  return { label: 'ذهبي ⭐', color: '#10b981' };
    return { label: 'عادي', color: 'var(--muted)' };
  };

  const modalRef = useRef(null);
  useEffect(() => {
    if (selected && modalRef.current) modalRef.current.focus();
    const prev = document.activeElement;
    return () => { prev?.focus?.(); };
  }, [selected]);

  return (
    <div style={{ padding: '2rem', direction: 'rtl' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <IconButton onClick={() => navigate(-1)} title="عودة">
            <ArrowLeft size={18} />
          </IconButton>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>العملاء</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{customers.length} عميل مسجّل في النظام</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: 400 }}>
        <Search size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
        <input className="input-field" placeholder="ابحث بالاسم أو رقم الجوال..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingRight: '2.75rem' }} />
      </div>

      {/* Customer Cards */}
      {customers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
          <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
          <p>لا يوجد عملاء مطابقون للبحث</p>
        </div>
      ) : (
        <EntityGrid
          items={customers}
          renderItem={(c, i) => {
            const membership = getMembershipLabel(c.visits);
            return (
              <div className="glass animate-in" style={{ padding: '1.5rem', animationDelay: `${i * 0.05}s`, cursor: 'pointer' }} role="button" tabIndex={0} onClick={() => setSelected(c)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(c); } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(212,175,55,0.08)', border: '1.5px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', fontWeight: 800 }}>
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>{c.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: '0.1rem' }}>{c.phone}</div>
                    </div>
                  </div>
                  <span style={{ color: membership.color, fontWeight: 700, fontSize: '0.8rem' }}>{membership.label}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{c.visits}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: '0.1rem' }}>زيارة</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gold)' }}>—</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: '0.1rem' }}>إجمالي</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{c.lastVisit || '—'}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: '0.1rem' }}>آخر زيارة</div>
                  </div>
                </div>
              </div>
            );
          }}
        />
      )}

      {/* Customer Detail Modal */}
      {selected && (
        <div role="dialog" aria-modal="true" className="glass" style={{ position: 'fixed', inset: 0, margin: 'auto', maxWidth: 920, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', zIndex: 1200 }}>
          <div ref={modalRef} tabIndex={-1} style={{ width: '100%', maxHeight: '96vh', overflow: 'auto', borderRadius: 12, padding: '1rem' }} dir="rtl">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{selected.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{selected.phone}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <a href={`tel:${selected.phone}`} className="btn-gold" aria-label={`اتصال بـ ${selected.name}`}><Phone size={16} />اتصال</a>
                <a href={`sms:${selected.phone}`} className="btn-ghost" aria-label={`إرسال رسالة إلى ${selected.name}`}><Phone size={16} />رسالة</a>
                <IconButton onClick={() => setSelected(null)} aria-label="اغلاق"><X size={16} /></IconButton>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: 10, background: 'rgba(0,0,0,0.12)' }}>
                <div style={{ fontWeight: 800 }}>{selected.visits} زيارة</div>
                <div style={{ color: 'var(--muted)', marginTop: '0.35rem' }}>إجمالي المدفوعات: <strong style={{ color: 'var(--gold)' }}>—</strong></div>
                <div style={{ color: 'var(--muted)', marginTop: '0.35rem' }}>آخر زيارة: {selected.lastVisit || '—'}</div>
              </div>

              <div style={{ padding: '0.6rem', borderRadius: 10, background: 'rgba(0,0,0,0.06)' }}>
                <div style={{ fontWeight: 800, marginBottom: '0.35rem' }}>ملاحظات العميل</div>
                <textarea defaultValue={notesMap[selected.phone] || ''} onBlur={e => saveNotes(selected.phone, e.target.value)} placeholder="أضف ملاحظة سريعة عن العميل..." style={{ width: '100%', minHeight: 100, padding: '0.6rem', borderRadius: 8, background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)' }} />
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.45rem' }}>التغييرات تحفظ تلقائياً عند الخروج من الحقل.</div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.6rem' }}>سجل المواعيد</h3>
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {state.appointments.filter(a => a.customerPhone === selected.phone).sort((a,b)=> b.date.localeCompare(a.date) || b.time.localeCompare(a.time)).map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem', borderRadius: 10, background: 'rgba(0,0,0,0.05)' }}>
                    <div>
                      <div style={{ fontWeight: 800 }}>{a.date} — {a.time}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{a.services.map(id=> (state.services.find(s=>s.id===id)||{name:id}).name).join(', ')}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: 'var(--gold)' }}>{a.totalDuration} د</div>
                      <div style={{ color: a.status === 'cancelled' ? 'var(--danger)' : 'var(--muted)', fontSize: '0.78rem' }}>{a.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
