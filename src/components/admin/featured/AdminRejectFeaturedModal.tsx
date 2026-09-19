import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaBolt,
} from 'react-icons/fa';

interface AdminRejectFeaturedModalProps {
  isOpen: boolean;
  userName?: string;
  onConfirm: (reason: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const MIN_LENGTH = 10;
const MAX_LENGTH = 500;

// ============================================
// Quick-reason templates for rejection
// ============================================
const REJECT_QUICK_REASONS: { label: string; text: string }[] = [
  {
    label: 'صورة غير واضحة',
    text: 'صورة إشعار التحويل غير واضحة، يرجى إعادة رفع الإشعار بجودة أعلى.',
  },
  {
    label: 'المبلغ غير مطابق',
    text: 'المبلغ المحوّل لا يطابق الرسوم المطلوبة للتمييز.',
  },
  {
    label: 'لم يصل المبلغ',
    text: 'لم يصل المبلغ إلى حساب المنصة. يرجى التأكد من إتمام التحويل بشكل صحيح.',
  },
  {
    label: 'الحساب معلّق',
    text: 'حساب المحفظة أو البنك معلّق حالياً. يرجى استخدام طريقة دفع أخرى أو مراجعة البنك.',
  },
  {
    label: 'التحويل من شخص آخر',
    text: 'التحويل تم من حساب مختلف عن حساب المستخدم. يرجى التحويل من حساب يخصك.',
  },
  {
    label: 'طلب مكرر',
    text: 'يوجد طلب تمييز آخر قيد المراجعة لنفس الإعلان.',
  },
  {
    label: 'إيصال مزيّف',
    text: 'إشعار التحويل غير صالح أو تم التلاعب به.',
  },
  {
    label: 'مبلغ مرتجع',
    text: 'تم استرجاع المبلغ من قبل البنك بعد التحويل. يرجى إعادة المحاولة.',
  },
];

// ============================================
// Animated Icon Wrapper — Reject
// ============================================
const AnimatedRejectIcon = () => {
  const SIZE = 72;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: `${SIZE}px`,
          height: `${SIZE}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ripple ring 1 */}
        <motion.span
          initial={{ x: '-50%', y: '-50%', scale: 1, opacity: 0 }}
          animate={{
            x: '-50%',
            y: '-50%',
            scale: [1, 1.6],
            opacity: [0.6, 0],
          }}
          transition={{ duration: 1.4, delay: 0.5, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            borderRadius: '50%',
            border: '2px solid #DC3545',
            pointerEvents: 'none',
          }}
        />

        {/* Ripple ring 2 */}
        <motion.span
          initial={{ x: '-50%', y: '-50%', scale: 1, opacity: 0 }}
          animate={{
            x: '-50%',
            y: '-50%',
            scale: [1, 1.9],
            opacity: [0.4, 0],
          }}
          transition={{ duration: 1.4, delay: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            borderRadius: '50%',
            border: '2px solid #DC3545',
            pointerEvents: 'none',
          }}
        />

        {/* Icon circle */}
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 16,
            delay: 0.1,
          }}
          style={{
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #DC3545, #E8707D)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            position: 'relative',
            boxShadow: '0 8px 24px rgba(220,53,69,0.4)',
            zIndex: 1,
          }}
        >
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 14,
              delay: 0.35,
            }}
            style={{ display: 'inline-flex' }}
          >
            <FaTimesCircle size={30} />
          </motion.span>

          {/* Warning badge */}
          <motion.span
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 15,
              delay: 0.6,
            }}
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#FFB800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-card)',
              boxShadow: '0 4px 12px rgba(255,184,0,0.4)',
            }}
          >
            <motion.span
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: 'easeInOut',
              }}
              style={{ display: 'inline-flex' }}
            >
              <FaExclamationTriangle size={11} color="#FFFFFF" />
            </motion.span>
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};

const AdminRejectFeaturedModal = ({
  isOpen,
  userName,
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminRejectFeaturedModalProps) => {
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
    setReason('');
    setError(null);
    onCancel();
  };

  const handleConfirm = async () => {
    if (isLoading) return;

    const trimmed = reason.trim();
    if (trimmed.length < MIN_LENGTH) {
      setError(`سبب الرفض يجب أن يكون ${MIN_LENGTH} أحرف على الأقل`);
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`سبب الرفض يجب أن لا يتجاوز ${MAX_LENGTH} حرف`);
      return;
    }

    setError(null);
    await onConfirm(trimmed);
    setReason('');
  };

  const handleQuickReason = (text: string) => {
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
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
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
            transition={{ duration: 0.25, ease: 'easeOut' }}
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
              aria-label="إغلاق"
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
              {/* Animated Icon */}
              <AnimatedRejectIcon />

              <h3
                style={{
                  textAlign: 'center',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: 'var(--text-secondary)',
                  margin: '0 0 8px',
                }}
              >
                تأكيد رفض الطلب
              </h3>

              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  margin: '0 0 1.25rem',
                }}
              >
                {userName ? (
                  <>
                    سيتم رفض طلب تمييز{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      {userName}
                    </strong>{' '}
                    وسيتم إشعاره بالسبب.
                  </>
                ) : (
                  'سيتم رفض الطلب وسيتم إشعار المستخدم بالسبب.'
                )}
              </p>

              {/* Info banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                }}
              >
                <FaInfoCircle
                  size={12}
                  color="#FFB800"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.55,
                  }}
                >
                  يرجى توضيح سبب الرفض بدقة، لأن المستخدم سيستلم هذا السبب
                  ويحتاج إلى معرفة ما يجب تصحيحه.
                </span>
              </div>

              {/* Quick reasons */}
              <div style={{ marginBottom: '14px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  <FaBolt size={11} color="#FFB800" />
                  أسباب جاهزة (اضغط للاختيار):
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  {REJECT_QUICK_REASONS.map((r) => (
                    <button
                      key={r.label}
                      type="button"
                      onClick={() => handleQuickReason(r.text)}
                      disabled={isLoading}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-secondary)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                        opacity: isLoading ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (isLoading) return;
                        e.currentTarget.style.backgroundColor =
                          'rgba(220,53,69,0.1)';
                        e.currentTarget.style.borderColor = '#DC3545';
                        e.currentTarget.style.color = '#DC3545';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          'var(--bg-input)';
                        e.currentTarget.style.borderColor =
                          'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
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
                سبب الرفض <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value.slice(0, MAX_LENGTH));
                  if (error) setError(null);
                }}
                disabled={isLoading}
                placeholder="اكتب سبب الرفض أو اختر من الأسباب الجاهزة بالأعلى..."
                rows={4}
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
                  lineHeight: 1.5,
                  boxSizing: 'border-box',
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
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
                      ? 'var(--primary-brown-light)'
                      : 'linear-gradient(135deg, #DC3545, #B02A37)',
                  color: '#FFFFFF',
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
                      : '0 4px 16px rgba(220,53,69,0.4)',
                  opacity: !isValid || isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ width: '13px', height: '13px' }}
                    />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <FaTimesCircle size={13} />
                    تأكيد الرفض
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

export default AdminRejectFeaturedModal;