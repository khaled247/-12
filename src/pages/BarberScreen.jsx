import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function BarberScreen() {
  const navigate = useNavigate();
  const { state, dispatch, completeAppointment, sendWhatsApp } = useApp();
  const [barberId, setBarberId] = useState(state.barbers[0]?.id || null);
  const today = new Date().toISOString().split('T')[0];

  const [externalAppointments, setExternalAppointments] = useState(state.appointments || []);
  const prevActiveId = useRef(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Real-time updates: prefer WebSocket if provided, otherwise fallback to polling localStorage
  useEffect(() => {
    let ws;
    const POLL_INTERVAL = 1000; // faster polling for shop screen
    const wsUrl = window.__BARBER_WS_URL || null;

    const loadFromStorage = () => {
      try {
        const raw = localStorage.getItem('royalcuts_state');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.appointments)) setExternalAppointments(parsed.appointments);
      } catch (e) {}
    };

    if (wsUrl) {
      try {
        ws = new WebSocket(wsUrl);
        ws.addEventListener('open', () => { /* connected */ });
        ws.addEventListener('message', ev => {
          try {
            const data = JSON.parse(ev.data);
              if (data.type === 'appointments:update' && Array.isArray(data.appointments)) {
                setExternalAppointments(data.appointments);
                setLastUpdated(Date.now());
              }
            // allow servers to push a full state object
            if (data.type === 'state:update' && data.state && Array.isArray(data.state.appointments)) {
              setExternalAppointments(data.state.appointments);
              setLastUpdated(Date.now());
            }
          } catch (e) {}
        });
        ws.addEventListener('close', () => { /* closed */ });
      } catch (e) {
        ws = null;
      }
    }

    const id = ws ? null : setInterval(loadFromStorage, POLL_INTERVAL);
    // initial load
    loadFromStorage();
    window.addEventListener('storage', loadFromStorage);
    return () => {
      if (id) clearInterval(id);
      if (ws) try { ws.close(); } catch (e) {}
      window.removeEventListener('storage', loadFromStorage);
    };
  }, []);

  // determine active/queue from externalAppointments to reflect external updates
  const active = externalAppointments.find(a => a.barberId === barberId && a.status === 'active');
  const queue = externalAppointments
    .filter(a => a.barberId === barberId && a.status !== 'cancelled' && a.status !== 'completed' && a.id !== (active && active.id) && a.date >= today)
    .sort((a, b) => (a.queueNumber || 9999) - (b.queueNumber || 9999) || (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));

  // play beep when active changes (and animate briefly)
  useEffect(() => {
    const curr = active && active.id;
    if (prevActiveId.current && curr && prevActiveId.current !== curr) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = 880;
        g.gain.value = 0.06;
        o.connect(g); g.connect(ctx.destination);
        o.start();
        setTimeout(() => { o.stop(); ctx.close(); }, 250);
      } catch (e) {}
    }
    prevActiveId.current = curr;
  }, [active]);

  // estimated wait time for the queue (minutes)
  const estimatedWait = useMemo(() => {
    const ahead = queue;
    const sum = ahead.reduce((acc, q) => acc + (q.totalDuration || 30), 0);
    return sum; // minutes
  }, [queue]);

  // split queue into two columns for large displays
  const [leftQueue, rightQueue] = useMemo(() => {
    const midpoint = Math.ceil(queue.length / 2);
    return [queue.slice(0, midpoint), queue.slice(midpoint)];
  }, [queue]);

  const handleComplete = () => {
    if (!active) return;
    completeAppointment(active.id);
  };

  const handleActivateNext = () => {
    if (active) {
      // complete the current active; `completeAppointment` will promote next if exists
      completeAppointment(active.id);
      return;
    }
    const next = queue[0];
    if (!next) return;
    dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id: next.id, status: 'active' } });
  };

  const handleNotifyNext = () => {
    const next = queue[1] || queue[0];
    if (!next) return;
    const msg = 'عزيزي العميل، لم يتبقَ أمامك سوى شخص واحد فقط في الطابور، يرجى الاستعداد.';
    sendWhatsApp(next.customerPhone, msg);
  };

  const goFullscreen = async () => {
    try { if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); } catch (e) {}
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#020617,#071026)', color: '#fff', padding: 28, boxSizing: 'border-box', direction: 'rtl', fontFamily: 'Inter, system-ui, Arial' }}>
      <style>{`
        @keyframes pulseBorder { 0% { box-shadow: 0 0 0 0 rgba(212,175,55,0.12); } 70% { box-shadow: 0 0 0 18px rgba(212,175,55,0); } 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); } }
        .active-card { border: 2px solid rgba(212,175,55,0.9); animation: pulseBorder 1.6s ease-out; }
        .queue-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
        @media (min-width: 1200px) { .queue-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 26 }}>لوحة شاشة المحل</div>
          <div style={{ color: '#9fb4d6', fontSize: 13, marginTop: 4 }}>عرض مخصص للشاشة — تحديث تلقائي وعرض الوقت المتوقع</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ color: '#9fb4d6', fontSize: 14, textAlign: 'right' }}>{lastUpdated ? `آخر تحديث: ${new Date(lastUpdated).toLocaleTimeString()}` : ''}</div>
          <select value={barberId || ''} onChange={e => setBarberId(e.target.value)} style={{ padding: '10px 14px', fontSize: 16, borderRadius: 8, background: '#061225', color: '#fff', border: '1px solid #123' }}>
            {state.barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <button className="btn-gold" onClick={goFullscreen} style={{ padding: '10px 14px' }}>شاشة كاملة</button>
          <button className="btn-ghost" onClick={() => navigate(-1)} style={{ padding: '10px 14px' }}>رجوع</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20, alignItems: 'start' }}>
        <div style={{ background: 'linear-gradient(180deg,#071226,#061224)', borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 320 }}>
          <div style={{ fontSize: 15, color: '#9fb4d6', fontWeight: 700 }}>العميل النشط</div>
          {active ? (
            <div className={`active-card`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 22, borderRadius: 12, background: 'linear-gradient(90deg,#081426,#09172a)' }}>
              <div>
                <div style={{ fontSize: 64, fontWeight: 900 }}>{active.customerName}</div>
                <div style={{ fontSize: 22, color: '#cfe6ff', marginTop: 8 }}>{active.customerPhone}</div>
                <div style={{ marginTop: 6, color: '#ffd97a', fontWeight: 800 }}>{active.queueNumber ? `#${active.queueNumber}` : active.time || '—'}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn-gold" onClick={handleComplete} style={{ padding: '14px 24px', fontSize: 20 }}>✓ إتمام</button>
                <button className="btn-ghost" onClick={handleActivateNext} style={{ padding: '12px 18px', fontSize: 16 }}>▶ التالي</button>
                <button className="btn-ghost" onClick={handleNotifyNext} style={{ padding: '12px 18px', fontSize: 16 }}>🔔 تنبيه التالي</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 22, color: '#9fb4d6' }}>لا يوجد عميل نشط حالياً</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn-ghost" onClick={handleActivateNext} style={{ padding: '12px 18px', fontSize: 16 }}>▶ التالي</button>
                <button className="btn-ghost" onClick={handleNotifyNext} style={{ padding: '12px 18px', fontSize: 16 }}>🔔 تنبيه التالي</button>
              </div>
            </div>
          )}

          {estimatedWait > 0 && (
            <div style={{ marginTop: 6, color: '#9fb4d6' }}>الوقت التقديري للانتظار: <strong style={{ color: '#ffd97a' }}>{estimatedWait} دقيقة</strong></div>
          )}
        </div>

        <div style={{ background: 'linear-gradient(180deg,#071226,#061224)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 15, color: '#9fb4d6', marginBottom: 12, fontWeight: 700 }}>قائمة الانتظار</div>
          {queue.length === 0 ? (
            <div style={{ color: '#8aa7c9' }}>لا يوجد عملاء في الطابور</div>
          ) : (
            <div className="queue-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {leftQueue.map((q, i) => (
                  <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#0d1a2a', borderRadius: 10 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{q.customerName}</div>
                      <div style={{ color: '#bcd6f7' }}>{q.customerPhone}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 900 }}>{q.queueNumber ? `#${q.queueNumber}` : q.time || ''}</div>
                      <div style={{ color: '#9fb4d6', fontSize: 13 }}>{q.status === 'confirmed' ? 'محجوز' : 'في الانتظار'}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {rightQueue.map((q, i) => (
                  <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#0d1a2a', borderRadius: 10 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{q.customerName}</div>
                      <div style={{ color: '#bcd6f7' }}>{q.customerPhone}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 900 }}>{q.queueNumber ? `#${q.queueNumber}` : q.time || ''}</div>
                      <div style={{ color: '#9fb4d6', fontSize: 13 }}>{q.status === 'confirmed' ? 'محجوز' : 'في الانتظار'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
