import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Simple toast component (lightweight, no external libs)
function Toast({ message, type = 'info', onClose }) {
  const bg = type === 'success' ? 'var(--gold)' : type === 'error' ? 'var(--danger)' : 'var(--bg3)';
  const color = type === 'info' ? 'var(--muted)' : '#000';
  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      background: bg,
      color,
      padding: '0.75rem 1.2rem',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    }}>
      {type === 'success' ? <CheckCircle size={16} /> : type === 'error' ? <XCircle size={16} /> : <Loader size={16} className="spin" />}
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color, marginLeft: '0.5rem', cursor: 'pointer' }}>✕</button>
    </div>
  );
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useApp();
  
  // Get amount and aptId from location state (from Booking)
  const initialAmount = location.state?.amount || '';
  const aptId = location.state?.aptId || null;

  const [amount, setAmount] = useState(initialAmount);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!amount || isNaN(parseFloat(amount))) return false;
    if (cardNumber.replace(/\s+/g, '').length !== 16) return false;
    if (!/^\d{2}\/?\d{2}$/.test(expiry)) return false;
    if (cvc.length !== 3) return false;
    return true;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast({ message: 'الرجاء ملء جميع الحقول بشكل صحيح', type: 'error' });
      return;
    }
    setLoading(true);
    // Simulate payment request – replace with real API call (e.g., Yemeni local gateway)
    try {
      await new Promise(r => setTimeout(r, 1500)); // fake latency
      
      // Update appointment status to confirmed if aptId exists
      if (aptId) {
        dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id: aptId, status: 'confirmed' } });
      }

      setToast({ message: 'تمت العملية بنجاح! 🎉', type: 'success' });
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/'); // Go back home after success
      }, 3000);

    } catch (err) {
      setToast({ message: 'فشل الدفع، حاول مرة أخرى', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', direction: 'rtl', padding: '1rem' }}>
        <div className="glass animate-in" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', maxWidth: 400, width: '100%', borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
          {/* Decorative receipt edge */}
          <div style={{ position: 'absolute', top: -10, left: 0, right: 0, height: 20, background: 'var(--bg)', maskImage: 'radial-gradient(circle 10px at 20px 10px, transparent 0, transparent 10px, black 11px)', maskSize: '40px 20px' }}></div>
          
          <CheckCircle size={54} style={{ color: 'var(--gold)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.5rem' }}>تم تأكيد حجزك!</h2>
          
          <div style={{ background: 'var(--bg2)', padding: '1.5rem', borderRadius: 16, marginBottom: '1.5rem', border: '1px dashed var(--border)' }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>رقم التذكرة الإلكترونية</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.2em', color: 'var(--text)', marginBottom: '1rem' }}>#{Math.floor(Math.random() * 90000) + 10000}</div>
            
            {/* Fake QR Code using a generic placeholder or CSS blocks */}
            <div style={{ width: 120, height: 120, margin: '0 auto', background: '#fff', padding: '0.5rem', borderRadius: 8 }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RoyalCuts_${aptId}`} alt="QR Code" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '1rem' }}>يُرجى إبراز هذا الرمز عند وصولك للصالون</div>
          </div>

          <button onClick={() => navigate('/')} className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', direction: 'rtl', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', maxWidth: '460px', margin: '0 auto 2rem' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost btn-sm" style={{ padding: '0.6rem', borderRadius: '50%' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>دفع الفواتير</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>ادفع عبر الإنترنت بأمان وسهولة</p>
        </div>
      </div>

      <form onSubmit={handlePay} className="payment-form glass" style={{ maxWidth: '460px', margin: '0 auto', padding: '2rem', borderRadius: 16 }}>
        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>المبلغ المطلوب</label>
          <input type="number" className="input-field" placeholder="مثال: 500" value={amount} onChange={e => setAmount(e.target.value)} required disabled={!!initialAmount} style={{ opacity: initialAmount ? 0.7 : 1, fontWeight: 900, color: 'var(--gold)', fontSize: '1.2rem' }} />
        </div>
        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>رقم البطاقة</label>
          <input type="text" className="input-field" placeholder="1234 5678 9012 3456" maxLength={19}
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
            required />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>تاريخ الانتهاء</label>
            <input type="text" className="input-field" placeholder="05/24" maxLength={5}
              value={expiry}
              onChange={e => setExpiry(e.target.value.replace(/[^\d/]/g, '').replace(/(.{2})(?=.)/, '$1/'))}
              required />
          </div>
          <div className="input-group" style={{ width: '90px' }}>
            <label style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>CVC</label>
            <input type="text" className="input-field" placeholder="123" maxLength={3}
              value={cvc}
              onChange={e => setCvc(e.target.value.replace(/\D/g, ''))}
              required />
          </div>
        </div>
        <button type="submit" className="btn-gold" disabled={loading} style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.1rem' }}>
          {loading ? <Loader size={18} className="spin" /> : <CreditCard size={18} />}
          {loading ? 'جارٍ معالجة الدفع...' : 'تأكيد الدفع'}
        </button>
      </form>

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
