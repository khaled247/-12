import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Reminders(){
  const { auth, appointments, addUserReminder, removeUserReminder, userReminders } = useApp();
  const [minutes, setMinutes] = useState(30);

  const myAppointments = appointments.filter(a => {
    if (!auth?.user) return false;
    const matchEmail = auth.user.email && a.customerEmail && auth.user.email === a.customerEmail;
    const matchPhone = auth.user.phone && a.customerPhone && auth.user.phone === a.customerPhone;
    return matchEmail || matchPhone;
  });

  return (
    <div className="page">
      <h2>التذكيرات</h2>
      <p>حدد مواعيدك وأضف تذكيراً قبل الموعد بعدد دقائق.</p>

      <div style={{marginTop:16}}>
        <label>دقائق قبل الموعد: </label>
        <input type="number" value={minutes} min={1} onChange={e => setMinutes(Number(e.target.value))} style={{width:80,marginLeft:8}} />
      </div>

      <div style={{marginTop:18}}>
        {myAppointments.length === 0 && <div>لا توجد مواعيد مرتبطة بحسابك.</div>}
        {myAppointments.map(a => (
          <div key={a.id} style={{border:'1px solid #eee',padding:12,marginTop:10,borderRadius:8}}>
            <div><strong>{a.serviceName || 'خدمة'}</strong> — {a.date} {a.time || ''}</div>
            <div style={{marginTop:8}}>
              {userReminders[a.id] ? (
                <>
                  <span>تذكير قبل {userReminders[a.id].minutesBefore} دقيقة</span>
                  <button style={{marginLeft:8}} onClick={() => removeUserReminder(a.id)}>إلغاء</button>
                </>
              ) : (
                <button onClick={() => addUserReminder(a.id, minutes)}>تعيين تذكير</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
