import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';

// ============================================
// Shared form styling + small building blocks
// Used across all sub-forms in CreateHelpRequestForm
// ============================================

// ---------- Section wrapper ----------
interface FormSectionProps {
  Icon: IconType;
  title: string;
  description?: string;
  children: ReactNode;
  accent?: string;
}

export const FormSection = ({
  Icon,
  title,
  description,
  children,
  accent = FUND_THEME.accent,
}: FormSectionProps) => (
  <motion.section
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.4 }}
    style={{
      padding: 'clamp(1.1rem, 3vw, 1.5rem)',
      borderRadius: '18px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      marginBottom: '1.1rem',
      fontFamily: 'Cairo, sans-serif',
    }}
  >
    {/* Header */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: description ? '6px' : '1rem',
      }}
    >
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          backgroundColor: `${accent}15`,
          color: accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={13} />
      </div>
      <h3
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.98rem',
          fontWeight: 800,
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>
    </div>

    {description && (
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.78rem',
          lineHeight: 1.6,
          margin: '0 0 1rem',
          paddingRight: '44px',
        }}
      >
        {description}
      </p>
    )}

    {children}
  </motion.section>
);

// ---------- Label ----------
interface FieldLabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
}

export const FieldLabel = ({
  children,
  htmlFor,
  required,
  hint,
}: FieldLabelProps) => (
  <label
    htmlFor={htmlFor}
    style={{
      display: 'block',
      fontSize: '0.8rem',
      fontWeight: 700,
      color: 'var(--text-secondary)',
      marginBottom: '6px',
      fontFamily: 'Cairo, sans-serif',
      lineHeight: 1.4,
    }}
  >
    {children}
    {required && (
      <span style={{ color: 'var(--error)', marginRight: '4px' }}>*</span>
    )}
    {hint && (
      <span
        style={{
          color: 'var(--text-muted)',
          fontWeight: 500,
          fontSize: '0.72rem',
          marginRight: '6px',
        }}
      >
        ({hint})
      </span>
    )}
  </label>
);

// ---------- Error text ----------
export const FieldError = ({ children }: { children?: ReactNode }) => {
  if (!children) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        color: 'var(--error)',
        fontSize: '0.72rem',
        fontWeight: 700,
        marginTop: '5px',
        fontFamily: 'Cairo, sans-serif',
        lineHeight: 1.5,
      }}
    >
      {children}
    </motion.div>
  );
};

// ---------- Input style object (used directly by inputs) ----------
export const inputStyle = (hasError = false): React.CSSProperties => ({
  width: '100%',
  padding: '10px 13px',
  borderRadius: '11px',
  border: `1px solid ${hasError ? 'var(--error)' : 'var(--border-color)'}`,
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontFamily: 'Cairo, sans-serif',
  fontSize: '0.85rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
});

export const textareaStyle = (hasError = false): React.CSSProperties => ({
  ...inputStyle(hasError),
  resize: 'vertical',
  minHeight: '90px',
  lineHeight: 1.6,
});

// ---------- Character counter ----------
interface CounterProps {
  current: number;
  max: number;
}

export const CharCounter = ({ current, max }: CounterProps) => (
  <div
    style={{
      textAlign: 'left',
      fontSize: '0.65rem',
      color:
        current > max * 0.9 ? 'var(--error)' : 'var(--text-muted)',
      marginTop: '4px',
      opacity: 0.75,
      fontFamily: 'system-ui, sans-serif',
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    {current}/{max}
  </div>
);

// ---------- Two-column grid ----------
interface FieldGridProps {
  children: ReactNode;
  columns?: 1 | 2;
}

export const FieldGrid = ({ children, columns = 2 }: FieldGridProps) => (
  <div
    className="hr-form-grid"
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap: '12px',
    }}
  >
    {children}
    <style>{`
      @media (max-width: 640px) {
        .hr-form-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  </div>
);