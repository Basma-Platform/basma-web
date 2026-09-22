import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FaUser,
  FaIdCard,
  FaCalendarAlt,
  FaSave,
  FaChevronDown,
  FaCheckCircle,
  FaInfoCircle,
  FaMagic,
} from 'react-icons/fa';
import type { ExtractedData } from '../../../types';

// ============================================
// Zod Schema
// ============================================
const extractDataSchema = z.object({
  full_name: z
    .string()
    .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
    .max(100, 'الاسم يجب أن لا يتجاوز 100 حرف'),
  id_number: z
    .string()
    .min(3, 'رقم الهوية مطلوب')
    .max(50, 'رقم الهوية يجب أن لا يتجاوز 50 حرف'),
  date_of_birth: z.string().optional().or(z.literal('')),
  expiry_date: z.string().optional().or(z.literal('')),
});

export type ExtractDataFormData = z.infer<typeof extractDataSchema>;

interface AdminExtractDataFormProps {
  initialData?: ExtractedData | null;
  extractedAt?: string | null;
  extractedByName?: string | null;
  suggestedName?: string;
  onSubmit: (data: ExtractDataFormData) => Promise<void>;
  isLoading?: boolean;
  defaultOpen?: boolean;
}

const AdminExtractDataForm = ({
  initialData,
  extractedAt,
  extractedByName,
  suggestedName,
  onSubmit,
  isLoading = false,
  defaultOpen = false,
}: AdminExtractDataFormProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || !extractedAt);

  // ============================================
  // React Hook Form
  // ============================================
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ExtractDataFormData>({
    resolver: zodResolver(extractDataSchema),
    defaultValues: {
      full_name: initialData?.full_name || suggestedName || '',
      id_number: initialData?.id_number || '',
      date_of_birth: initialData?.date_of_birth || '',
      expiry_date: initialData?.expiry_date || '',
    },
  });

  // Sync when initial data changes
  useEffect(() => {
    reset({
      full_name: initialData?.full_name || suggestedName || '',
      id_number: initialData?.id_number || '',
      date_of_birth: initialData?.date_of_birth || '',
      expiry_date: initialData?.expiry_date || '',
    });
  }, [initialData, suggestedName, reset]);

  // ============================================
  // Submit Handler
  // ============================================
  const handleFormSubmit = async (data: ExtractDataFormData) => {
    try {
      const cleanedData: ExtractDataFormData = {
        full_name: data.full_name.trim(),
        id_number: data.id_number.trim(),
        date_of_birth: data.date_of_birth?.trim() || '',
        expiry_date: data.expiry_date?.trim() || '',
      };
      await onSubmit(cleanedData);
    } catch {
      // Error handled by parent
    }
  };

  // ✅ Only track full_name for the "use suggested name" button
  const fullNameValue = watch('full_name');

  // ============================================
  // Shared Styles
  // ============================================
  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    fontFamily: 'Cairo, sans-serif',
    marginBottom: '6px',
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: `1px solid ${hasError ? 'var(--error)' : 'var(--border-color)'}`,
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontFamily: 'Cairo, sans-serif',
    fontSize: '0.82rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  });

  const errorStyle: React.CSSProperties = {
    color: 'var(--error)',
    fontSize: '0.7rem',
    marginTop: '4px',
    fontFamily: 'Cairo, sans-serif',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflow: 'hidden',
        fontFamily: 'Cairo, sans-serif',
        width: '100%',
      }}
      dir="rtl"
    >
      {/* ============================================ */}
      {/* Header (Collapsible) */}
      {/* ============================================ */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        style={{
          width: '100%',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          textAlign: 'right',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(23,162,184,0.3)',
            }}
          >
            <FaIdCard size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h4
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              البيانات المستخرجة من الوثيقة
            </h4>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.68rem',
                marginTop: '2px',
              }}
            >
              {extractedAt ? (
                <>✓ آخر تحديث: {extractedByName || 'مشرف'}</>
              ) : (
                'لم يتم استخراج البيانات بعد'
              )}
            </div>
          </div>
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'inline-flex',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}
        >
          <FaChevronDown size={12} />
        </motion.span>
      </button>

      {/* ============================================ */}
      {/* Form Body */}
      {/* ============================================ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 1.25rem 1.25rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
              }}
            >
              {/* Info Note */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(23,162,184,0.06)',
                  border: '1px solid rgba(23,162,184,0.2)',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.55,
                }}
              >
                <FaInfoCircle
                  size={11}
                  color="#17A2B8"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <span>
                  اكتب البيانات كما تظهر في الوثيقة بالضبط. هذه البيانات
                  ستُحفظ مشفرة ولا تُعرض للعامة.
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* Full Name */}
                  <div>
                    <label style={labelStyle}>
                      <FaUser size={11} color="var(--primary-orange)" />
                      الاسم الكامل (كما في الوثيقة)
                      <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      {...register('full_name')}
                      placeholder="مثلاً: أحمد محمد علي"
                      disabled={isLoading}
                      style={inputStyle(!!errors.full_name)}
                    />
                    {errors.full_name && (
                      <div style={errorStyle}>{errors.full_name.message}</div>
                    )}
                    {suggestedName &&
                      !initialData?.full_name &&
                      fullNameValue !== suggestedName && (
                        <button
                          type="button"
                          onClick={() =>
                            setValue('full_name', suggestedName, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          style={{
                            marginTop: '6px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px dashed var(--primary-orange)',
                            backgroundColor: 'rgba(232,122,32,0.06)',
                            color: 'var(--primary-orange)',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'Cairo, sans-serif',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <FaMagic size={9} />
                          استخدم اسم الحساب: {suggestedName}
                        </button>
                      )}
                  </div>

                  {/* ID Number */}
                  <div>
                    <label style={labelStyle}>
                      <FaIdCard size={11} color="var(--primary-orange)" />
                      رقم الوثيقة
                      <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      {...register('id_number')}
                      placeholder="مثلاً: 912345678"
                      dir="ltr"
                      disabled={isLoading}
                      style={{
                        ...inputStyle(!!errors.id_number),
                        fontFamily: 'system-ui, sans-serif',
                        direction: 'ltr',
                        textAlign: 'left',
                      }}
                    />
                    {errors.id_number && (
                      <div style={errorStyle}>{errors.id_number.message}</div>
                    )}
                  </div>

                  {/* Date of Birth + Expiry */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <label style={labelStyle}>
                        <FaCalendarAlt size={11} color="#17A2B8" />
                        تاريخ الميلاد
                        <span
                          style={{
                            color: 'var(--text-muted)',
                            fontWeight: 500,
                            fontSize: '0.68rem',
                          }}
                        >
                          (اختياري)
                        </span>
                      </label>
                      <input
                        type="date"
                        {...register('date_of_birth')}
                        disabled={isLoading}
                        style={{
                          ...inputStyle(!!errors.date_of_birth),
                          fontFamily: 'system-ui, sans-serif',
                        }}
                      />
                      {errors.date_of_birth && (
                        <div style={errorStyle}>
                          {errors.date_of_birth.message}
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={labelStyle}>
                        <FaCalendarAlt size={11} color="#9C27B0" />
                        تاريخ الانتهاء
                        <span
                          style={{
                            color: 'var(--text-muted)',
                            fontWeight: 500,
                            fontSize: '0.68rem',
                          }}
                        >
                          (اختياري)
                        </span>
                      </label>
                      <input
                        type="date"
                        {...register('expiry_date')}
                        disabled={isLoading}
                        style={{
                          ...inputStyle(!!errors.expiry_date),
                          fontFamily: 'system-ui, sans-serif',
                        }}
                      />
                      {errors.expiry_date && (
                        <div style={errorStyle}>
                          {errors.expiry_date.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                  }}
                >
                  <motion.button
                    type="submit"
                    disabled={isLoading || (!isDirty && extractedAt != null)}
                    whileHover={
                      !isLoading && (isDirty || !extractedAt)
                        ? { scale: 1.01, y: -1 }
                        : {}
                    }
                    whileTap={
                      !isLoading && (isDirty || !extractedAt)
                        ? { scale: 0.98 }
                        : {}
                    }
                    style={{
                      flex: '1 1 180px',
                      padding: '11px 20px',
                      borderRadius: '11px',
                      border: 'none',
                      background:
                        isLoading || (!isDirty && extractedAt != null)
                          ? 'var(--primary-brown-light)'
                          : 'linear-gradient(135deg, #17A2B8, #20C9E0)',
                      color: '#FFFFFF',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor:
                        isLoading || (!isDirty && extractedAt != null)
                          ? 'not-allowed'
                          : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow:
                        isLoading || (!isDirty && extractedAt != null)
                          ? 'none'
                          : '0 4px 16px rgba(23,162,184,0.3)',
                      opacity:
                        isLoading || (!isDirty && extractedAt != null)
                          ? 0.6
                          : 1,
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          style={{ width: '13px', height: '13px' }}
                        />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <FaSave size={13} />
                        {extractedAt ? 'تحديث البيانات' : 'حفظ البيانات'}
                      </>
                    )}
                  </motion.button>

                  {extractedAt && isDirty && (
                    <motion.button
                      type="button"
                      onClick={() => reset()}
                      disabled={isLoading}
                      whileHover={!isLoading ? { scale: 1.01 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                      style={{
                        flex: '0 1 auto',
                        padding: '11px 20px',
                        borderRadius: '11px',
                        border: '1.5px solid var(--border-color)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-muted)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      إلغاء
                    </motion.button>
                  )}
                </div>

                {/* Saved Indicator */}
                {extractedAt && !isDirty && (
                  <div
                    style={{
                      marginTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#28A745',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                    }}
                  >
                    <FaCheckCircle size={11} />
                    البيانات محفوظة ومحدثة
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminExtractDataForm;