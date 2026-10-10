import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'default', // 'default' | 'primary' | 'danger' | 'accent' | 'inset'
  size = 'md',        // 'sm' | 'md' | 'lg'
  className = '',
  loading = false,
  disabled = false,
  active = false,
  type = 'button',
  icon = null,
  onClick,
  ...props
}) => {
  const baseClasses = `neo-button neo-button-${variant} neo-button-${size} ${active ? 'is-active' : ''} ${className}`;

  return (
    <button
      type={type}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="neo-spinner" aria-hidden="true" />
      ) : icon ? (
        <span className="neo-button-icon">{icon}</span>
      ) : null}
      <span className="neo-button-text">{children}</span>
    </button>
  );
};
