import React from 'react';
import { useApp } from '../context/AppContext';

export default function MyReceipts(){
  const { auth, getUserReceipts, clearUserReceipts } = useApp();
  const key = auth?.user?.email || auth?.user?.phone || 'guest';
  const receipts = getUserReceipts(key);

  const download = (r) => {
    try {
      const blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${r.id}.json`;
      document.body.appendChild(a);
      a.click();
+      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { console.warn(e); }
  };

  if (!auth?.isAuthenticated) return <div className="page"><h3>سجل الدخول لعرض تأكيدات الحجز</h3></div>;

  return (
    <div className="page">
      <h2>تأكيدات الحجز</h2>
      <p>هنا محفوظات تأكيدات حجزك. يمكنك تنزيل أو الاطلاع على التفاصيل لكل تأكيد.</p>

      {receipts.length === 0 && <div style={{marginTop:12}}>لا توجد تأكيدات محفوظة.</div>}

      <div style={{marginTop:12}}>
        {receipts.map(r => (
          <div key={r.id} style={{border:'1px solid #eee',padding:12,borderRadius:8,marginTop:10}}>
            <div><strong>رقم الحجز:</strong> {r.id}</div>
            <div><strong>الصالون:</strong> {r.salon?.name}</div>
            <div><strong>التاريخ:</strong> {r.date} {r.time || ''}</div>
            <div><strong>الخدمات:</strong> {(r.services || []).join(', ')}</div>
            <div style={{marginTop:8}}>
              <button onClick={() => download(r)}>تنزيل</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:18}}>
        <button onClick={() => { if (confirm('هل تريد مسح كل التأكيدات المحفوظة لهذا الحساب؟')) { clearUserReceipts(key); window.location.reload(); } }}>مسح الكل</button>
      </div>
    </div>
  );
}
