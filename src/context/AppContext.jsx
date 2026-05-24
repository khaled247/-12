import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { getAuth as getFirebaseAuth, signOut as firebaseSignOut } from 'firebase/auth';
import { app } from '../firebase';

// ─── Initial Data ───────────────────────────────────────────────────────────
const INITIAL_SERVICES = [
  { id: 's1', category: 'Haircuts', name: 'Classic Haircut', price: 35, duration: 30, description: 'Traditional cut with clippers and scissors, finished with a hot towel.', icon: '✂️', image: '/service.png' },
  { id: 's2', category: 'Haircuts', name: 'Skin Fade', price: 45, duration: 45, description: 'High, mid, or low skin fade tailored to your style preference.', icon: '💈', image: '' },
  { id: 's3', category: 'Haircuts', name: 'Designer Cut', price: 60, duration: 60, description: 'Premium cut with custom styling, texturing, and product finish.', icon: '⚡', image: '' },
  { id: 's4', category: 'Beard', name: 'Beard Trim', price: 25, duration: 20, description: 'Precision trim and shape to define your beard lines perfectly.', icon: '🧔', image: '' },
  { id: 's5', category: 'Beard', name: 'Royal Shave', price: 40, duration: 40, description: 'Classic hot-towel straight razor shave with premium oils.', icon: '👑', image: '' },
  { id: 's6', category: 'Beard', name: 'Beard Design', price: 35, duration: 30, description: 'Custom beard line-up and detailed shaping for a sharp look.', icon: '🎨', image: '' },
  { id: 's7', category: 'Treatments', name: 'Scalp Treatment', price: 30, duration: 25, description: 'Nourishing treatment targeting dandruff and dry scalp.', icon: '🌿', image: '' },
  { id: 's8', category: 'Treatments', name: 'Hair Color', price: 80, duration: 90, description: 'Professional color service with premium products.', icon: '🎨', image: '' },
  { id: 's9', category: 'Combos', name: 'The Royal Combo', price: 75, duration: 75, description: 'Classic Haircut + Royal Shave + Scalp Massage. The ultimate experience.', icon: '👑', image: '' },
  { id: 's10', category: 'Combos', name: 'Sharp Package', price: 55, duration: 60, description: 'Skin Fade + Beard Design. Look sharp from every angle.', icon: '💎', image: '' },
];

const INITIAL_BARBERS = [
  { id: 'b1', name: 'Khaled Masri', specialty: 'Skin Fades & Modern Cuts', rating: 4.9, reviews: 312, color: '#D4AF37', image: '/barber.png', workingHours: { start: 9, end: 20 }, daysOff: [0] },
  { id: 'b2', name: 'Omar Suleiman', specialty: 'Classic Cuts & Royal Shaves', rating: 4.8, reviews: 287, color: '#10b981', image: '', workingHours: { start: 10, end: 21 }, daysOff: [0, 5] },
  { id: 'b3', name: 'Youssef Ramzi', specialty: 'Hair Color & Treatments', rating: 4.7, reviews: 198, color: '#3b82f6', image: '', workingHours: { start: 9, end: 18 }, daysOff: [0, 6] },
];

const SLOT_DURATION = 30; // minutes per slot
const WORK_START = 9; // 9 AM
const WORK_END = 21; // 9 PM

function generateTimeSlots() {
  const slots = [];
  for (let h = WORK_START; h < WORK_END; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

const SAMPLE_APPOINTMENTS = (() => {
  const today = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  return [
    { id: 'a1', customerId: null, customerName: 'Ahmed Ali', customerPhone: '+966501234567', barberId: 'b1', services: ['s1'], date: fmt(today), time: '10:00', totalPrice: 35, totalDuration: 30, status: 'confirmed', notes: '' },
    { id: 'a2', customerId: null, customerName: 'Omar Hassan', customerPhone: '+966512345678', barberId: 'b2', services: ['s9'], date: fmt(today), time: '11:30', totalPrice: 75, totalDuration: 75, status: 'completed', notes: 'Regular customer' },
    { id: 'a3', customerId: null, customerName: 'Mohamed Tarek', customerPhone: '+966523456789', barberId: 'b1', services: ['s2', 's4'], date: fmt(today), time: '14:00', totalPrice: 70, totalDuration: 65, status: 'confirmed', notes: '' },
    { id: 'a4', customerId: null, customerName: 'Karim Said', customerPhone: '+966534567890', barberId: 'b3', services: ['s8'], date: fmt(tomorrow), time: '10:30', totalPrice: 80, totalDuration: 90, status: 'confirmed', notes: '' },
    { id: 'a5', customerId: null, customerName: 'Yassin Ibrahim', customerPhone: '+966545678901', barberId: 'b2', services: ['s10'], date: fmt(tomorrow), time: '15:00', totalPrice: 55, totalDuration: 60, status: 'cancelled', notes: '' },
  ];
})();

// ─── Reducer ─────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT_STATUS':
      return {
        ...state,
        appointments: state.appointments.map(a =>
          a.id === action.payload.id ? { ...a, status: action.payload.status } : a
        )
      };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a => a.id === action.payload.id ? { ...a, ...action.payload } : a)
      };
    case 'DELETE_APPOINTMENT':
      return { ...state, appointments: state.appointments.filter(a => a.id !== action.payload) };
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] };
    case 'UPDATE_SERVICE':
      return { ...state, services: state.services.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SERVICE':
      return { ...state, services: state.services.filter(s => s.id !== action.payload) };
    case 'ADD_BARBER':
      return { ...state, barbers: [...state.barbers, action.payload] };
    case 'UPDATE_BARBER':
      return { ...state, barbers: state.barbers.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'DELETE_BARBER':
      return { ...state, barbers: state.barbers.filter(b => b.id !== action.payload) };
    case 'UPDATE_SALON':
      return { ...state, salon: { ...state.salon, ...action.payload } };
    default:
      return state;
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem('royalcuts_state');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function loadAuth() {
  try {
    const raw = localStorage.getItem('royalcuts_auth');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { isAuthenticated: false, user: null, role: null };
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const saved = loadState();
  const [state, dispatch] = useReducer(appReducer, {
    appointments: saved?.appointments ?? SAMPLE_APPOINTMENTS,
    services: saved?.services ?? INITIAL_SERVICES,
    barbers: saved?.barbers ?? INITIAL_BARBERS,
    salon: saved?.salon ?? { name: 'صدام العالمي', phone: '+966 50 123 4567', address: 'طريق الملك فهد، الرياض، المملكة العربية السعودية', logo: '/logo.png' },
  });

  // Authentication state (simple client-side wrapper)
  const savedAuth = loadAuth();
  const [auth, setAuth] = useState(savedAuth);
  // Toasts state
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = `t_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    setToasts(prev => [...prev, { id, ...toast }]);
    // auto remove
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), (toast.duration || 5500));
  };

  // User reminders (stored per user, simple localStorage)
  const [userReminders, setUserReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('royalcuts_user_reminders') || '{}'); } catch { return {}; }
  });

  const saveUserReminders = (next) => {
    setUserReminders(next);
    try { localStorage.setItem('royalcuts_user_reminders', JSON.stringify(next)); } catch {}
  };

  const addUserReminder = (aptId, minutesBefore) => {
    const next = { ...userReminders, [aptId]: { aptId, minutesBefore } };
    saveUserReminders(next);
  };

  const removeUserReminder = (aptId) => {
    const next = { ...userReminders };
    delete next[aptId];
    saveUserReminders(next);
  };

  useEffect(() => {
    localStorage.setItem('royalcuts_auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('royalcuts_state', JSON.stringify(state));
  }, [state]);

  // --- Local reminders/notifications scheduler ---
  useEffect(() => {
    let notified = [];
    try { notified = JSON.parse(localStorage.getItem('royalcuts_notified') || '[]'); } catch { notified = []; }

    const saveNotified = () => localStorage.setItem('royalcuts_notified', JSON.stringify(notified));

    const showInAppToast = (title, body, opts = {}) => {
      try {
        addToast({ title, body, duration: opts.duration || 5500 });
      } catch (e) { console.warn('toast failed', e); }
    };

    const trySystemNotify = (title, body) => {
      try {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'granted') {
          new Notification(title, { body });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(p => { if (p === 'granted') new Notification(title, { body }); });
        }
      } catch (e) { console.warn('system notify failed', e); }
    };

    const checkReminders = () => {
      if (!auth?.isAuthenticated) return;
      const now = new Date();
      // find appointments for this user
      const userAppointments = state.appointments.filter(a => {
        if (auth.user?.email && a.customerEmail && a.customerEmail === auth.user.email) return true;
        if (auth.user?.phone && a.customerPhone && a.customerPhone === auth.user.phone) return true;
        return false;
      });

      userAppointments.forEach(apt => {
        if (notified.includes(apt.id)) return; // already notified

        // 1) Queue-based reminder: if the appointment has a queueNumber (ticket)
        if (typeof apt.queueNumber === 'number') {
          const before = state.appointments.filter(a => a.barberId === apt.barberId && a.date === apt.date && (a.status === 'active' || a.status === 'pending') && typeof a.queueNumber === 'number' && a.queueNumber < apt.queueNumber).length;
          if (before <= 2) {
            const title = 'تذكير: قرب دورك';
            const body = `تبقى أمامك ${before} شخص${before === 1 ? '' : 'ان'} فقط. استعد.`;
            showInAppToast(title, body);
            trySystemNotify(title, body);
            notified.push(apt.id);
            saveNotified();
          }
          return;
        }

        // 2) Time-based reminder: check user-set reminders first
        const userRem = userReminders[apt.id];
        if (userRem && apt.date && apt.time) {
          const [h, m] = apt.time.split(':').map(Number);
          const aptDate = new Date(apt.date + 'T' + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':00');
          const diffMin = (aptDate - now) / 60000;
          if (diffMin <= userRem.minutesBefore && diffMin >= 0) {
            const title = 'تذكير بموعدك';
            const body = `موعدك بعد ${Math.round(diffMin)} دقيقة. تأكد من الوصول في الوقت.`;
            showInAppToast(title, body);
            trySystemNotify(title, body);
            notified.push(apt.id);
            saveNotified();
          }
        } else if (apt.date && apt.time) {
          const [h, m] = apt.time.split(':').map(Number);
          const aptDate = new Date(apt.date + 'T' + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':00');
          const diffMin = (aptDate - now) / 60000;
          if (diffMin <= 30 && diffMin >= 0) {
            const title = 'تذكير بموعدك';
            const body = `موعدك بعد ${Math.round(diffMin)} دقيقة. تأكد من الوصول في الوقت.`;
            showInAppToast(title, body);
            trySystemNotify(title, body);
            notified.push(apt.id);
            saveNotified();
          }
        }
      });
    };

    // run immediately and then every 30s
    checkReminders();
    const id = setInterval(checkReminders, 30000);
    return () => clearInterval(id);
  }, [state.appointments, auth]);

  // ── Helpers ──
  const getBookedSlots = (barberId, date) => {
    return state.appointments
      .filter(a => a.barberId === barberId && a.date === date && a.status !== 'cancelled')
      .map(a => {
        const slots = [];
        const [h, m] = a.time.split(':').map(Number);
        let total = h * 60 + m;
        const end = total + a.totalDuration;
        while (total < end) {
          slots.push(`${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`);
          total += SLOT_DURATION;
        }
        return slots;
      })
      .flat();
  };

  const isSlotAvailable = (barberId, date, time, duration) => {
    const booked = getBookedSlots(barberId, date);
    const [h, m] = time.split(':').map(Number);
    let t = h * 60 + m;
    const end = t + duration;
    while (t < end) {
      const slot = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
      if (booked.includes(slot)) return false;
      t += SLOT_DURATION;
    }
    return true;
  };

  const isSlotAvailableExcluding = (barberId, date, time, duration, excludeId) => {
    // build booked slots excluding a specific appointment id
    const booked = state.appointments
      .filter(a => a.id !== excludeId && a.barberId === barberId && a.date === date && a.status !== 'cancelled')
      .map(a => {
        const slots = [];
        const [h, m] = (a.time || '').split(':').map(Number);
        if (!a.time) return slots;
        let total = h * 60 + m;
        const end = total + a.totalDuration;
        while (total < end) {
          slots.push(`${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`);
          total += SLOT_DURATION;
        }
        return slots;
      }).flat();

    const [h, m] = time.split(':').map(Number);
    let t = h * 60 + m;
    const end = t + duration;
    while (t < end) {
      const slot = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
      if (booked.includes(slot)) return false;
      t += SLOT_DURATION;
    }
    return true;
  };

  const hasExistingBooking = (customerPhone, customerEmail) => {
    if (!customerPhone && !customerEmail) return false;
    const today = new Date().toISOString().split('T')[0];
    const activeStatuses = ['confirmed', 'active', 'pending'];
    return state.appointments.some(a =>
      activeStatuses.includes(a.status) &&
      a.date >= today &&
      ((customerPhone && a.customerPhone === customerPhone) || (customerEmail && a.customerEmail === customerEmail))
    );
  };

  const createAppointment = (data) => {
    if (hasExistingBooking(data.customerPhone, data.customerEmail)) {
      throw new Error('لديك حجز قائم بالفعل. لا يمكنك حجز أكثر من مرة.');
    }
    if (!isSlotAvailable(data.barberId, data.date, data.time, data.totalDuration)) {
      throw new Error('This time slot is already booked. Please choose another time.');
    }
    const newApt = { ...data, id: `a_${Date.now()}`, status: 'confirmed', createdAt: new Date().toISOString() };
    dispatch({ type: 'ADD_APPOINTMENT', payload: newApt });
    try {
      // Save a client-visible receipt for later lookup
      const raw = localStorage.getItem('royalcuts_receipts');
      const receipts = raw ? JSON.parse(raw) : {};
      const key = auth?.user?.email || auth?.user?.phone || 'guest';
      receipts[key] = receipts[key] || [];
      receipts[key].push({ id: newApt.id, createdAt: newApt.createdAt, barberId: newApt.barberId, date: newApt.date, time: newApt.time, services: newApt.services, totalDuration: newApt.totalDuration, totalPrice: newApt.totalPrice, customerName: newApt.customerName, customerPhone: newApt.customerPhone, notes: newApt.notes, salon: state.salon });
      localStorage.setItem('royalcuts_receipts', JSON.stringify(receipts));
    } catch (e) { console.warn('failed to persist receipt', e); }
    return newApt;
  };

  const updateAppointment = (updated) => {
    try {
      // if appointment includes time & duration, ensure slot is available excluding this appointment
      if (updated.time && updated.totalDuration) {
        const ok = isSlotAvailableExcluding(updated.barberId, updated.date, updated.time, updated.totalDuration, updated.id);
        if (!ok) throw new Error('This time slot is already booked. Please choose another time.');
      }
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: updated });
      // update stored receipt for this user if present
      const raw = localStorage.getItem('royalcuts_receipts');
      const receipts = raw ? JSON.parse(raw) : {};
      const key = auth?.user?.email || auth?.user?.phone || 'guest';
      if (receipts[key]) {
        receipts[key] = receipts[key].map(r => r.id === updated.id ? { ...r, ...updated, salon: state.salon } : r);
        localStorage.setItem('royalcuts_receipts', JSON.stringify(receipts));
      }
    } catch (e) { console.warn('failed to persist updated receipt', e); throw e; }
    return updated;
  };

  // --- Queue and barber workflow helpers ---
  const sendWhatsApp = (phone, message) => {
    try {
      if (!phone) return;
      // clean phone: remove non-digits and leading +
      const clean = phone.replace(/[^0-9]/g, '');
      const url = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } catch (e) {
      console.warn('WhatsApp notification failed', e);
    }
  };

  const completeAppointment = (id) => {
    // mark current as completed
    const current = state.appointments.find(a => a.id === id);
    if (!current) return;
    dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id, status: 'completed' } });
    // find queue tickets (pending) for same barber/date
    const pending = state.appointments
      .filter(a => a.barberId === current.barberId && a.date === current.date && a.status === 'pending' && typeof a.queueNumber === 'number')
      .sort((a, b) => a.queueNumber - b.queueNumber);

    if (pending.length > 0) {
      const next = pending[0];
      dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id: next.id, status: 'active' } });

      // notify the following pending (if any)
      const following = pending.find(p => p.queueNumber > next.queueNumber);
      if (following && following.status === 'pending') {
        const msg = 'عزيزي العميل، لم يتبقَ أمامك سوى شخص واحد فقط في الطابور، يرجى الاستعداد.';
        sendWhatsApp(following.customerPhone, msg);
      }
      return;
    }

    // if no pending queue tickets, try to promote the next confirmed appointment (time-based)
    const confirmedNext = state.appointments
      .filter(a => a.barberId === current.barberId && a.date === current.date && a.status === 'confirmed')
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    if (confirmedNext.length > 0) {
      const next = confirmedNext[0];
      dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id: next.id, status: 'active' } });
      // optionally notify next pending after promoting a confirmed slot
      const afterwardsPending = state.appointments
        .filter(a => a.barberId === current.barberId && a.date === current.date && a.status === 'pending' && typeof a.queueNumber === 'number')
        .sort((a, b) => a.queueNumber - b.queueNumber);
      if (afterwardsPending.length > 0) {
        const following = afterwardsPending[0];
        const msg = 'عزيزي العميل، لم يتبقَ أمامك سوى شخص واحد فقط في الطابور، يرجى الاستعداد.';
        sendWhatsApp(following.customerPhone, msg);
      }
    }
  };

  const createQueueTicket = ({ customerName, customerPhone, customerEmail, barberId }) => {
    if (hasExistingBooking(customerPhone, customerEmail)) {
      throw new Error('لديك حجز قائم بالفعل. لا يمكنك حجز أكثر من مرة.');
    }
    const today = new Date().toISOString().split('T')[0];
    // get last queue number for today
    const todays = state.appointments.filter(a => a.date === today && typeof a.queueNumber === 'number');
    const last = todays.length === 0 ? 0 : Math.max(...todays.map(a => a.queueNumber));
    const nextNum = last + 1;

    // determine status: if no one else waiting or active, make active
    const others = state.appointments.filter(a => a.date === today && (a.status === 'pending' || a.status === 'active'));
    const status = others.length === 0 ? 'active' : 'pending';

    const newTicket = {
      id: `q_${Date.now()}`,
      customerId: null,
      customerName: customerName || 'زبون',
      customerPhone: customerPhone || '',
      customerEmail: customerEmail || null,
      barberId: barberId || (state.barbers[0] && state.barbers[0].id),
      services: [],
      date: today,
      time: '',
      totalPrice: 0,
      totalDuration: 0,
      status,
      createdAt: new Date().toISOString(),
      queueNumber: nextNum,
      notes: '',
    };

    dispatch({ type: 'ADD_APPOINTMENT', payload: newTicket });
    return newTicket;
  };

  // Auth helpers
  const login = ({ user, role }) => {
    setAuth({ isAuthenticated: true, user, role });
    localStorage.setItem('isAuthenticated', 'true');
    if (role) localStorage.setItem('userRole', role);
  };

  // Receipts: store simple confirmations per user so clients can view later
  const getUserReceipts = (userKey) => {
    try {
      const raw = localStorage.getItem('royalcuts_receipts');
      const receipts = raw ? JSON.parse(raw) : {};
      const key = userKey || auth?.user?.email || auth?.user?.phone || 'guest';
      return receipts[key] || [];
    } catch (e) { return []; }
  };

  const clearUserReceipts = (userKey) => {
    try {
      const raw = localStorage.getItem('royalcuts_receipts');
      if (!raw) return;
      const receipts = JSON.parse(raw);
      const key = userKey || auth?.user?.email || auth?.user?.phone || 'guest';
      delete receipts[key];
      localStorage.setItem('royalcuts_receipts', JSON.stringify(receipts));
    } catch (e) { console.warn('clear receipts failed', e); }
  };

  // Reorder queue tickets for a barber on a specific date.
  const reorderQueue = (barberId, date, orderedIds) => {
    try {
      // build a map for quick lookup
      const byId = Object.fromEntries(state.appointments.map(a => [a.id, { ...a }]));
      // assign new queue numbers based on orderedIds (1-based)
      orderedIds.forEach((id, idx) => {
        if (!byId[id]) return;
        byId[id].queueNumber = idx + 1;
        // first becomes active, others pending
        byId[id].status = idx === 0 ? 'active' : 'pending';
        // ensure barberId and date match
        byId[id].barberId = barberId;
        byId[id].date = date;
      });
      // preserve other appointments unchanged
      const nextAppointments = state.appointments.map(a => byId[a.id] || a);
      dispatch({ type: 'SET_APPOINTMENTS', payload: nextAppointments });
    } catch (e) { console.warn('reorderQueue failed', e); }
  };

  const logout = async () => {
    try {
      const fAuth = getFirebaseAuth(app);
      // attempt to sign out from Firebase if used, ignore errors
      await firebaseSignOut(fAuth).catch(() => {});
    } catch (e) {}
    setAuth({ isAuthenticated: false, user: null, role: null });
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  };

  return (
    <AppContext.Provider value={{
      state, dispatch,
      getBookedSlots, isSlotAvailable, createAppointment,
      isSlotAvailableExcluding,
      // queue/workflow helpers
      completeAppointment, createQueueTicket, sendWhatsApp,
      timeSlots: generateTimeSlots(),
      SLOT_DURATION,
      // auth
      auth,
      login,
      logout,
      // toasts & reminders
      toasts,
      addToast,
      userReminders,
      addUserReminder,
      removeUserReminder,
      // receipts
      getUserReceipts,
      clearUserReceipts,
      updateAppointment,
      // queue reorder
      reorderQueue,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
