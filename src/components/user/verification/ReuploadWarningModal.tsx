import { motion, AnimatePresence } from 'framer-motion';
import {
  FaExclamationTriangle,
  FaTimes,
  FaInfoCircle,
  FaClock,
  FaCheckCircle,
} from 'react-icons/fa';

interface ReuploadWarningModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  previousReason?: string | null;
  previousRejectedAt?: string | null;
  onClose: () => void;
}

const ReuploadWarningModal = ({
  isOpen,
  title = 'تنبيه: لديك محاولة رفض سابقة',
  message = 'يبدو أن لديك طلباً سابقاً تم رفضه. تأكد من معالجة السبب قبل إعادة الرفع.',
  previousReason,
  previousRejectedAt,
  onClose,
}: ReuploadWarningModalProps) => {
  // Format the previous rejection date
  const formattedDate = previousRejectedAt
    ? new Date(previousRejectedAt).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
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
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
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
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
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

            {/* Content */}
            <div
              style={{
                padding: '1.75rem 1.5rem 1.25rem',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 18,
                    delay: 0.1,
                  }}
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, rgba(245,166,35,0.15), rgba(245,166,35,0.06))',
                    border: '2px solid rgba(245,166,35,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FaExclamationTriangle size={32} color="#F5A623" />
                  </motion.div>

                  <motion.span
                    animate={{
                      scale: [1, 1.35, 1],
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
                      border: '2px solid #F5A623',
                      pointerEvents: 'none',
                    }}
                  />
                </motion.div>
              </div>

              {/* Title */}
              <h3
                style={{
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  color: 'var(--text-secondary)',
                  margin: '0 0 8px',
                  lineHeight: 1.35,
                }}
              >
                {title}
              </h3>

              {/* Message */}
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  margin: '0 0 1.25rem',
                }}
              >
                {message}
              </p>

              {/* Previous Rejection Reason */}
              {previousReason && (
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'rgba(220,53,69,0.06)',
                    border: '1px solid rgba(220,53,69,0.25)',
                    borderRadius: '12px',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#DC3545',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      marginBottom: '6px',
                    }}
                  >
                    <FaInfoCircle size={11} />
                    سبب الرفض السابق:
                  </div>
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      lineHeight: 1.6,
                      textAlign: 'right',
                    }}
                  >
                    {previousReason}
                  </div>
                </div>
              )}

              {/* Previous Rejection Date */}
              {formattedDate && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <FaClock size={11} color="#17A2B8" />
                  <span>
                    تاريخ الرفض: <strong>{formattedDate}</strong>
                  </span>
                </div>
              )}

              {/* Helpful Note */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(23,162,184,0.06)',
                  border: '1px solid rgba(23,162,184,0.2)',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.55,
                }}
              >
                <FaCheckCircle
                  size={11}
                  color="#17A2B8"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <span>
                  يمكنك إعادة الرفع مباشرة. تأكد من معالجة سبب الرفض
                  السابق لتحسين فرص الموافقة.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '1rem 1.5rem 1.25rem',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
              }}
            >
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                }}
              >
                <FaCheckCircle size={13} />
                فهمت، سأعيد الرفع الآن
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReuploadWarningModal;