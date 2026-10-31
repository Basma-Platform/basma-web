import { COMMUNITY_THEME } from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';

// ============================================
// Section wrapper
// ============================================
interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
}

export const FormSection = ({
  title,
  subtitle,
  icon,
  children,
  required,
}: FormSectionProps) => {
  return (
    <section
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '18px',
        border: '1px solid var(--border-color)',
        padding: '1.5rem',
        marginBottom: '1.25rem',
        transition: 'background-color 0.3s ease',
      }}
    >
      <header style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: subtitle ? '6px' : 0,
          }}
        >
          {icon && (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: COMMUNITY_THEME.accentSoft,
                color: COMMUNITY_THEME.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          )}
          <h3
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {title}
            {required && (
              <span
                style={{
                  color: '#DC3545',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                }}
              >
                *
              </span>
            )}
          </h3>
        </div>
        {subtitle && (
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontFamily: 'Cairo, sans-serif',
              lineHeight: 1.7,
              margin: 0,
              paddingRight: icon ? '42px' : 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </header>

      {children}
    </section>
  );
};

// ============================================
// Field wrapper
// ============================================
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string | string[];
  hint?: string;
  children: React.ReactNode;
}

export const FormField = ({
  label,
  required,
  error,
  hint,
  children,
}: FormFieldProps) => {
  const errorText = Array.isArray(error) ? error[0] : error;

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        style={{
          display: 'block',
          color: 'var(--text-secondary)',
          fontSize: '0.82rem',
          fontWeight: 800,
          fontFamily: 'Cairo, sans-serif',
          marginBottom: '6px',
        }}
      >
        {label}
        {required && (
          <span style={{ color: '#DC3545', marginRight: '4px' }}>*</span>
        )}
      </label>

      {children}

      {hint && !errorText && (
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.7rem',
            fontFamily: 'Cairo, sans-serif',
            marginTop: '5px',
            marginBottom: 0,
            lineHeight: 1.6,
          }}
        >
          {hint}
        </p>
      )}

      {errorText && (
        <p
          style={{
            color: '#DC3545',
            fontSize: '0.72rem',
            fontFamily: 'Cairo, sans-serif',
            marginTop: '5px',
            marginBottom: 0,
            lineHeight: 1.6,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <CommunityIcons.ban size={10} />
          {errorText}
        </p>
      )}
    </div>
  );
};

// ============================================
// Shared input styles
// ============================================
export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '0.88rem',
  fontFamily: 'Cairo, sans-serif',
  color: 'var(--text-primary)',
  backgroundColor: 'var(--bg-input)',
  border: '1px solid var(--border-color)',
  borderRadius: '10px',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

export const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: '120px',
  resize: 'vertical',
  lineHeight: 1.7,
};

export const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

// ============================================
// Error banner
// ============================================
interface FormErrorBannerProps {
  errors: Record<string, string[]>;
}

export const FormErrorBanner = ({ errors }: FormErrorBannerProps) => {
  const entries = Object.entries(errors).filter(
    ([, v]) => Array.isArray(v) && v.length > 0
  );

  if (entries.length === 0) return null;

  return (
    <div
      style={{
        padding: '1rem 1.25rem',
        backgroundColor: 'rgba(220, 53, 69, 0.08)',
        border: '1px solid rgba(220, 53, 69, 0.25)',
        borderRadius: '12px',
        marginBottom: '1.25rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#DC3545',
          fontSize: '0.85rem',
          fontWeight: 800,
          fontFamily: 'Cairo, sans-serif',
          marginBottom: '0.6rem',
        }}
      >
        <CommunityIcons.ban size={14} />
        يرجى تصحيح الأخطاء التالية
      </div>
      <ul
        style={{
          margin: 0,
          paddingRight: '1.2rem',
          color: 'var(--text-primary)',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '0.8rem',
          lineHeight: 1.7,
        }}
      >
        {entries.slice(0, 5).map(([field, messages]) => (
          <li key={field}>{messages[0]}</li>
        ))}
      </ul>
    </div>
  );
};