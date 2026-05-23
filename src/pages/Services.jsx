import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ImageUploader from '../components/ImageUploader';
import { ArrowLeft, Plus, Store, X, Edit2, Trash2, Clock, Scissors } from 'lucide-react';


function ServiceModal({ service, onClose, onSave, categories }) {
  const [formData, setFormData] = useState(
    service || { name: '', category: categories[0], price: 0, duration: 30, description: '', icon: '✂️', image: '' }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: service?.id || `s_${Date.now()}` });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 500, direction: 'rtl' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{service ? 'تعديل الخدمة' : 'خدمة جديدة'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X size={22} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>اسم الخدمة</label>
              <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div style={{ width: 80 }}>
              <label>الأيقونة</label>
              <input type="text" className="input-field" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} required style={{ textAlign: 'center' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>التصنيف</label>
              <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <ImageUploader image={formData.image} onChange={img => setFormData(prev => ({ ...prev, image: img }))} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>السعر ($)</label>
              <input type="number" min="0" className="input-field" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>المدة (دقيقة)</label>
              <input type="number" min="5" step="5" className="input-field" value={formData.duration} onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })} required />
            </div>
          </div>

          <div>
            <label>الوصف</label>
            <textarea className="input-field" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-gold" style={{ flex: 1, justifyContent: 'center' }}>حفظ الخدمة</button>
            <button type="button" className="btn-ghost" onClick={onClose}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Services() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Haircuts');
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['Haircuts', 'Beard', 'Treatments', 'Combos'];
  const filtered = state.services.filter(s => s.category === activeTab);

  const catLabels = { Haircuts: 'قصات الشعر', Beard: 'العناية باللحية', Treatments: 'العلاجات', Combos: 'الباقات' };

  const handleSave = (service) => {
    if (editingService) {
      dispatch({ type: 'UPDATE_SERVICE', payload: service });
    } else {
      dispatch({ type: 'ADD_SERVICE', payload: service });
    }
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleDelete = (id) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      dispatch({ type: 'DELETE_SERVICE', payload: id });
    }
  };

  const openNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openEdit = (svc) => {
    setEditingService(svc);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '2rem', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost btn-sm" style={{ padding: '0.6rem', borderRadius: '50%' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>الخدمات والأسعار</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>إدارة خدمات وأسعار الصالون</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate('/')} className="btn-ghost" style={{ background: 'linear-gradient(135deg, var(--gold), #c5981f)', color: '#000', border: 'none', padding: '0.6rem 1rem', borderRadius: 12 }}>
            <Store size={16} /> الصفحة الرئيسية
          </button>
          <button className="btn-gold" onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Plus size={16} /> خدمة جديدة
          </button>
        </div>
      </div>  {/* Category Tabs */}
<div className="horizontal-scroll" style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
  {categories.map(cat => (
    <button key={cat} onClick={() => setActiveTab(cat)}
      className="nav-link"
      style={{
        background: activeTab === cat ? 'var(--gold)' : 'transparent',
        color: activeTab === cat ? '#000' : 'var(--muted)',
        borderColor: activeTab === cat ? 'var(--gold)' : 'var(--border)',
      }}>
      {catLabels[cat] || cat}
    </button>
  ))}
</div>

      {/* Services Grid */}
        <div className="services-grid">
          {filtered.map((svc, i) => (
            <div key={svc.id} className="glass animate-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', animationDelay: `${i * 0.06}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', overflow: 'hidden' }}>
                {svc.image ? <img src={svc.image} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : svc.icon}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => openEdit(svc)} style={{ background: 'rgba(59,130,246,0.08)', color: 'var(--info)', border: 'none', padding: '0.45rem', borderRadius: 8, cursor: 'pointer' }}>
                  <Edit2 size={15} />
                </button>
                <button onClick={() => handleDelete(svc.id)} style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--danger)', border: 'none', padding: '0.45rem', borderRadius: 8, cursor: 'pointer' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' }}>{svc.name}</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>{svc.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold)' }}>${svc.price}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--muted)', fontSize: '0.82rem' }}>
                <Clock size={14} /> {svc.duration} دقيقة
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <Scissors size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>لا توجد خدمات في هذا القسم</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ServiceModal
          service={editingService}
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
