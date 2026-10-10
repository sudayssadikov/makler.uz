import React from 'react';
import './Chip.css';

export const Chip = ({
  children,
  icon = null,
  active = false,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      className={`neo-chip-btn ${active ? 'active' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="neo-chip-icon">{icon}</span>}
      <span className="neo-chip-label">{children}</span>
    </button>
  );
};
