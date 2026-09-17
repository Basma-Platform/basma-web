import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaTimes } from 'react-icons/fa';

interface DeleteNotificationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  isBulk?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteNotificationModal = ({
  isOpen,
  title = 'تأكيد الحذف',
  message = 'هل أنت متأكد من حذف هذا الإشعار؟ لا يمكن التراجع عن هذا الإجراء.',
  isBulk = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteNotificationModalProps) => {
  const handleClose = () => {
    if (isLoading) return;
    onCancel();
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
              maxWidth: '400px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              position: 'relative',
              direction: 'rtl',
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
              }}
            >
              <FaTimes size={12} />
            </button>

            {/* Content Body */}
            <div style={{ padding: '1.75rem 1.5rem 1.25rem', textAlign: 'center' }}>
              {/* Warning Icon */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(220,53,69,0.12), rgba(220,53,69,0.06))',
                    border: '2px solid rgba(220,53,69,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <FaTrash size={24} color="#DC3545" />
                </div>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  color: 'var(--text-secondary)',
                  margin: '0 0 8px',
                }}
              >
                {title}
              </h3>

              {/* Message */}
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {message}
              </p>
            </div>

            {/* Actions Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                display: 'flex',
                gap: '10px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
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
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #DC3545, #B02A37)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(220,53,69,0.3)',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" style={{ width: '12px', height: '12px' }} />
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <FaTrash size={11} />
                    {isBulk ? 'نعم، احذف الكل' : 'نعم، احذف'}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteNotificationModal;