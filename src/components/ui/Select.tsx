import { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: React.ReactNode;
  options: { value: string; label: string }[];
  error?: string;
  darkMode?: boolean;
  required?: boolean;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, icon, options, error, darkMode, required, placeholder = 'اختر', ...props }, ref) => {
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
        <select
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
            cursor: props.disabled ? 'not-allowed' : 'pointer',
            opacity: props.disabled ? 0.6 : 1,
          }}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '4px', fontFamily: 'Cairo, sans-serif' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;