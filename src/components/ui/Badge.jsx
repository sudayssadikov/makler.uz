import React from 'react';
import './Badge.css';

export const Badge = ({
  children,
  variant = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'neutral'
  size = 'md',        // 'sm' | 'md'
  icon = null,
  className = ''
}) => {
  return (
    <span className={`neo-badge neo-badge-${variant} neo-badge-${size} ${className}`}>
      {icon && <span className="neo-badge-icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
