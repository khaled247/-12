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
    case 'DELETE_APPOINTMENT':
      return { ...state, appointments: state.appointments.filter(a => a.id !== action.payload) };
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
  });

  // Authentication state (simple client-side wrapper)
  const savedAuth = loadAuth();
  const [auth, setAuth] = useState(savedAuth);

  useEffect(() => {
    localStorage.setItem('royalcuts_auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('royalcuts_state', JSON.stringify(state));
  }, [state]);

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

  const createAppointment = (data) => {
    if (!isSlotAvailable(data.barberId, data.date, data.time, data.totalDuration)) {
      throw new Error('This time slot is already booked. Please choose another time.');
    }
    const newApt = { ...data, id: `a_${Date.now()}`, status: 'confirmed', createdAt: new Date().toISOString() };
    dispatch({ type: 'ADD_APPOINTMENT', payload: newApt });
    return newApt;
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

  const createQueueTicket = ({ customerName, customerPhone, barberId }) => {
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
      // queue/workflow helpers
      completeAppointment, createQueueTicket, sendWhatsApp,
      timeSlots: generateTimeSlots(),
      SLOT_DURATION,
      // auth
      auth,
      login,
      logout,
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
