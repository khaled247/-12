import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus, Package, Edit2, Trash2, X } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

function ProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState(
    product || {
      name: '', price: '', description: '', image: '', stock: ''
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: product?.id || `p_${Date.now()}` });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 500, direction: 'rtl' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{product ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X size={22} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label>اسم المنتج (مثال: زيت شعر، دهن عود)</label>
            <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>السعر (ريال)</label>
              <input type="number" className="input-field" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>الكمية المتوفرة</label>
              <input type="number" className="input-field" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} required />
            </div>
          </div>

          <div>
            <label>وصف المنتج</label>
            <textarea className="input-field" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
          </div>

          <div>
            <label>صورة المنتج</label>
            <ImageUploader onChange={(img) => setFormData({ ...formData, image: img })} />
            {formData.image && typeof formData.image === 'string' && formData.image.startsWith('http') && (
              <img src={formData.image} alt="product" style={{ width: 100, marginTop: 10, borderRadius: 8 }} />
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-gold" style={{ flex: 1, justifyContent: 'center' }}>حفظ المنتج</button>
            <button type="button" className="btn-ghost" onClick={onClose}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const navigate = useNavigate();
  // We use local state for products since AppContext doesn't have it yet, 
  // but ideally it should be in context. For now, local state with localStorage.
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('royalcuts_products');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'p1', name: 'زيت اللحية الفاخر', price: 45, stock: 20, description: 'زيت طبيعي 100% لتغذية وتنعيم اللحية.', image: '' },
      { id: 'p2', name: 'دهن شعر كلاسيكي', price: 35, stock: 15, description: 'دهن شعر لتثبيت قوي ولمعان طبيعي طوال اليوم.', image: '' }
    ];
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('royalcuts_products', JSON.stringify(newProducts));
  };

  const handleSave = (prod) => {
    let newProducts;
    if (editingProduct) {
      newProducts = products.map(p => p.id === prod.id ? prod : p);
    } else {
      newProducts = [...products, prod];
    }
    saveProducts(newProducts);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      saveProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div style={{ padding: '2rem', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate(-1)} className="btn-ghost btn-sm" style={{ padding: '0.6rem', borderRadius: '50%' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>المنتجات</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>إدارة زيوت ودهانات الشعر</p>
          </div>
        </div>
        <button className="btn-gold" onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}>
          <Plus size={17} /> إضافة منتج
        </button>
      </div>

      <div className="services-grid">
        {products.map((p, i) => (
          <div key={p.id} className="glass animate-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', animationDelay: `${i * 0.06}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: 14, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', overflow: 'hidden' }}>
                {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={28} className="gold" />}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} style={{ background: 'rgba(59,130,246,0.08)', color: 'var(--info)', border: 'none', padding: '0.45rem', borderRadius: 8, cursor: 'pointer' }}>
                  <Edit2 size={15} />
                </button>
                <button onClick={() => handleDelete(p.id)} style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--danger)', border: 'none', padding: '0.45rem', borderRadius: 8, cursor: 'pointer' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.25rem' }}>{p.name}</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5, flex: 1 }}>{p.description}</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--gold)' }}>{p.price} <span style={{ fontSize: '0.8rem' }}>ريال</span></span>
              <span style={{ fontSize: '0.85rem', color: p.stock > 0 ? 'var(--info)' : 'var(--danger)' }}>
                {p.stock > 0 ? `متوفر: ${p.stock}` : 'نفدت الكمية'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
