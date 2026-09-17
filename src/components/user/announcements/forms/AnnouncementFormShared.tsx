import { motion } from 'framer-motion';
import { FaInfoCircle } from 'react-icons/fa';

// ============================================
// Constants
// ============================================
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 1000;

// ============================================
// FormSection
// ============================================
interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const FormSection = ({ title, icon, children }: FormSectionProps) => (
  <div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '1rem',
        paddingBottom: '10px',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '9px',
          backgroundColor: 'rgba(232,122,32,0.1)',
          color: 'var(--primary-orange)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <h4
        style={{
          fontSize: '0.95rem',
          fontWeight: 800,
          color: 'var(--text-secondary)',
          margin: 0,
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        {title}
      </h4>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {children}
    </div>
  </div>
);

// ============================================
// FieldWrapper
// ============================================
interface FieldWrapperProps {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
  counter?: string;
  children: React.ReactNode;
}

export const FieldWrapper = ({
  label,
  required,
  icon,
  error,
  counter,
  children,
}: FieldWrapperProps) => (
  <div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        marginBottom: '6px',
      }}
    >
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        {icon && <span style={{ color: 'var(--primary-orange)' }}>{icon}</span>}
        {label}
        {required && <span style={{ color: 'var(--error)' }}>*</span>}
      </label>
      {counter && (
        <span
          style={{
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            fontFamily: 'system-ui, sans-serif',
            direction: 'ltr',
            opacity: 0.7,
          }}
        >
          {counter}
        </span>
      )}
    </div>
    {children}
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          marginTop: '6px',
          color: 'var(--error)',
          fontSize: '0.72rem',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <FaInfoCircle size={10} />
        {error}
      </motion.div>
    )}
  </div>
);

// ============================================
// Shared Input Styles
// ============================================
export const inputBaseStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '11px 14px',
  borderRadius: '11px',
  border: `1px solid ${hasError ? 'var(--error)' : 'var(--border-color)'}`,
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontFamily: 'Cairo, sans-serif',
  fontSize: '0.85rem',
  outline: 'none',
  transition: 'all 0.2s ease',
});

// ============================================
// Shared Zod Base Schema
// ============================================
import { z } from 'zod';

export const createAnnouncementBaseSchema = (isVerified: boolean) => {
  const allowedPrivacy = isVerified
    ? (['public', 'region_only', 'verified_only', 'verified_region'] as const)
    : (['public', 'region_only'] as const);

  return z
    .object({
      type: z.enum(['offer', 'request'], {
        errorMap: () => ({ message: 'يجب اختيار نوع الإعلان' }),
      }),
      category: z.enum(['goods', 'services'], {
        errorMap: () => ({ message: 'يجب اختيار الفئة' }),
      }),
      sub_category_id: z
        .number({ invalid_type_error: 'يجب اختيار الفئة الفرعية' })
        .min(1, 'يجب اختيار الفئة الفرعية'),
      title: z
        .string()
        .min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل')
        .max(
          MAX_TITLE_LENGTH,
          `العنوان يجب أن لا يتجاوز ${MAX_TITLE_LENGTH} حرف`
        ),
      description: z
        .string()
        .min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل')
        .max(
          MAX_DESCRIPTION_LENGTH,
          `الوصف يجب أن لا يتجاوز ${MAX_DESCRIPTION_LENGTH} حرف`
        ),
      price_type: z.enum(['free', 'paid', 'barter'], {
        errorMap: () => ({ message: 'يجب اختيار طريقة الدفع' }),
      }),
      price: z
        .preprocess(
          (val) => (val === '' || val === null || Number.isNaN(val) ? undefined : Number(val)),
          z.number().nonnegative().optional().nullable()
        ),
      governorate_id: z
        .number({ invalid_type_error: 'يجب اختيار المحافظة' })
        .min(1, 'يجب اختيار المحافظة'),
      city_id: z
        .number({ invalid_type_error: 'يجب اختيار المدينة' })
        .min(1, 'يجب اختيار المدينة'),
      whatsapp: z
        .string()
        .min(1, 'رقم واتساب مطلوب')
        .regex(
          /^(\+970|\+972)[0-9]{9}$/,
          'رقم واتساب يجب أن يبدأ بـ +970 أو +972 ويحتوي على 9 أرقام'
        ),
      privacy_type: z.enum(allowedPrivacy, {
        errorMap: () => ({ message: 'يجب اختيار نوع الخصوصية' }),
      }),
    })
    .refine(
      (data) => {
        if (data.price_type === 'paid') {
          return (
            data.price !== undefined &&
            data.price !== null &&
            !isNaN(data.price) &&
            data.price >= 0
          );
        }
        return true;
      },
      {
        message: 'السعر مطلوب عند اختيار مدفوع',
        path: ['price'],
      }
    );
};

// ============================================
// Image Validation & Types (Manual)
// ============================================
export interface LocalAnnouncementImage {
  id: string;
  file?: File;
  preview: string;
  existingPath?: string;
  existingId?: number;
}

export const validateImages = (
  images: LocalAnnouncementImage[]
): string | null => {
  if (!images || images.length === 0) {
    return 'يجب رفع صورة واحدة على الأقل';
  }
  if (images.length > 4) {
    return 'يمكنك رفع 4 صور كحد أقصى';
  }
  return null;
};