import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaUnlock,
  FaInfoCircle,
  FaExclamationTriangle,
  FaBolt,
} from 'react-icons/fa';

interface AdminUnlockDataModalProps {
  isOpen: boolean;
  field: 'details' | 'contact' | 'region' | 'all';
  onConfirm: (reason: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const FIELD_LABELS: Record<string, string> = {
  details: 'التفاصيل الشخصية',
  contact: 'معلومات التواصل',
  region: 'العنوان التفصيلي',
  all: 'جميع البيانات الحساسة',
};

const MIN_LENGTH = 5;
const MAX_LENGTH = 500;

// ============================================
// ✅ Quick reason templates — one-click fill.
//    These cover the most common admin reasons.
// ============================================
interface QuickReason {
  label: string;
  text: string;
}

const QUICK_REASONS: QuickReason[] = [
  {
    label: 'مراجعة الطلب',
    text: 'مراجعة الطلب للتحقق من صحته وصحة البيانات المقدمة.',
  },
  {
    label: 'التحقق من الهوية',
    text: 'التحقق من مطابقة الاسم ورقم التواصل مع بيانات المستخدم.',
  },
  {
    label: 'استفسار المتبرع',
    text: 'يوجد متبرع مهتم بالطلب — نحتاج معلومات التواصل لتنسيق المساعدة.',
  },
  {
    label: 'شكوى أو بلاغ',
    text: 'التحقق من بلاغ مقدم بخصوص هذا الطلب.',
  },
  {
    label: 'قبل الموافقة',
    text: 'فحص شامل للبيانات قبل اتخاذ قرار الموافقة على نشر الطلب.',
  },
  {
    label: 'أرشفة الطلب',
    text: 'الحاجة لبيانات التواصل لتوثيق عملية الأرشفة وإبلاغ صاحب الطلب.',
  },
];

const AdminUnlockDataModal = ({
  isOpen,
  field,
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminUnlockDataModalProps) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isLoading) return;
    onCancel();
  };

  const handleConfirm = async () => {
    if (isLoading) return;
    const trimmed = reason.trim();
    if (trimmed.length < MIN_LENGTH) {
      setError(`السبب يجب أن يكون ${MIN_LENGTH} أحرف على الأقل`);
      return;
    }
    setError(null);
    await onConfirm(trimmed);
  };

  const handlePickQuickReason = (text: string) => {
    setReason(text.slice(0, MAX_LENGTH));
    if (error) setError(null);
  };

  const isValid = reason.trim().length >= MIN_LENGTH;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 1090,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            direction: 'rtl',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              position: 'relative',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              aria-label="إغلاق"
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-muted)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              <FaTimes size={12} />
            </button>

            <div
              style={{
                padding: '1.75rem 1.5rem 1.25rem',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 16,
                  delay: 0.1,
                }}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6F42C1, #9C6FD6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  margin: '0 auto 1rem',
                  boxShadow: '0 8px 24px rgba(111,66,193,0.4)',
                }}
              >
                <FaUnlock size={26} />
              </motion.div>

              <h3
                style={{
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  margin: '0 0 8px',
                }}
              >
                فتح البيانات المشفّرة
              </h3>

              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                  margin: '0 0 1.25rem',
                }}
              >
                سيتم فتح:{' '}
                <strong style={{ color: 'var(--text-secondary)' }}>
                  {FIELD_LABELS[field]}
                </strong>
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--notice-warning-bg)',
                  border: '1px solid var(--notice-warning-border)',
                  marginBottom: '1rem',
                }}
              >
                <FaExclamationTriangle
                  size={12}
                  color="var(--notice-warning-text)"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <span
                  style={{
                    color: 'var(--notice-warning-text)',
                    fontSize: '0.75rem',
                    lineHeight: 1.6,
                    fontWeight: 600,
                  }}
                >
                  هذا الوصول سيُسجَّل بشكل دائم في سجل النشاط مع اسمك وIP
                  والسبب.
                </span>
              </div>

              {/* ============================================ */}
              {/* ✅ Quick reasons */}
              {/* ============================================ */}
              <div style={{ marginBottom: '14px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  <FaBolt size={11} color="#FFC107" />
                  أسباب جاهزة (اضغط للاختيار):
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  {QUICK_REASONS.map((r) => {
                    const active = reason.trim() === r.text.trim();
                    return (
                      <button
                        key={r.label}
                        type="button"
                        onClick={() => handlePickQuickReason(r.text)}
                        disabled={isLoading}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          border: `1px solid ${
                            active
                              ? '#6F42C1'
                              : 'var(--border-color)'
                          }`,
                          backgroundColor: active
                            ? 'rgba(111,66,193,0.12)'
                            : 'var(--bg-input)',
                          color: active
                            ? '#6F42C1'
                            : 'var(--text-secondary)',
                          fontFamily: 'Cairo, sans-serif',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                          opacity: isLoading ? 0.5 : 1,
                        }}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reason textarea */}
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                سبب الفتح <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value.slice(0, MAX_LENGTH));
                  if (error) setError(null);
                }}
                disabled={isLoading}
                placeholder="اكتب سبب الفتح، أو اختر من الأسباب الجاهزة بالأعلى..."
                rows={3}
                maxLength={MAX_LENGTH}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${
                    error ? 'var(--error)' : 'var(--border-color)'
                  }`,
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.82rem',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                  lineHeight: 1.5,
                }}
              />

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
                {error ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: 'var(--error)',
                      fontSize: '0.72rem',
                    }}
                  >
                    <FaInfoCircle size={10} />
                    {error}
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    الحد الأدنى: {MIN_LENGTH} أحرف
                  </div>
                )}
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    opacity: 0.7,
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  {reason.length}/{MAX_LENGTH}
                </div>
              </div>
            </div>

            {/* Footer */}
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
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                style={{
                  flex: '1 1 0',
                  minWidth: '100px',
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                إلغاء
              </button>
              <motion.button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading || !isValid}
                whileHover={
                  !isLoading && isValid ? { scale: 1.02, y: -1 } : {}
                }
                whileTap={!isLoading && isValid ? { scale: 0.97 } : {}}
                style={{
                  flex: '1 1 0',
                  minWidth: '140px',
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  background:
                    !isValid || isLoading
                      ? 'var(--btn-disabled-bg)'
                      : 'linear-gradient(135deg, #6F42C1, #9C6FD6)',
                  color:
                    !isValid || isLoading
                      ? 'var(--btn-disabled-text)'
                      : '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor:
                    isLoading || !isValid ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow:
                    !isValid || isLoading
                      ? 'none'
                      : '0 4px 16px rgba(111,66,193,0.4)',
                  opacity: !isValid || isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ width: '13px', height: '13px' }}
                    />
                    جاري الفتح...
                  </>
                ) : (
                  <>
                    <FaUnlock size={12} />
                    تأكيد الفتح
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminUnlockDataModal;