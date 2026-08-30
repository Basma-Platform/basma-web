import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  darkMode?: boolean;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, darkMode, required, className = '', ...props }, ref) => {
    return (
      <div style={{ marginBottom: '1.25rem' }}>
        {label && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: darkMode ? 'var(--text-secondary)' : 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 600,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '6px',
            }}
          >
            {icon}
            {label}
            {required && <span style={{ color: 'var(--error)' }}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: `1px solid ${error ? 'var(--error)' : 'var(--input-border)'}`,
            backgroundColor: darkMode ? 'var(--bg-input)' : 'var(--bg-input)',
            color: darkMode ? 'var(--text-primary)' : 'var(--text-primary)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            outline: 'none',
          }}
          {...props}
        />
        {error && (
          <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '4px', fontFamily: 'Cairo, sans-serif' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;