import React from 'react';

export function Input({ label, name, value, onChange, placeholder = '', type = 'text', id, ...rest }) {
  return (
    <label style={{ display: 'block' }}>
      {label && <div style={{ marginBottom: 6, fontWeight: 700, color: 'var(--muted)' }}>{label}</div>}
      <input id={id || name} name={name} value={value || ''} onChange={onChange} placeholder={placeholder} type={type} className="input-field" aria-label={label || name} {...rest} />
    </label>
  );
}

export function Select({ label, name, value, onChange, options = [], placeholder = 'اختر', id, ...rest }) {
  return (
    <label style={{ display: 'block' }}>
      {label && <div style={{ marginBottom: 6, fontWeight: 700, color: 'var(--muted)' }}>{label}</div>}
      <select id={id || name} name={name} value={value || ''} onChange={onChange} className="input-field" aria-label={label || name} {...rest}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value || o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </label>
  );
}

export function TimeInput({ label, name, value, onChange, step = 60, id, ...rest }) {
  return (
    <label style={{ display: 'block' }}>
      {label && <div style={{ marginBottom: 6, fontWeight: 700, color: 'var(--muted)' }}>{label}</div>}
      <input id={id || name} name={name} value={value || ''} onChange={onChange} type="time" step={step} className="input-field" aria-label={label || name} {...rest} />
    </label>
  );
}

export default { Input, Select, TimeInput };
