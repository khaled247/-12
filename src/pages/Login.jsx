import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scissors, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
// Google icon will be rendered via inline SVG (no external library)
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '../firebase';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const OWNER_EMAIL = 'kkooyekk@gmail.com';
  const auth = getAuth(app);
  const { login, auth: ctxAuth } = useApp();

  // Redirect if already authenticated via context
  React.useEffect(() => {
    if (ctxAuth?.isAuthenticated && ctxAuth.role === 'owner') navigate('/admin');
  }, [ctxAuth, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const isOwner = user && user.email === OWNER_EMAIL;
      // save via context
      login({ user, role: isOwner ? 'owner' : 'user' });
      navigate(isOwner ? '/admin' : '/');
    } catch (err) {
      setError('فشل تسجيل الدخول عبر جوجل');
    }
  };

  const handlePasswordReset = async () => {
    if (!username) {
      setError('يرجى إدخال البريد الإلكتروني الخاص بك في حقل اسم المستخدم أولاً.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, username);
      alert('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
    } catch (err) {
      setError('فشل إرسال بريد إعادة التعيين.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, username, password);
      const user = result.user;
      const isOwner = user && user.email === OWNER_EMAIL;
      login({ user, role: isOwner ? 'owner' : 'user' });
      const from = location.state?.from || (isOwner ? '/admin' : '/');
      navigate(from);
    } catch (err) {
      // Handle authentication errors
      let msg = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'تم حظر الحساب مؤقتًا بسبب محاولات فاشلة عديدة.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 70% 20%, rgba(212,175,55,0.07) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(59,130,246,0.04) 0%, transparent 50%), var(--bg)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid lines */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg, rgba(212,175,55,0.015) 0, rgba(212,175,55,0.015) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, rgba(212,175,55,0.015) 0, rgba(212,175,55,0.015) 1px, transparent 1px, transparent 80px)', pointerEvents: 'none' }} />

      {/* Back to store */}
      <button onClick={() => navigate('/')} className="btn-ghost btn-sm" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <ArrowLeft size={16} /> العودة للمتجر
      </button>

      {/* Card */}
      <div className="animate-in" style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(212,175,55,0.08)', border: '1.5px solid rgba(212,175,55,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--gold)' }}>
            <Scissors size={32} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.25rem' }}>صدام العالمي</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>لوحة إدارة الصالون</p>
        </div>

        {/* Form */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.75rem', textAlign: 'center' }}>
            <Lock size={16} style={{ color: 'var(--gold)', marginLeft: '0.4rem' }} />
            تسجيل الدخول
          </h2>

          {error && (
            <div role="alert" aria-live="assertive" style={{ padding: '0.85rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: 'var(--danger)', fontSize: '0.88rem', marginBottom: '1.25rem', textAlign: 'center' }}>
              {error}
            </div>
          )}


          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }} dir="rtl">
            <div>
                <label htmlFor="username" style={{ marginBottom: '0.4rem', display: 'block', fontWeight: 600, color: 'var(--muted)' }}>اسم المستخدم</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
                  <input
                    id="username"
                    type="text"
                    className="input-field"
                    placeholder="admin"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={{ paddingRight: '2.75rem' }}
                    required
                    aria-label="اسم المستخدم"
                    autoComplete="username"
                  />
                </div>
            </div>

            <div>
                <label htmlFor="password" style={{ marginBottom: '0.4rem', display: 'block', fontWeight: 600, color: 'var(--muted)' }}>كلمة المرور</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    className="input-field"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingRight: '2.75rem', paddingLeft: '2.75rem' }}
                    required
                    aria-label="كلمة المرور"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', padding: 0 }}
                    aria-label={showPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
            </div>
                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                  <button type="button" className="link" onClick={handlePasswordReset} disabled={loading} style={{ color: 'var(--info)', background: 'none', border: 'none', padding: 0, fontSize: '0.9rem' }}>
                    نسيت كلمة المرور؟
                  </button>
                </div>
              {/* Google Sign‑In button */}
              <button type="button" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '1rem', fontSize: '1rem', background: 'var(--info)' }} onClick={handleGoogleLogin} disabled={loading} aria-disabled={loading}>
                {loading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 16, height: 16, border: '2px solid #00000040', borderTopColor: '#000', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    جارٍ التحقق...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" width={16} height={16} style={{ marginLeft: '0.5rem' }} aria-hidden="true"><path fill="#4285F4" d="M533 278.4c0-17.6-1.5-35.2-4.6-52.3H272v98.8h146.9c-6.4 34.6-25.2 64-53.7 83.6v69.5h86.7c50.8-46.8 80-115.9 80-199.6z"/><path fill="#34A853" d="M272 544.3c71.9 0 132.2-23.7 176.3-64.5l-86.7-69.5c-24.1 16.2-55 25.6-89.6 25.6-68.9 0-127.2-46.4-148.1-108.9h-89.3v68.4c44.3 86.4 135.9 149.9 237.4 149.9z"/><path fill="#FBBC04" d="M123.9 326.9c-10.4-30.9-10.4-64.2 0-95.1V163.4h-89.3c-40.1 78.1-40.1 171.9 0 250l89.3-69.5z"/><path fill="#EA4335" d="M272 107.3c39.2-.6 76.8 13.9 105.4 40.4l78.8-78.8C418.7 22.5 347.5-1.2 272 0 170.5 0 78.9 63.5 34.6 150l89.3 68.4C144.8 158.6 203.1 112.2 272 107.3z"/></svg> تسجيل الدخول عبر جوجل
                  </>
                )}
              </button>

              {/* Submit button */}
              <button
                type="submit"
                className="btn-gold"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '1rem', fontSize: '1rem' }}
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 16, height: 16, border: '2px solid #00000040', borderTopColor: '#000', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    جارٍ التحقق...
                  </span>
                ) : (
                  'دخول'
                )}
              </button>
              </form>

          {/* Demo credentials removed for production */}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
