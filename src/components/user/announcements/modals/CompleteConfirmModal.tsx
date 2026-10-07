import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaFlagCheckered,
  FaInfoCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import { getEntity } from '../../../../utils/announcementNaming';
import type { AnnouncementType } from '../../../../types';

interface CompleteConfirmModalProps {
  isOpen: boolean;
  announcementTitle?: string;
  /** ✨ NEW — drives the copy ("عرض" vs "طلب") */
  type?: AnnouncementType | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CompleteConfirmModal = ({
  isOpen,
  announcementTitle,
  type,
  onConfirm,
  onCancel,
  isLoading = false,
}: CompleteConfirmModalProps) => {
  const t = getEntity(type);

  const handleClose = () => {
    if (isLoading) return;
    onCancel();
  };

  const handleConfirm = () => {
    if (isLoading) return;
    onConfirm();
  };

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
            zIndex: 1060,
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
              maxWidth: '440px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              position: 'relative',
              maxHeight: '90vh',
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
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
                      'linear-gradient(135deg, #17A2B8, #20C9E0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 24px rgba(23,162,184,0.4)',
                    position: 'relative',
                  }}
                >
                  <FaFlagCheckered size={28} />
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#28A745',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--bg-card)',
                    }}
                  >
                    <FaCheckCircle size={11} color="#FFFFFF" />
                  </motion.span>
                </motion.div>
              </div>

              <h3
                style={{
                  textAlign: 'center',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: 'var(--text-secondary)',
                  margin: '0 0 8px',
                }}
              >
                تأكيد إكمال {t.definite}
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
                هل أنت متأكد من إكمال{' '}
                {announcementTitle ? (
                  <>
                    {t.definite}{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      "{announcementTitle}"
                    </strong>
                  </>
                ) : (
                  t.definite
                )}
                ؟
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(23,162,184,0.08)',
                  border: '1px solid rgba(23,162,184,0.25)',
                  borderRadius: '12px',
                }}
              >
                <FaInfoCircle
                  size={14}
                  color="#17A2B8"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: '#17A2B8',
                    lineHeight: 1.55,
                  }}
                >
                  سيتم وسم {t.definite} بـ <strong>"مكتمل"</strong> ولن يظهر
                  للآخرين. يمكنك دائماً إعادة فتحه إذا احتجت.
                </div>
              </div>
            </div>

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
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
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
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                إلغاء
              </motion.button>

              <motion.button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                style={{
                  flex: '1 1 0',
                  minWidth: '140px',
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  background:
                    'linear-gradient(135deg, #17A2B8, #138496)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: '0 4px 16px rgba(23,162,184,0.4)',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ width: '13px', height: '13px' }}
                    />
                    جاري الإكمال...
                  </>
                ) : (
                  <>
                    <FaFlagCheckered size={12} />
                    نعم، أكمل {t.definite}
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

export default CompleteConfirmModal;