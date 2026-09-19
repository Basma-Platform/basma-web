import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrash,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
} from 'react-icons/fa';
import StarRating from '../../ratings/StarRating';
import type { Rating } from '../../../types';

const MAX_REASON_LENGTH = 255;
const MIN_REASON_LENGTH = 10;

// اقتراحات مع رسائل إدارية احترافية مفصلة
const QUICK_REASONS = [
  { label: 'بلاغ من مستخدم', message: 'تم حذف التقييم بناءً على بلاغ مستلم من أحد الأعضاء يفيد بمخالفة المحتوى لشروط الاستخدام.' },
  { label: 'محتوى مسيء', message: 'تم إزالة التقييم لاحتوائه على ألفاظ أو تعبيرات خارجة عن آداب الحوار والنشر.' },
  { label: 'سبام', message: 'تم حذف هذا التقييم باعتباره محتوى ترويجي مكرر أو سبام غير مرغوب فيه.' },
  { label: 'أخرى', message: '' },
];

interface AdminDeleteRatingModalProps {
  isOpen: boolean;
  rating: Rating | null;
  onConfirm: (reason?: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const AdminDeleteRatingModal = ({
  isOpen,
  rating,
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminDeleteRatingModalProps) => {
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

  const isReasonValid =
    reason.trim().length === 0 ||
    reason.trim().length >= MIN_REASON_LENGTH;

  const handleConfirm = async () => {
    if (isLoading) return;

    const trimmed = reason.trim();

    if (trimmed.length > 0 && trimmed.length < MIN_REASON_LENGTH) {
      setError(`السبب يجب أن يكون ${MIN_REASON_LENGTH} أحرف على الأقل`);
      return;
    }
    if (trimmed.length > MAX_REASON_LENGTH) {
      setError(`السبب يجب أن لا يتجاوز ${MAX_REASON_LENGTH} حرف`);
      return;
    }

    setError(null);
    await onConfirm(trimmed || undefined);
  };

  const handleQuickReason = (label: string, message: string) => {
    if (label === 'أخرى') {
      setReason('');
      setError(null);
      return;
    }
    setReason(message);
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && rating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 1080,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              position: 'relative',
              direction: 'rtl',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Top glowing accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                height: '4px',
                background: 'linear-gradient(90deg, #DC3545, #ff6b6b, #DC3545)',
                width: '100%',
                transformOrigin: 'right',
              }}
            />

            {/* Close button */}
            <motion.button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(220,53,69,0.1)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'absolute',
                top: '18px',
                left: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-muted)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                opacity: isLoading ? 0.5 : 1,
              }}
              aria-label="إغلاق"
            >
              <FaTimes size={12} />
            </motion.button>

            {/* Modal Body */}
            <div
              style={{
                padding: '1.75rem 1.5rem 1.25rem',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {/* Animated Icon Container */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.05 }}
                style={{ textAlign: 'center', marginBottom: '1rem' }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    margin: '0 auto',
                    borderRadius: '22px',
                    background:
                      'linear-gradient(135deg, rgba(220,53,69,0.15), rgba(220,53,69,0.05))',
                    border: '1px solid rgba(220,53,69,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DC3545',
                    boxShadow: '0 10px 25px rgba(220,53,69,0.15)',
                  }}
                >
                  <FaTrash size={26} />
                </div>
              </motion.div>

              {/* Title & Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3
                  style={{
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: 'var(--text-secondary)',
                    margin: '0 0 6px',
                  }}
                >
                  تأكيد حذف التقييم
                </h3>

                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                    margin: '0 0 1.25rem',
                    fontWeight: 600,
                  }}
                >
                  سيتم حذف التقييم نهائياً ولا يمكن التراجع عن هذا الإجراء.
                </p>
              </motion.div>

              {/* Rating preview card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                    }}
                  >
                    {rating.rater?.name}
                  </span>
                  <StarRating rating={rating.rating} size={14} />
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                    }}
                  >
                    {rating.rated?.name}
                  </span>
                </div>

                {rating.comment && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border-color)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontWeight: 600,
                    }}
                  >
                    "{rating.comment}"
                  </div>
                )}
              </motion.div>

              {/* Info note */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(23,162,184,0.06)',
                  border: '1px solid rgba(23,162,184,0.2)',
                  borderRadius: '14px',
                  marginBottom: '1.25rem',
                }}
              >
                <FaInfoCircle
                  size={14}
                  color="#17A2B8"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#17A2B8',
                    lineHeight: 1.5,
                    fontWeight: 700,
                  }}
                >
                  سيتم تسجيل السبب والإجراء في سجل النشاط الإداري.
                </span>
              </div>

              {/* Textarea Label */}
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                سبب الحذف{' '}
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                  }}
                >
                  (اختياري)
                </span>
              </label>

              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value.slice(0, MAX_REASON_LENGTH));
                  if (error) setError(null);
                }}
                disabled={isLoading}
                placeholder="اختر من الاقتراحات أدناه أو اكتب السبب هنا..."
                rows={3}
                maxLength={MAX_REASON_LENGTH}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: `1.5px solid ${
                    error ? 'var(--error)' : 'var(--border-color)'
                  }`,
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  outline: 'none',
                  resize: 'none',
                  transition: 'all 0.25s ease',
                  marginBottom: '10px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#DC3545';
                  e.currentTarget.style.boxShadow =
                    '0 0 0 4px rgba(220,53,69,0.12)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = error
                    ? 'var(--error)'
                    : 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />

              {/* Quick reason chips with stagger effect */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginBottom: '12px',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    marginLeft: '4px',
                  }}
                >
                  اقتراحات سريعة:
                </span>
                {QUICK_REASONS.map((item, index) => {
                  const isActive = reason === item.message && item.label !== 'أخرى';
                  return (
                    <motion.button
                      key={item.label}
                      type="button"
                      onClick={() => handleQuickReason(item.label, item.message)}
                      disabled={isLoading}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: `1.5px solid ${
                          isActive
                            ? 'var(--primary-orange)'
                            : 'var(--border-color)'
                        }`,
                        backgroundColor: isActive
                          ? 'rgba(232,122,32,0.12)'
                          : 'var(--bg-input)',
                        color: isActive
                          ? 'var(--primary-orange)'
                          : 'var(--text-secondary)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.72rem',
                        fontWeight: isActive ? 800 : 700,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s ease, border-color 0.2s ease',
                        opacity: isLoading ? 0.6 : 1,
                      }}
                    >
                      {item.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Counter + Error Animation */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: 'var(--error)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      <FaExclamationTriangle size={11} />
                      {error}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        fontWeight: 600,
                      }}
                    >
                      {reason.trim().length === 0
                        ? 'اتركه فارغاً للحذف السريع'
                        : `الحد الأدنى: ${MIN_REASON_LENGTH} أحرف`}
                    </motion.div>
                  )}
                </AnimatePresence>

                {reason.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {reason.length}/{MAX_REASON_LENGTH}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
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
              {/* Cancel Button */}
              <motion.button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                style={{
                  flex: '1 1 0',
                  minWidth: '100px',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                  transition: 'background-color 0.2s ease',
                }}
              >
                إلغاء
              </motion.button>

              {/* Confirm Button */}
              <motion.button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading || !isReasonValid}
                whileHover={
                  !isLoading && isReasonValid ? { scale: 1.03, y: -1 } : {}
                }
                whileTap={!isLoading && isReasonValid ? { scale: 0.97 } : {}}
                style={{
                  flex: '1 1 0',
                  minWidth: '140px',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: 'none',
                  background:
                    !isReasonValid || isLoading
                      ? 'var(--primary-brown-light)'
                      : 'linear-gradient(135deg, #DC3545, #B02A37)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  cursor:
                    isLoading || !isReasonValid ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow:
                    !isReasonValid || isLoading
                      ? 'none'
                      : '0 8px 22px rgba(220,53,69,0.35)',
                  opacity: !isReasonValid || isLoading ? 0.6 : 1,
                  transition: 'box-shadow 0.2s ease, opacity 0.2s ease',
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ width: '14px', height: '14px', borderWidth: '2px' }}
                    />
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <FaTrash size={12} />
                    نعم، احذف نهائياً
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

export default AdminDeleteRatingModal;