import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Calendar, CheckCircle, XCircle, Clock, ArrowLeft, Filter } from 'lucide-react';

export default function Appointments() {
  const { state, dispatch, completeAppointment } = useApp();
  const { reorderQueue } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getBarberName = id => state.barbers.find(b => b.id === id)?.name || '—';
  const getServiceNames = ids => ids.map(id => state.services.find(s => s.id === id)?.name).filter(Boolean).join('، ');

  const filtered = useMemo(() => {
    return state.appointments
      .filter(a => filterStatus === 'all' || a.status === filterStatus)
      .filter(a => !search || a.customerName.toLowerCase().includes(search.toLowerCase()) || a.customerPhone.includes(search))
      .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  }, [state.appointments, search, filterStatus]);

  const counts = useMemo(() => ({
    all: state.appointments.length,
    confirmed: state.appointments.filter(a => a.status === 'confirmed').length,
    completed: state.appointments.filter(a => a.status === 'completed').length,
    cancelled: state.appointments.filter(a => a.status === 'cancelled').length,
  }), [state.appointments]);

  const changeStatus = (id, status) => {
    if (status === 'completed') return completeAppointment(id);
    return dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id, status } });
  };
  const deleteApt = id => { if (confirm('هل أنت متأكد من حذف هذا الموعد؟')) dispatch({ type: 'DELETE_APPOINTMENT', payload: id }); };

  const onDragStart = (e, apt) => {
    e.dataTransfer.setData('text/plain', apt.id);
    e.currentTarget.classList.add('dragging');
  };
  const onDragEnd = (e) => { e.currentTarget.classList.remove('dragging'); };
  const onDragOverRow = (e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); };
  const onDragLeaveRow = (e) => { e.currentTarget.classList.remove('drag-over'); };
  const onDropOnRow = (e, targetApt) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === targetApt.id) return;
    // compute ordered ids for same barber & date
    const sameGroup = state.appointments
      .filter(a => a.barberId === targetApt.barberId && a.date === targetApt.date && typeof a.queueNumber === 'number')
      .sort((a,b) => (a.queueNumber || 0) - (b.queueNumber || 0));
    const ids = sameGroup.map(a => a.id).filter(Boolean);
    // remove dragged id if present
    const without = ids.filter(i => i !== draggedId);
    // insert before target index
    const idx = without.indexOf(targetApt.id);
    const next = [...without.slice(0, idx), draggedId, ...without.slice(idx)];
    // call reorder
    reorderQueue(targetApt.barberId, targetApt.date, next);
  };

  const moveToTop = (apt) => {
    const sameGroup = state.appointments
      .filter(a => a.barberId === apt.barberId && a.date === apt.date && typeof a.queueNumber === 'number')
      .sort((a,b) => (a.queueNumber || 0) - (b.queueNumber || 0));
    const ids = sameGroup.map(a => a.id).filter(Boolean).filter(i => i !== apt.id);
    const next = [apt.id, ...ids];
    reorderQueue(apt.barberId, apt.date, next);
  };

  const moveToBottom = (apt) => {
    const sameGroup = state.appointments
      .filter(a => a.barberId === apt.barberId && a.date === apt.date && typeof a.queueNumber === 'number')
      .sort((a,b) => (a.queueNumber || 0) - (b.queueNumber || 0));
    const ids = sameGroup.map(a => a.id).filter(Boolean).filter(i => i !== apt.id);
    const next = [...ids, apt.id];
    reorderQueue(apt.barberId, apt.date, next);
  };

  const statusBadge = (status) => {
    const map = { confirmed: ['badge-confirmed', 'مؤكّد'], completed: ['badge-completed', 'مكتمل'], cancelled: ['badge-cancelled', 'ملغى'] };
    const [cls, label] = map[status] || ['badge-pending', status];
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  const tabs = [
    { key: 'all', label: 'الكل', count: counts.all },
    { key: 'confirmed', label: 'مؤكّدة', count: counts.confirmed },
    { key: 'completed', label: 'مكتملة', count: counts.completed },
    { key: 'cancelled', label: 'ملغاة', count: counts.cancelled },
  ];

  return (
    <div style={{ padding: '2rem', direction: 'rtl' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate(-1)} className="btn-ghost btn-sm" style={{ padding: '0.6rem', borderRadius: '50%' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>إدارة المواعيد</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>تتبع وإدارة جميع حجوزات الصالون</p>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="tabs-row" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setFilterStatus(tab.key)}
            style={{
              padding: '0.55rem 1.25rem', borderRadius: 50, border: '1px solid', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s',
              background: filterStatus === tab.key ? 'var(--gold)' : 'transparent',
              color: filterStatus === tab.key ? '#000' : 'var(--muted)',
              borderColor: filterStatus === tab.key ? 'var(--gold)' : 'var(--border)',
            }}>
            {tab.label}
            <span style={{ marginRight: '0.4rem', fontWeight: 800 }}>({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-row" style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
        <input
          className="input-field"
          placeholder="ابحث باسم العميل أو رقم الجوال..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingRight: '2.75rem' }}
        />
      </div>

      {/* Table */}
      <div className="glass" style={{ padding: '0' }}>
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', color: 'var(--muted)' }}>
            <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>لا توجد مواعيد تطابق البحث</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>العميل</th>
                  <th>التاريخ والوقت</th>
                  <th>الحلاق</th>
                  <th>الخدمات</th>
                  <th>المدة</th>
                  <th>ملاحظة</th>
                  <th>الحالة</th>
                  <th style={{ textAlign: 'right' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(apt => (
                  <tr key={apt.id}
                      draggable={!!apt.queueNumber}
                      onDragStart={apt.queueNumber ? (e) => onDragStart(e, apt) : undefined}
                      onDragEnd={apt.queueNumber ? onDragEnd : undefined}
                      onDragOver={apt.queueNumber ? onDragOverRow : undefined}
                      onDragLeave={apt.queueNumber ? onDragLeaveRow : undefined}
                      onDrop={apt.queueNumber ? (e) => onDropOnRow(e, apt) : undefined}
                      style={apt.queueNumber ? { cursor: 'grab' } : {}}
                  >
                    <td data-label="العميل">
                      <div style={{ fontWeight: 700 }}>{apt.customerName}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{apt.customerPhone}</div>
                    </td>
                    <td data-label="التاريخ والوقت">
                      <div style={{ fontWeight: 600 }}>{apt.date}</div>
                      <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>{apt.time}</div>
                    </td>
                    <td data-label="الحلاق" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{getBarberName(apt.barberId)}</td>
                    <td data-label="الخدمات" style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: 180 }}>{getServiceNames(apt.services)}</td>
                    <td data-label="المدة" style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{apt.totalDuration} د</td>
                    <td data-label="ملاحظة" style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{apt.notes || '—'}</td>
                    <td data-label="الحالة">{statusBadge(apt.status)}</td>
                    <td data-label="إجراء">
                      <div className="actions" style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {apt.status === 'confirmed' && (
                          <button onClick={() => changeStatus(apt.id, 'completed')}
                            style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: 'none', padding: '0.4rem 0.7rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            ✓ أكمل
                          </button>
                        )}
                        {typeof apt.queueNumber === 'number' && (
                          <>
                            <button onClick={() => moveToTop(apt)}
                              style={{ background: 'rgba(59,130,246,0.08)', color: '#2563eb', border: 'none', padding: '0.4rem 0.6rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                              أول
                            </button>
                            <button onClick={() => moveToBottom(apt)}
                              style={{ background: 'rgba(17,24,39,0.06)', color: '#111827', border: 'none', padding: '0.4rem 0.6rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                              آخر
                            </button>
                          </>
                        )}
                        {apt.status !== 'cancelled' && (
                          <button onClick={() => changeStatus(apt.id, 'cancelled')}
                            style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: 'none', padding: '0.4rem 0.6rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            إلغاء
                          </button>
                        )}
                        <button onClick={() => deleteApt(apt.id)}
                          style={{ background: 'rgba(239,68,68,0.06)', color: 'var(--danger)', border: 'none', padding: '0.4rem 0.6rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem' }}>
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
