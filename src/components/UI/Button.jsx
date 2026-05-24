import React from 'react';
export default function Button({ children, variant = 'ghost', size = 'md', className = '', ...rest }) {
  const base = 'btn';
  const variants = {
    ghost: 'btn-ghost',
    gold: 'btn-gold',
    danger: 'btn-danger'
  };
  const sizes = { sm: 'btn-sm', md: '', lg: 'btn-lg' };
  const classes = [base, variants[variant] || variants.ghost, sizes[size] || '', className].filter(Boolean).join(' ');
  return (
    <button type={rest.type || 'button'} className={classes} {...rest}>
      {children}
    </button>
  );
}
