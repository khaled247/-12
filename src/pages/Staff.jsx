import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, UserPlus, Star, Edit2, Trash2, Clock, X } from 'lucide-react';

function BarberModal({ barber, onClose, onSave }) {
  const [formData, setFormData] = useState(
    barber || {
      name: '', specialty: '', rating: 5.0, reviews: 0, color: '#D4AF37', image: '',
      workingHours: { start: 9, end: 21 }, daysOff: []
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: barber?.id || `b_${Date.now()}` });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 500, direction: 'rtl' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{barber ? 'تعديل بيانات الحلاق' : 'إضافة حلاق جديد'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X size={22} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label>اسم الحلاق</label>
            <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          
          <div>
            <label>التخصص</label>
            <input type="text" className="input-field" placeholder="مثال: قصات حديثة، العناية باللحية..." value={formData.specialty} onChange={e => setFormData({ ...formData, specialty: e.target.value })} required />
          </div>

          <div>
            <label>رابط الصورة (اختياري)</label>
            <input type="url" className="input-field" placeholder="https://example.com/image.jpg أو ضع /barber.png" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>بداية الدوام (ساعة 0-24)</label>
              <input type="number" min="0" max="23" className="input-field" value={formData.workingHours.start} onChange={e => setFormData({ ...formData, workingHours: { ...formData.workingHours, start: Number(e.target.value) } })} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>نهاية الدوام (ساعة 0-24)</label>
              <input type="number" min="1" max="24" className="input-field" value={formData.workingHours.end} onChange={e => setFormData({ ...formData, workingHours: { ...formData.workingHours, end: Number(e.target.value) } })} required />
            </div>
          </div>

          <div>
            <label>اللون المميز</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['#D4AF37', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'].map(color => (
                <div key={color} onClick={() => setFormData({ ...formData, color })}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: color, cursor: 'pointer', border: formData.color === color ? '3px solid #fff' : '3px solid transparent', boxShadow: formData.color === color ? '0 0 0 2px var(--gold)' : 'none' }} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-gold" style={{ flex: 1, justifyContent: 'center' }}>حفظ البيانات</button>
            <button type="button" className="btn-ghost" onClick={onClose}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Staff() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [editingBarber, setEditingBarber] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (barber) => {
    if (editingBarber) {
      dispatch({ type: 'UPDATE_BARBER', payload: barber });
    } else {
      dispatch({ type: 'ADD_BARBER', payload: barber });
    }
    setIsModalOpen(false);
    setEditingBarber(null);
  };

  const handleDelete = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا الحلاق؟ سيؤثر هذا على المواعيد المرتبطة به.')) {
      dispatch({ type: 'DELETE_BARBER', payload: id });
    }
  };

  const openNew = () => {
    setEditingBarber(null);
    setIsModalOpen(true);
  };

  const openEdit = (barber) => {
    setEditingBarber(barber);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '2rem', direction: 'rtl' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate(-1)} className="btn-ghost btn-sm" style={{ padding: '0.6rem', borderRadius: '50%' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>فريق العمل</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>إدارة بيانات الحلاقين وأوقات الدوام</p>
          </div>
        </div>
        <button className="btn-gold" onClick={openNew}>
          <UserPlus size={17} /> إضافة حلاق
        </button>
      </div>

      <div className="staff-grid" style={{ gap: '1.5rem', display: 'grid' }}>
        {state.barbers.map((b, i) => (
          <div key={b.id} className="glass animate-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', animationDelay: `${i * 0.08}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: `${b.color}18`, border: `2px solid ${b.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', overflow: 'hidden' }}>
                {b.image ? <img src={b.image} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '💈'}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => openEdit(b)} style={{ background: 'rgba(59,130,246,0.08)', color: 'var(--info)', border: 'none', padding: '0.45rem', borderRadius: 8, cursor: 'pointer' }}>
                  <Edit2 size={15} />
                </button>
                <button onClick={() => handleDelete(b.id)} style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--danger)', border: 'none', padding: '0.45rem', borderRadius: 8, cursor: 'pointer' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.2rem' }}>{b.name}</h3>
            <div style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.5rem' }}>{b.specialty}</div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', fontWeight: 800, fontSize: '1.1rem' }}>
                  <Star size={14} className="gold" fill="currentColor" /> {b.rating}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>التقييم</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{b.reviews}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>المراجعات</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                <Clock size={15} />
                <span>الدوام: {b.workingHours.start}:00 ص - {b.workingHours.end > 12 ? b.workingHours.end - 12 : b.workingHours.end}:00 {b.workingHours.end >= 12 ? 'م' : 'ص'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <BarberModal
          barber={editingBarber}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
