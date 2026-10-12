import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'gradient', 'outline', 'danger', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  loading = false,
  disabled = false,
  icon = null,
  type = 'button',
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  let variantClass = 'btn-primary';
  if (variant === 'gradient') variantClass = 'btn-gradient';
  else if (variant === 'outline') variantClass = 'btn-outline';
  else if (variant === 'danger') variantClass = 'btn-danger';
  else if (variant === 'ghost') variantClass = 'btn-ghost';

  let sizeClass = '';
  if (size === 'sm') sizeClass = 'btn-sm';
  else if (size === 'lg') sizeClass = 'btn-lg';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
          {children}
        </>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};
