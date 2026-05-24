import React from 'react';
import Button from './Button';

export default function IconButton({ children, variant = 'ghost', size = 'sm', title, ...rest }) {
  const aria = {};
  if (title) aria['aria-label'] = title;
  return (
    <Button variant={variant} size={size} className="icon-btn" title={title} {...aria} {...rest}>
      {children}
    </Button>
  );
}
