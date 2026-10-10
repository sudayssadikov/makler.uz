import React, { useId } from 'react';
import './Input.css';

export const Input = ({
  label,
  error,
  hint,
  icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const autoId = useId();
  const inputId = id || props.name || autoId;

  return (
    <div className={`neo-input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="neo-label">
          {label}
        </label>
      )}
      <div className={`neo-input-wrapper ${error ? 'has-error' : ''}`}>
        {icon && <span className="neo-input-icon">{icon}</span>}
        <input
          id={inputId}
          type={type}
          className={`neo-input ${icon ? 'with-icon' : ''}`}
          {...props}
        />
      </div>
      {hint && !error && <span className="neo-hint">{hint}</span>}
      {error && <span className="neo-error">{error}</span>}
    </div>
  );
};
