import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Clock, Globe, Bell, Shield, Smartphone, Palette, ArrowLeft } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', direction: 'rtl' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost btn-sm" style={{ padding: '0.6rem', borderRadius: '50%' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>إعدادات النظام</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>إدارة وتكوين إعدادات الصالون والتطبيق</p>
        </div>
      </div>

      <div className="settings-grid" style={{ display: 'grid', gap: '1.5rem' }}>
        
        {/* General Settings */}
        <div className="glass animate-in" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={20} />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>معلومات الصالون</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label>اسم الصالون</label>
              <input type="text" className="input-field" defaultValue="صدام العالمي" />
            </div>
            <div>
              <label>رقم التواصل الأساسي</label>
              <input type="text" className="input-field" defaultValue="+966 50 123 4567" dir="ltr" />
            </div>
            <div>
              <label>عنوان الصالون</label>
              <textarea className="input-field" rows="2" defaultValue="طريق الملك فهد، الرياض، المملكة العربية السعودية"></textarea>
            </div>
          </div>
          <button className="btn-gold" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>حفظ التعديلات</button>
        </div>

        {/* Operating Hours */}
        <div className="glass animate-in" style={{ padding: '1.75rem', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(59,130,246,0.1)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>ساعات العمل</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['الأحد - الخميس', 'الجمعة', 'السبت'].map((day, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{day}</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="time" className="input-field" style={{ padding: '0.5rem', width: 'auto', background: 'transparent' }} defaultValue={day === 'الجمعة' ? '14:00' : '09:00'} />
                  <span style={{ color: 'var(--muted)' }}>إلى</span>
                  <input type="time" className="input-field" style={{ padding: '0.5rem', width: 'auto', background: 'transparent' }} defaultValue="21:00" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* App Settings */}
        <div className="glass animate-in" style={{ padding: '1.75rem', animationDelay: '0.2s', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={20} />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>إعدادات التطبيق</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { title: 'الإشعارات المباشرة', desc: 'تفعيل إشعارات الحجز الجديد', icon: <Bell size={18} />, active: true },
              { title: 'الوضع الليلي (Dark Mode)', desc: 'تفعيل السمة المظلمة الفاخرة', icon: <Palette size={18} />, active: true },
              { title: 'المصادقة الثنائية (2FA)', desc: 'تأمين لوحة الإدارة', icon: <Shield size={18} />, active: false },
              { title: 'اللغة الافتراضية', desc: 'العربية (RTL)', icon: <Globe size={18} />, active: true }
            ].map((st, i) => (
              <div key={i} style={{ padding: '1.25rem', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ color: st.active ? 'var(--gold)' : 'var(--muted)' }}>{st.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{st.title}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{st.desc}</div>
                </div>
                <div style={{ width: 40, height: 22, borderRadius: 20, background: st.active ? 'var(--gold)' : 'var(--border)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: st.active ? '#000' : '#fff', position: 'absolute', top: 2, left: st.active ? 20 : 2, transition: 'left 0.3s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
