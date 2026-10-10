import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import './Select.css';

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  error,
  hint,
  placeholder = 'Tanlang...',
  id,
  className = '',
  name,
  ...props
}) => {
  const autoId = useId();
  const selectId = id || name || autoId;

  return (
    <div className={`neo-select-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="neo-label">
          {label}
        </label>
      )}
      <div className={`neo-select-wrapper ${error ? 'has-error' : ''}`}>
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          className="neo-select"
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="neo-select-arrow" />
      </div>
      {hint && !error && <span className="neo-hint">{hint}</span>}
      {error && <span className="neo-error">{error}</span>}
    </div>
  );
};
