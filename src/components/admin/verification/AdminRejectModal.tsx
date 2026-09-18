import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimesCircle,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
  FaMagic,
} from 'react-icons/fa';

interface AdminRejectModalProps {
  isOpen: boolean;
  userName?: string;
  onConfirm: (reason: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const MIN_LENGTH = 10;
const MAX_LENGTH = 500;

const REJECT_TEMPLATES = [
  'صورة الهوية غير واضحة أو ضبابية، يرجى إعادة الرفع بجودة أعلى.',
  'الاسم في المستند لا يتطابق مع الاسم المسجل في الملف الشخصي.',
  'المستند المرفوع غير مقبول، يرجى إرفاق صورة الهوية الرسمية السارية.',
];

const AdminRejectModal = ({
  isOpen,
  userName,
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminRejectModalProps) => {
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
      setError(`سبب الرفض يجب ألا يتجاوز ${MAX_LENGTH} حرف`);
      return;
    }

    setError(null);
    await onConfirm(trimmed);
    setReason('');
  };

  const isReasonValid = reason.trim().length >= MIN_LENGTH;

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
            backgroundColor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
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
              maxWidth: '460px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              position: 'relative',
              direction: 'rtl',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Close Button */}
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
                backgroundColor: 'rgba(0,0,0,0.04)',
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
                padding: '1.75rem 1.5rem 1.5rem',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {/* Enhanced Animated Icon Section */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 15,
                    delay: 0.1,
                  }}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, rgba(220,53,69,0.15), rgba(220,53,69,0.06))',
                    border: '2px solid rgba(220,53,69,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Main Icon with a gentle continuous pulse/wobble effect */}
                  <motion.div
                    animate={{
                      rotate: [0, -6, 6, -4, 4, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: 'easeInOut',
                    }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FaTimesCircle size={32} color="#DC3545" />
                  </motion.div>

                  {/* Floating Warning Badge */}
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#F5A623',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--bg-card)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    <FaExclamationTriangle size={10} color="#FFFFFF" />
                  </motion.span>
                </motion.div>
              </div>

              {/* Title */}
              <h3
                style={{
                  textAlign: 'center',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: 'var(--text-secondary)',
                  margin: '0 0 8px',
                }}
              >
                تأكيد رفض التحقق
              </h3>

              {/* Description */}
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
                    سيتم رفض طلب توثيق{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      "{userName}"
                    </strong>{' '}
                    وسيتم إشعاره بالسبب.
                  </>
                ) : (
                  'سيتم رفض الطلب وسيتم إشعار المستخدم بالسبب.'
                )}
              </p>

              {/* Info Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 14px',
                  background:
                    'linear-gradient(135deg, rgba(245,166,35,0.15), rgba(245,166,35,0.06))',
                  border: '1px solid rgba(245,166,35,0.35)',
                  borderRadius: '12px',
                  marginBottom: '1.25rem',
                }}
              >
                <FaInfoCircle
                  size={14}
                  color="#F5A623"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.55,
                  }}
                >
                  يرجى توضيح سبب الرفض بوضوح حتى يتمكن المستخدم من إعادة رفع
                  طلب صحيح.
                </div>
              </div>

              {/* Quick Rejection Templates */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    marginBottom: '6px',
                  }}
                >
                  <FaMagic size={11} color="#DC3545" />
                  قوالب أسباب الرفض (انقر للتعبئة التلقائية):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {REJECT_TEMPLATES.map((tpl, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setReason(tpl);
                        if (error) setError(null);
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.74rem',
                        textAlign: 'right',
                        cursor: 'pointer',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    >
                      {tpl}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Required Reason */}
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                  marginTop: '12px',
                }}
              >
                سبب الرفض <span style={{ color: '#DC3545' }}>*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value.slice(0, MAX_LENGTH));
                  if (error) setError(null);
                }}
                disabled={isLoading}
                placeholder="مثلاً: صورة الهوية غير واضحة، يرجى إعادة الرفع..."
                rows={3}
                maxLength={MAX_LENGTH}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${
                    error ? '#DC3545' : 'var(--border-color)'
                  }`,
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.82rem',
                  outline: 'none',
                  resize: 'none',
                }}
              />

              {/* Counter + Error */}
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
                      color: '#DC3545',
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
                  }}
                >
                  {reason.length}/{MAX_LENGTH}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div
              style={{
                padding: '1rem 1.5rem 1.25rem',
                display: 'flex',
                gap: '10px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
              }}
            >
              <motion.button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                style={{
                  flex: 1,
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                إلغاء
              </motion.button>

              <motion.button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading || !isReasonValid}
                whileHover={
                  !isLoading && isReasonValid ? { scale: 1.02, y: -1 } : {}
                }
                whileTap={
                  !isLoading && isReasonValid ? { scale: 0.97 } : {}
                }
                style={{
                  flex: 1,
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  background:
                    !isReasonValid || isLoading
                      ? 'var(--border-color)'
                      : 'linear-gradient(135deg, #DC3545, #B02A37)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor:
                    isLoading || !isReasonValid ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow:
                    !isReasonValid || isLoading
                      ? 'none'
                      : '0 4px 16px rgba(220,53,69,0.35)',
                  opacity: !isReasonValid || isLoading ? 0.6 : 1,
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
                    نعم، ارفض
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

export default AdminRejectModal;