import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  helperText,
  icon = null,
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '0.85rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            {icon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`form-input ${error ? 'error' : ''}`}
          style={{
            paddingLeft: icon ? '2.5rem' : '0.95rem',
            borderColor: error ? 'var(--danger)' : undefined
          }}
          {...props}
        />
      </div>

      {error && <div className="form-error">{error}</div>}
      {helperText && !error && (
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
          {helperText}
        </div>
      )}
    </div>
  );
};
