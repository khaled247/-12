import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Scissors, Clock, Star, Phone, MapPin, MessageCircle, Award, Lock, Sparkles, ShoppingBag } from 'lucide-react';

/* ═══════════════════ LANDING PAGE ═══════════════════ */
export default function LandingPage() {
  const { state, auth, logout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Haircuts');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('royalcuts_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      setProducts([
        { id: 'p1', name: 'زيت اللحية الفاخر', price: 45, stock: 20, description: 'زيت طبيعي 100% لتغذية وتنعيم اللحية.', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
        { id: 'p2', name: 'دهن شعر كلاسيكي', price: 35, stock: 15, description: 'دهن شعر لتثبيت قوي ولمعان طبيعي طوال اليوم.', image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }
      ]);
    }
  }, []);

  const categories = ['Haircuts', 'Beard', 'Treatments', 'Combos'];
  const filteredServices = state.services.filter(s => s.category === activeTab);

  const hours = [
    { day: 'الأحد – الخميس', time: '9:00 ص – 9:00 م' },
    { day: 'الجمعة', time: '2:00 م – 9:00 م' },
    { day: 'السبت', time: '10:00 ص – 9:00 م' },
  ];

  return (
    <div style={{ direction: 'rtl' }}>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        {/* Dynamic glows */}
        <div className="hero-glow" style={{ top: '-10%', right: '10%', background: 'var(--gold)' }} />
        <div className="hero-glow" style={{ bottom: '-10%', left: '0%', background: 'var(--info)', opacity: 0.1 }} />

        {/* Navigation bar */}
        <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
              <Scissors size={20} />
            </div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>صدام العالمي</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {auth?.isAuthenticated ? (
              <>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', color: 'var(--muted)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                    {auth.user?.displayName ? auth.user.displayName.charAt(0) : auth.role === 'owner' ? 'م' : 'ع'}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800 }}>{auth.user?.displayName || (auth.role === 'owner' ? 'المدير' : 'مستخدم')}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{auth.user?.email || ''}</div>
                  </div>
                </div>
                <button className="btn-ghost btn-sm mobile-hidden" onClick={async () => { await logout(); navigate('/'); }}>
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <button className="btn-ghost btn-sm mobile-hidden" onClick={() => navigate('/login')}>
                  <Lock size={14} /> تسجيل الدخول
                </button>
                <button className="btn-gold btn-sm" onClick={() => navigate('/booking')}>
                  احجز الآن
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 10, display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <div className="animate-in" style={{ flex: '1 1 400px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 50, marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--gold)' }}>
              <Sparkles size={14} /> صالون حلاقة فاخر
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem', fontFamily: 'var(--font)' }}>
              فن الحلاقة{' '}
              <span className="shimmer-text">الحديثة</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--muted)', lineHeight: 1.75, maxWidth: 480, marginBottom: '2.5rem' }}>
              ارتقِ بمظهرك مع أفضل الخبراء. نقدم لك تجربة متكاملة تجمع بين الأصالة والتقنيات العصرية.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn-gold" onClick={() => navigate('/booking')} style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
                <Scissors size={18} /> احجز موعدك الآن
              </button>
              <a href="#products" className="btn-ghost" style={{ fontSize: '1.05rem', padding: '1rem 2rem' }}>
                تصفح المنتجات
                              </a>
                <button className="btn-ghost" onClick={() => navigate('/login')} style={{ fontSize: '1.05rem', padding: '1rem 2rem' }}>تسجيل الدخول</button>
            </div>

            {/* Mini Stats */}
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem' }}>
              {[
                { value: '10K+', label: 'عميل سعيد' },
                { value: '4.9', label: 'تقييم عام' },
                { value: '5+', label: 'سنوات خبرة' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--gold)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual - Stunning Image instead of bulky hours card */}
          <div className="animate-in mobile-hidden" style={{ animationDelay: '0.2s', flex: '1 1 350px' }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '120%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.1)' }}>
              <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Luxury Barbershop" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,9,13,0.9), transparent)' }} />
              <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', left: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={24} color="#000" />
                </div>
                <div>
                  <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '1.1rem' }}>الأفضل في الرياض</div>
                  <div style={{ color: '#fff', fontSize: '0.85rem', opacity: 0.8 }}>حسب تقييم العملاء</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRODUCTS GALLERY ═══ */}
      <section id="products" style={{ padding: '5rem 2rem', background: 'linear-gradient(180deg, var(--bg2), var(--bg))' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-in">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 50, marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--gold)' }}>
              <ShoppingBag size={14} /> منتجاتنا الحصرية
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>عناية متكاملة لمنزلك</h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>اكتشف مجموعتنا الفاخرة من زيوت ودهانات الشعر</p>
          </div>

          <div className="horizontal-scroll" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', snapType: 'x mandatory' }}>
            {products.map((p, i) => (
              <div key={p.id} className="glass animate-in" style={{ minWidth: 280, maxWidth: 300, padding: '1.5rem', animationDelay: `${i * 0.1}s`, display: 'flex', flexDirection: 'column', scrollSnapAlign: 'start', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: 200, borderRadius: 12, background: 'var(--bg3)', marginBottom: '1.25rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ShoppingBag size={40} style={{ color: 'var(--muted)', opacity: 0.5 }} />
                  )}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>{p.name}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>{p.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold)' }}>${p.price}</span>
                  <button className="btn-ghost btn-sm" style={{ padding: '0.5rem 1rem', color: 'var(--text)', borderColor: 'var(--border)' }}>شراء الآن</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="services" style={{ padding: '5rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-in">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 50, marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--gold)' }}>
            ✂️ خدماتنا المميزة
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>خدمات فاخرة تليق بك</h2>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: 50,
                border: '1px solid',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.25s',
                background: activeTab === cat ? 'var(--gold)' : 'transparent',
                color: activeTab === cat ? '#000' : 'var(--muted)',
                borderColor: activeTab === cat ? 'var(--gold)' : 'var(--border)',
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Service Grid */}
        <div className="horizontal-scroll" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', snapType: 'x mandatory' }}>
          {filteredServices.map((svc, i) => {
            const defaultImages = {
              'Haircuts': 'https://images.unsplash.com/photo-1599305090598-fe179d501227?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
              'Beard': 'https://images.unsplash.com/photo-1621607512214-68297480165e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
              'Treatments': 'https://images.unsplash.com/photo-1516975080661-46011116c472?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
              'Combos': 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            };
            const imgUrl = svc.image || defaultImages[svc.category] || defaultImages['Haircuts'];

            return (
              <div key={svc.id} className="glass animate-in" style={{ minWidth: 280, maxWidth: 300, padding: '1.5rem', animationDelay: `${i * 0.1}s`, display: 'flex', flexDirection: 'column', scrollSnapAlign: 'start', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: 200, borderRadius: 12, background: 'var(--bg3)', marginBottom: '1.25rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={imgUrl} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="hover-scale" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>{svc.name}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>{svc.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold)' }}>${svc.price}</span>
                  <button className="btn-ghost btn-sm" style={{ padding: '0.5rem 1rem', color: 'var(--text)', borderColor: 'var(--border)', display: 'flex', gap: '0.4rem', alignItems: 'center' }} onClick={() => navigate('/booking')}>
                    <Clock size={14} /> {svc.duration} دقيقة
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ FOOTER & INFO ═══ */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '4rem 2rem 3rem', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
          
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <Scissors size={20} />
              </div>
              <h3 style={{ color: 'var(--text)', fontSize: '1.5rem', fontWeight: 900 }}>صدام العالمي</h3>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              صالون حلاقة فاخر للرجل العصري. تجربة استثنائية تجمع بين الحلاقة الكلاسيكية والعناية الحديثة في كل زيارة.
            </p>
            <button className="btn-gold" onClick={() => navigate('/booking')}>احجز الآن</button>
          </div>

          {/* Working Hours */}
          <div>
            <div style={{ color: 'var(--gold)', fontWeight: 800, marginBottom: '1.25rem', fontSize: '1.1rem' }}>ساعات العمل</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {hours.map(h => (
                <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--border)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--muted)' }}>{h.day}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ color: 'var(--gold)', fontWeight: 800, marginBottom: '1.25rem', fontSize: '1.1rem' }}>تواصل معنا</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={18} className="gold" style={{ marginTop: '0.2rem' }} />
                <span>طريق الملك فهد، حي الملقا<br/>الرياض، المملكة العربية السعودية</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} className="gold" />
                <span dir="ltr">+966 50 123 4567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageCircle size={18} className="gold" />
                <span>@saddam.global</span>
              </div>
            </div>
          </div>

        </div>
        <div style={{ maxWidth: 1200, margin: '3rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} صدام العالمي — جميع الحقوق محفوظة
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--gold)' }} onClick={() => {
              // Simulated PWA install prompt
              alert('في المتصفح: اضغط على "إضافة إلى الشاشة الرئيسية" لتثبيت التطبيق');
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              تثبيت التطبيق
            </span>

            <span style={{ cursor: 'pointer' }} className="hover-gold">الشروط والأحكام</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/966501234567" 
        target="_blank" 
        rel="noreferrer"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: '#25D366',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
          zIndex: 1000,
          transition: 'transform 0.3s'
        }}
        className="hover-scale"
        title="تواصل معنا عبر واتساب"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      </a>

    </div>
  );
}
