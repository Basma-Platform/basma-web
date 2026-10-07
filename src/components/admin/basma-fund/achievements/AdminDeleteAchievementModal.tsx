import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaTrash,
  FaExclamationTriangle,
} from 'react-icons/fa';

interface AdminDeleteAchievementModalProps {
  isOpen: boolean;
  achievementTitle?: string;
  onConfirm: (reason?: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const MAX_REASON = 500;

const AdminDeleteAchievementModal = ({
  isOpen,
  achievementTitle,
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminDeleteAchievementModalProps) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) setReason('');
  }, [isOpen]);

  const handleClose = () => {
    if (isLoading) return;
    onCancel();
  };

  const handleConfirm = async () => {
    if (isLoading) return;
    await onConfirm(reason.trim() || undefined);
    setReason('');
  };

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
              maxWidth: '460px',
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
                initial={{ scale: 0, rotate: -90 }}
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
                  background: 'linear-gradient(135deg, #DC3545, #E8707D)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  margin: '0 auto 1rem',
                  boxShadow: '0 8px 24px rgba(220,53,69,0.4)',
                }}
              >
                <FaTrash size={26} />
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
                تأكيد الحذف
              </h3>

              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  lineHeight: 1.7,
                  margin: '0 0 1.25rem',
                }}
              >
                {achievementTitle ? (
                  <>
                    سيتم حذف الإنجاز{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      &quot;{achievementTitle}&quot;
                    </strong>{' '}
                    نهائياً ولا يمكن التراجع.
                  </>
                ) : (
                  'سيتم حذف الإنجاز نهائياً ولا يمكن التراجع.'
                )}
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
                  سيتم حذف صورة الغلاف نهائياً. هذا الإجراء مُسجَّل في
                  سجل النشاط.
                </span>
              </div>

              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                سبب الحذف{' '}
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                  (اختياري)
                </span>
              </label>
              <textarea
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value.slice(0, MAX_REASON))
                }
                disabled={isLoading}
                rows={3}
                maxLength={MAX_REASON}
                placeholder="اكتب سبب الحذف..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
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
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                style={{
                  flex: '1 1 0',
                  minWidth: '140px',
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #DC3545, #B02A37)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: '0 4px 16px rgba(220,53,69,0.4)',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ width: '13px', height: '13px' }}
                    />
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <FaTrash size={12} />
                    تأكيد الحذف
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

export default AdminDeleteAchievementModal;