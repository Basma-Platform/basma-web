import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'Cairo, sans-serif',
    fontWeight: 700,
    borderRadius: '12px',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    opacity: disabled || loading ? 0.7 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--primary-orange)',
      color: '#FFFFFF',
      boxShadow: '0 4px 16px rgba(232, 122, 32, 0.3)',
    },
    secondary: {
      backgroundColor: 'var(--primary-brown)',
      color: '#FFFFFF',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary-orange)',
      border: '2px solid var(--primary-orange)',
    },
    danger: {
      backgroundColor: 'var(--error)',
      color: '#FFFFFF',
    },
  };

  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '0.85rem' },
    md: { padding: '12px 24px', fontSize: '1rem' },
    lg: { padding: '16px 32px', fontSize: '1.1rem' },
  };

  return (
    <button
      style={{ ...baseStyles, ...variantStyles[variant], ...sizeStyles[size] }}
      disabled={disabled || loading}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {loading && (
        <span
          className="spinner-border spinner-border-sm"
          style={{ width: '1.2rem', height: '1.2rem' }}
        />
      )}
      {children}
    </button>
  );
};

export default Button;