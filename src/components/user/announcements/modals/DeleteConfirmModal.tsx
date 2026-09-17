import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrash,
  FaExclamationTriangle,
  FaTimes,
  FaClock,
} from 'react-icons/fa';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  announcementTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmModal = ({
  isOpen,
  announcementTitle,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmModalProps) => {
  const [reason, setReason] = useState('');

  const handleClose = () => {
    if (isLoading) return;
    setReason('');
    onCancel();
  };

  const handleConfirm = () => {
    if (isLoading) return;
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
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
            {/* Modal */}
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
                  transition: 'all 0.2s ease',
                  zIndex: 2,
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (isLoading) return;
                  e.currentTarget.style.backgroundColor =
                    'rgba(220,53,69,0.1)';
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
                  padding: '1.75rem 1.5rem 1.5rem',
                  overflowY: 'auto',
                  flex: 1,
                }}
              >
                {/* Warning Icon */}
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
                        'linear-gradient(135deg, rgba(220,53,69,0.12), rgba(220,53,69,0.06))',
                      border: '2px solid rgba(220,53,69,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <FaTrash size={28} color="#DC3545" />
                    <motion.span
                      animate={{ rotate: [0, 8, -8, 0] }}
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
                        backgroundColor: '#F5A623',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--bg-card)',
                      }}
                    >
                      <FaExclamationTriangle size={11} color="#FFFFFF" />
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
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  تأكيد حذف الإعلان
                </h3>

                {/* Description */}
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.7,
                    margin: '0 0 1.25rem',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  هل أنت متأكد من حذف{' '}
                  {announcementTitle ? (
                    <>
                      الإعلان{' '}
                      <strong style={{ color: 'var(--text-secondary)' }}>
                        "{announcementTitle}"
                      </strong>
                    </>
                  ) : (
                    'هذا الإعلان'
                  )}
                  ؟
                </p>

                {/* Info Warning */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 14px',
                    backgroundColor: 'linear-gradient(135deg, rgba(245,166,35,0.14), rgba(245,166,35,0.06))',
                    border: '1px solid rgba(245,166,35,0.35)',
                    borderRadius: '12px',
                    marginBottom: '1rem',
                  }}
                >
                  <FaClock
                    size={14}
                    color="#D97706"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: '#D97706',
                      lineHeight: 1.55,
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    سيتم إخفاء الإعلان فوراً من حسابك. سيتم حذفه{' '}
                    <strong style={{ color: '#F5A623' }}>نهائياً</strong> من قاعدة البيانات بعد{' '}
                    <strong style={{ color: '#F5A623' }}>30 يوماً</strong>. لا يمكنك استعادته بنفسك.
                  </div>
                </div>

                {/* Reason Field (Optional) */}
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  سبب الحذف{' '}
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontWeight: 500,
                    }}
                  >
                    (اختياري)
                  </span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isLoading}
                  placeholder="مثلاً: تم البيع، لم يعد متاحاً..."
                  rows={2}
                  maxLength={200}
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
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-orange)';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(232,122,32,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {reason.length > 0 && (
                  <div
                    style={{
                      textAlign: 'left',
                      fontSize: '0.65rem',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                      fontFamily: 'Cairo, sans-serif',
                      opacity: 0.7,
                    }}
                  >
                    {reason.length}/200
                  </div>
                )}
              </div>

              {/* Actions Footer */}
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
                    transition: 'all 0.2s ease',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (isLoading) return;
                    e.currentTarget.style.backgroundColor =
                      'rgba(232,122,32,0.05)';
                    e.currentTarget.style.borderColor = 'var(--primary-orange)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
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
                    minWidth: '120px',
                    padding: '11px 16px',
                    borderRadius: '11px',
                    border: 'none',
                    background:
                      'linear-gradient(135deg, #DC3545, #B02A37)',
                    color: '#FFFFFF',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    boxShadow: '0 4px 16px rgba(220,53,69,0.35)',
                    transition: 'all 0.2s ease',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (isLoading) return;
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(220,53,69,0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      '0 4px 16px rgba(220,53,69,0.35)';
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
                      نعم، احذف
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;