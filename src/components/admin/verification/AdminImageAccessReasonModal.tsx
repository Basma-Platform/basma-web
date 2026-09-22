import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FaEye,
  FaTimes,
  FaShieldAlt,
  FaInfoCircle,
  FaLock,
  FaMagic,
  FaCheck,
  FaChevronDown,
  FaFileSignature,
  FaUserCheck,
  FaClock,
} from 'react-icons/fa';

// ============================================
// Zod Schema
// ============================================
const accessReasonSchema = z.object({
  reason: z
    .string()
    .min(5, 'السبب يجب أن يكون 5 أحرف على الأقل')
    .max(255, 'السبب يجب أن لا يتجاوز 255 حرف'),
});

export type AccessReasonFormData = z.infer<typeof accessReasonSchema>;

interface AdminImageAccessReasonModalProps {
  isOpen: boolean;
  userName?: string;
  documentTypeLabel?: string;
  onConfirm: (reason: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// ============================================
// Pre-defined Quick Reasons
// ============================================
interface QuickReason {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const QUICK_REASONS: QuickReason[] = [
  {
    id: 'initial_review',
    label: 'مراجعة أولية للطلب',
    description: 'فحص الوثيقة لأول مرة بعد رفعها من المستخدم',
    icon: <FaEye size={13} />,
  },
  {
    id: 'name_matching',
    label: 'التحقق من مطابقة الاسم',
    description: 'التأكد من تطابق الاسم في الوثيقة مع بيانات الحساب',
    icon: <FaUserCheck size={13} />,
  },
  {
    id: 'image_quality',
    label: 'التحقق من وضوح الصورة',
    description: 'فحص جودة الصورة ومدى إمكانية قراءة البيانات',
    icon: <FaFileSignature size={13} />,
  },
  {
    id: 'data_matching',
    label: 'التحقق من تطابق البيانات',
    description: 'مطابقة رقم الوثيقة وتاريخ الميلاد مع المعلومات المسجلة',
    icon: <FaShieldAlt size={13} />,
  },
  {
    id: 'expiry_check',
    label: 'التحقق من صلاحية الوثيقة',
    description: 'التأكد من أن الوثيقة سارية الصلاحية ولم تنتهِ',
    icon: <FaClock size={13} />,
  },
  {
    id: 'final_review',
    label: 'مراجعة نهائية قبل القرار',
    description: 'فحص نهائي قبل اتخاذ قرار الموافقة أو الرفض',
    icon: <FaCheck size={13} />,
  },
];

// ============================================
// Component
// ============================================
const AdminImageAccessReasonModal = ({
  isOpen,
  userName,
  documentTypeLabel,
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminImageAccessReasonModalProps) => {
  const [showQuickReasons, setShowQuickReasons] = useState(false);
  const quickReasonsRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ============================================
  // React Hook Form
  // ============================================
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccessReasonFormData>({
    resolver: zodResolver(accessReasonSchema),
    defaultValues: { reason: '' },
  });

  const reasonValue = watch('reason') || '';
  const busy = isSubmitting || isLoading;

  // ============================================
  // Reset on open
  // ============================================
  useEffect(() => {
    if (isOpen) {
      reset({ reason: '' });
      setShowQuickReasons(false);
    }
  }, [isOpen, reset]);

  // ============================================
  // Close dropdown on outside click
  // ============================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        quickReasonsRef.current &&
        !quickReasonsRef.current.contains(event.target as Node)
      ) {
        setShowQuickReasons(false);
      }
    };

    if (showQuickReasons) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQuickReasons]);

  // ============================================
  // Escape key
  // ============================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !busy) handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, busy]);

  // ============================================
  // Handlers
  // ============================================
  const handleClose = () => {
    if (busy) return;
    reset({ reason: '' });
    setShowQuickReasons(false);
    onCancel();
  };

  const handleSelectQuickReason = (quickReason: QuickReason) => {
    setValue('reason', quickReason.label, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setShowQuickReasons(false);
    // Focus the textarea so user can add details if needed
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);
  };

  const handleClearReason = () => {
    setValue('reason', '', {
      shouldValidate: false,
      shouldDirty: true,
    });
    textareaRef.current?.focus();
  };

  const handleFormSubmit = async (data: AccessReasonFormData) => {
    try {
      await onConfirm(data.reason.trim());
      reset({ reason: '' });
    } catch {
      // Error handled by parent
    }
  };

  // ============================================
  // Check if a quick reason is currently selected
  // ============================================
  const selectedQuickReason = QUICK_REASONS.find(
    (qr) => qr.label === reasonValue
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 99998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            fontFamily: 'Cairo, sans-serif',
          }}
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
              overflow: 'hidden',
              position: 'relative',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ============================================ */}
            {/* Close Button */}
            {/* ============================================ */}
            <button
              type="button"
              onClick={handleClose}
              disabled={busy}
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0.04)',
                color: 'var(--text-muted)',
                cursor: busy ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                opacity: busy ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (busy) return;
                e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.1)';
                e.currentTarget.style.color = '#DC3545';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
              aria-label="إغلاق"
            >
              <FaTimes size={12} />
            </button>

            {/* ============================================ */}
            {/* Content */}
            {/* ============================================ */}
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
              <div
                style={{
                  padding: '1.75rem 1.5rem 1.25rem',
                  overflowY: 'auto',
                  flex: 1,
                }}
              >
                {/* ============================================ */}
                {/* Header Icon */}
                {/* ============================================ */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 18,
                      delay: 0.1,
                    }}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, rgba(232,122,32,0.15), rgba(232,122,32,0.06))',
                      border: '2px solid rgba(232,122,32,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <FaEye size={28} color="var(--primary-orange)" />
                    <motion.span
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                      style={{
                        position: 'absolute',
                        inset: -4,
                        borderRadius: '50%',
                        border: '2px solid var(--primary-orange)',
                        pointerEvents: 'none',
                      }}
                    />
                  </motion.div>
                </div>

                {/* ============================================ */}
                {/* Title */}
                {/* ============================================ */}
                <h3
                  style={{
                    textAlign: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    color: 'var(--text-secondary)',
                    margin: '0 0 8px',
                  }}
                >
                  سبب مشاهدة الصورة
                </h3>

                {/* ============================================ */}
                {/* Description */}
                {/* ============================================ */}
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.7,
                    margin: '0 0 1.25rem',
                  }}
                >
                  {userName ? (
                    <>
                      أنت على وشك عرض الوثيقة الخاصة بـ{' '}
                      <strong style={{ color: 'var(--text-secondary)' }}>
                        "{userName}"
                      </strong>
                      {documentTypeLabel && (
                        <>
                          {' '}
                          —{' '}
                          <span style={{ color: 'var(--primary-orange)' }}>
                            {documentTypeLabel}
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    'يجب تسجيل سبب مشاهدة الصورة قبل العرض'
                  )}
                </p>

                {/* ============================================ */}
                {/* Security Notice */}
                {/* ============================================ */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(23,162,184,0.06)',
                    border: '1px solid rgba(23,162,184,0.2)',
                    borderRadius: '10px',
                    marginBottom: '1rem',
                  }}
                >
                  <FaShieldAlt
                    size={12}
                    color="#17A2B8"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.55,
                    }}
                  >
                    سيتم تسجيل اسمك، وقت الوصول، عنوان IP، والسبب في{' '}
                    <strong>سجل الأمان</strong>.
                  </div>
                </div>

                {/* ============================================ */}
                {/* Quick Reasons Dropdown */}
                {/* ============================================ */}
                <div
                  ref={quickReasonsRef}
                  style={{
                    position: 'relative',
                    marginBottom: '1rem',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      marginBottom: '6px',
                    }}
                  >
                    <FaMagic size={10} color="var(--primary-orange)" />
                    اختر سبباً جاهزاً
                  </label>

                  <motion.button
                    type="button"
                    onClick={() => !busy && setShowQuickReasons((v) => !v)}
                    disabled={busy}
                    whileHover={!busy ? { scale: 1.01 } : {}}
                    whileTap={!busy ? { scale: 0.99 } : {}}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '11px',
                      border: `1.5px solid ${
                        showQuickReasons
                          ? 'var(--primary-orange)'
                          : 'var(--border-color)'
                      }`,
                      backgroundColor: selectedQuickReason
                        ? 'rgba(232,122,32,0.08)'
                        : 'var(--bg-input)',
                      color: selectedQuickReason
                        ? 'var(--primary-orange)'
                        : 'var(--text-secondary)',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: busy ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      transition: 'all 0.2s ease',
                      opacity: busy ? 0.6 : 1,
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      {selectedQuickReason ? (
                        <>
                          <span
                            style={{
                              display: 'inline-flex',
                              color: 'var(--primary-orange)',
                            }}
                          >
                            {selectedQuickReason.icon}
                          </span>
                          <span
                            style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {selectedQuickReason.label}
                          </span>
                        </>
                      ) : (
                        <>
                          <FaMagic
                            size={12}
                            style={{ color: 'var(--primary-orange)' }}
                          />
                          <span>اختر من القوالب الجاهزة...</span>
                        </>
                      )}
                    </span>

                    <motion.span
                      animate={{ rotate: showQuickReasons ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: 'inline-flex',
                        opacity: 0.6,
                        flexShrink: 0,
                      }}
                    >
                      <FaChevronDown size={11} />
                    </motion.span>
                  </motion.button>

                  {/* ============================================ */}
                  {/* Dropdown Menu */}
                  {/* ============================================ */}
                  <AnimatePresence>
                    {showQuickReasons && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          right: 0,
                          left: 0,
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '14px',
                          boxShadow: '0 12px 40px var(--shadow-md)',
                          padding: '6px',
                          zIndex: 50,
                          maxHeight: '320px',
                          overflowY: 'auto',
                        }}
                      >
                        {QUICK_REASONS.map((qr) => {
                          const isSelected = reasonValue === qr.label;
                          return (
                            <motion.button
                              key={qr.id}
                              type="button"
                              onClick={() => handleSelectQuickReason(qr)}
                              whileHover={{ x: -2 }}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                padding: '10px 12px',
                                borderRadius: '10px',
                                border: 'none',
                                backgroundColor: isSelected
                                  ? 'rgba(232,122,32,0.08)'
                                  : 'transparent',
                                color: isSelected
                                  ? 'var(--primary-orange)'
                                  : 'var(--text-secondary)',
                                fontFamily: 'Cairo, sans-serif',
                                cursor: 'pointer',
                                textAlign: 'right',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor =
                                    'rgba(232,122,32,0.05)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor =
                                    'transparent';
                                }
                              }}
                            >
                              <div
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '8px',
                                  backgroundColor: isSelected
                                    ? 'rgba(232,122,32,0.15)'
                                    : 'var(--bg-input)',
                                  color: isSelected
                                    ? 'var(--primary-orange)'
                                    : 'var(--text-muted)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                {qr.icon}
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    marginBottom: '3px',
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {qr.label}
                                </div>
                                <div
                                  style={{
                                    fontSize: '0.68rem',
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {qr.description}
                                </div>
                              </div>

                              {isSelected && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 20,
                                  }}
                                  style={{
                                    display: 'inline-flex',
                                    color: 'var(--primary-orange)',
                                    flexShrink: 0,
                                    marginTop: '4px',
                                  }}
                                >
                                  <FaCheck size={12} />
                                </motion.span>
                              )}
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ============================================ */}
                {/* Reason Textarea */}
                {/* ============================================ */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '6px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <FaFileSignature
                        size={11}
                        color="var(--primary-orange)"
                      />
                      السبب (تفاصيل إضافية)
                      <span style={{ color: 'var(--error)' }}>*</span>
                    </label>

                    {reasonValue && (
                      <button
                        type="button"
                        onClick={handleClearReason}
                        disabled={busy}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(220,53,69,0.3)',
                          backgroundColor: 'rgba(220,53,69,0.06)',
                          color: '#DC3545',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          cursor: busy ? 'not-allowed' : 'pointer',
                          fontFamily: 'Cairo, sans-serif',
                          opacity: busy ? 0.5 : 1,
                        }}
                      >
                        <FaTimes size={9} />
                        مسح
                      </button>
                    )}
                  </div>

                  <textarea
                    {...register('reason')}
                    ref={(e) => {
                      register('reason').ref(e);
                      textareaRef.current = e;
                    }}
                    disabled={busy}
                    placeholder="مثلاً: التحقق من مطابقة الاسم مع الحساب..."
                    rows={3}
                    maxLength={255}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: `1px solid ${
                        errors.reason ? 'var(--error)' : 'var(--border-color)'
                      }`,
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.82rem',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                      lineHeight: 1.6,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        'var(--primary-orange)';
                      e.currentTarget.style.boxShadow =
                        '0 0 0 3px rgba(232,122,32,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.reason
                        ? 'var(--error)'
                        : 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />

                  {/* Error + Counter */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '6px',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {errors.reason ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          color: 'var(--error)',
                          fontSize: '0.7rem',
                        }}
                      >
                        <FaInfoCircle size={10} />
                        {errors.reason.message}
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: '0.68rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        5 - 255 حرف
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        opacity: 0.7,
                        fontFamily: 'system-ui, sans-serif',
                        direction: 'ltr',
                      }}
                    >
                      {reasonValue.length}/255
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================ */}
              {/* Actions Footer */}
              {/* ============================================ */}
              <div
                style={{
                  padding: '1rem 1.5rem 1.25rem',
                  display: 'flex',
                  gap: '10px',
                  borderTop: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  flexWrap: 'wrap',
                }}
              >
                <motion.button
                  type="button"
                  onClick={handleClose}
                  disabled={busy}
                  whileHover={!busy ? { scale: 1.02 } : {}}
                  whileTap={!busy ? { scale: 0.97 } : {}}
                  style={{
                    flex: '1 1 0',
                    minWidth: '100px',
                    padding: '11px 16px',
                    borderRadius: '11px',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: busy ? 'not-allowed' : 'pointer',
                    opacity: busy ? 0.5 : 1,
                  }}
                >
                  إلغاء
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={busy}
                  whileHover={!busy ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!busy ? { scale: 0.97 } : {}}
                  style={{
                    flex: '1 1 160px',
                    minWidth: '160px',
                    padding: '11px 16px',
                    borderRadius: '11px',
                    border: 'none',
                    background: busy
                      ? 'var(--primary-brown-light)'
                      : 'linear-gradient(135deg, #E87A20, #F5A623)',
                    color: '#FFFFFF',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: busy ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    boxShadow: busy
                      ? 'none'
                      : '0 4px 16px rgba(232,122,32,0.35)',
                    opacity: busy ? 0.7 : 1,
                  }}
                >
                  {busy ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        style={{ width: '13px', height: '13px' }}
                      />
                      جاري التسجيل...
                    </>
                  ) : (
                    <>
                      <FaLock size={12} />
                      تسجيل السبب وعرض الصورة
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminImageAccessReasonModal;