import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaTrash,
  FaExclamationTriangle,
  FaClock,
} from 'react-icons/fa';
import { formatDeleteCountdown } from '../../../../utils/helpRequestHelpers';

interface DeleteHelpRequestModalProps {
  isOpen: boolean;
  requestTitle?: string;
  /** ISO deadline from the API */
  deleteDeadline: string | null;
  /** Fallback seconds remaining */
  secondsRemaining?: number | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Delete confirmation modal for a user's own help request.
 *
 * ✅ Countdown is DERIVED on every render from the absolute `deleteDeadline`.
 *    No state-based counting → no drift, no "expired on first open" bug.
 * ✅ A lightweight `tick` state forces a re-render every second.
 */
const DeleteHelpRequestModal = ({
  isOpen,
  requestTitle,
  deleteDeadline,
  secondsRemaining,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteHelpRequestModalProps) => {
  // Force re-render every second while open
  const [, setTick] = useState(0);

  // ============================================
  // Live re-render tick
  // ============================================
  useEffect(() => {
    if (!isOpen) return;

    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [isOpen]);

  // ============================================
  // Derive `remaining` on every render
  // ============================================
  const computeRemaining = (): number => {
    if (deleteDeadline) {
      const diff = new Date(deleteDeadline).getTime() - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    }
    return Math.max(0, secondsRemaining ?? 0);
  };

  const remaining = computeRemaining();
  const windowExpired = remaining <= 0;

  const handleClose = () => {
    if (isLoading) return;
    onCancel();
  };

  const handleConfirm = async () => {
    if (isLoading || windowExpired) return;
    await onConfirm();
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
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="delete-hr-modal"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '22px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ============================================ */}
            {/* Close button */}
            {/* ============================================ */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              aria-label="إغلاق"
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                width: '34px',
                height: '34px',
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
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (isLoading) return;
                e.currentTarget.style.backgroundColor =
                  'rgba(220,53,69,0.12)';
                e.currentTarget.style.color = '#DC3545';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <FaTimes size={13} />
            </button>

            {/* ============================================ */}
            {/* Body */}
            {/* ============================================ */}
            <div className="delete-hr-modal__body">
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
                  width: 'clamp(64px, 16vw, 76px)',
                  height: 'clamp(64px, 16vw, 76px)',
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #DC3545, #E8707D)',
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

              <h3 className="delete-hr-modal__title">تأكيد حذف الطلب</h3>

              <p className="delete-hr-modal__message">
                {requestTitle ? (
                  <>
                    سيتم حذف الطلب{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      &quot;{requestTitle}&quot;
                    </strong>{' '}
                    نهائياً ولا يمكن التراجع.
                  </>
                ) : (
                  'سيتم حذف الطلب نهائياً ولا يمكن التراجع.'
                )}
              </p>

              {/* ============================================ */}
              {/* Live countdown */}
              {/* ============================================ */}
              {!windowExpired && (
                <div className="delete-hr-modal__countdown">
                  <div className="delete-hr-modal__countdown-label">
                    <FaClock size={11} />
                    يمكنك الحذف خلال
                  </div>
                  <div className="delete-hr-modal__countdown-value">
                    {formatDeleteCountdown(remaining)}
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* Info banner */}
              {/* ============================================ */}
              <div className="delete-hr-modal__info">
                <FaExclamationTriangle
                  size={12}
                  style={{
                    flexShrink: 0,
                    marginTop: '2px',
                    color: 'var(--notice-warning-text)',
                  }}
                />
                <span>
                  {windowExpired
                    ? 'انتهت مدة الحذف المتاحة. تواصل مع الإدارة إن احتجت مساعدة.'
                    : 'بعد انتهاء المدة، لن تتمكن من الحذف مباشرة. تواصل مع الإدارة إن احتجت ذلك.'}
                </span>
              </div>
            </div>

            {/* ============================================ */}
            {/* Footer */}
            {/* ============================================ */}
            <div className="delete-hr-modal__footer">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="delete-hr-modal__btn delete-hr-modal__btn--cancel"
              >
                إلغاء
              </button>

              <motion.button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading || windowExpired}
                whileHover={
                  !isLoading && !windowExpired
                    ? { scale: 1.02, y: -1 }
                    : {}
                }
                whileTap={
                  !isLoading && !windowExpired ? { scale: 0.97 } : {}
                }
                className={`delete-hr-modal__btn delete-hr-modal__btn--danger ${
                  windowExpired ? 'is-disabled' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ width: '13px', height: '13px' }}
                    />
                    جاري الحذف...
                  </>
                ) : windowExpired ? (
                  <>
                    <FaTrash size={12} />
                    انتهت المدة
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

          {/* ============================================ */}
          {/* Scoped styles */}
          {/* ============================================ */}
          <style>{`
            .delete-hr-modal__body {
              padding: 1.75rem 1.5rem 1.25rem;
              overflow-y: auto;
              flex: 1;
            }

            .delete-hr-modal__title {
              text-align: center;
              color: var(--text-secondary);
              font-size: clamp(1.05rem, 4vw, 1.2rem);
              font-weight: 900;
              margin: 0 0 8px;
              line-height: 1.35;
            }

            .delete-hr-modal__message {
              text-align: center;
              color: var(--text-muted);
              font-size: 0.85rem;
              line-height: 1.75;
              margin: 0 0 1.25rem;
            }

            .delete-hr-modal__countdown {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 10px;
              padding: 10px 14px;
              border-radius: 11px;
              background-color: var(--notice-warning-bg);
              border: 1px solid var(--notice-warning-border);
              color: var(--notice-warning-text);
              margin-bottom: 1rem;
              flex-wrap: wrap;
            }

            .delete-hr-modal__countdown-label {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-size: 0.78rem;
              font-weight: 700;
            }

            .delete-hr-modal__countdown-value {
              font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
              font-variant-numeric: tabular-nums;
              font-size: 1rem;
              font-weight: 900;
              letter-spacing: 0.5px;
            }

            .delete-hr-modal__info {
              display: flex;
              align-items: flex-start;
              gap: 8px;
              padding: 10px 12px;
              background-color: var(--bg-input);
              border: 1px solid var(--border-color);
              border-radius: 10px;
              color: var(--text-secondary);
              font-size: 0.75rem;
              line-height: 1.6;
              font-weight: 600;
            }

            .delete-hr-modal__footer {
              padding: 1rem 1.5rem 1.35rem;
              display: flex;
              gap: 10px;
              border-top: 1px solid var(--border-color);
              background-color: var(--bg-input);
              flex-wrap: wrap;
              flex-shrink: 0;
            }

            .delete-hr-modal__btn {
              flex: 1 1 0;
              min-width: 110px;
              padding: 12px 16px;
              border-radius: 12px;
              font-family: 'Cairo', sans-serif;
              font-size: 0.88rem;
              font-weight: 800;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 7px;
              transition: all 0.2s ease;
            }

            .delete-hr-modal__btn--cancel {
              border: 1.5px solid var(--border-color);
              background-color: var(--bg-card);
              color: var(--text-secondary);
            }
            .delete-hr-modal__btn--cancel:hover:not(:disabled) {
              border-color: var(--text-muted);
            }
            .delete-hr-modal__btn--cancel:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            .delete-hr-modal__btn--danger {
              border: none;
              background: linear-gradient(135deg, #DC3545, #B02A37);
              color: #FFFFFF;
              box-shadow: 0 4px 16px rgba(220,53,69,0.4);
            }
            .delete-hr-modal__btn--danger:hover:not(:disabled) {
              box-shadow: 0 8px 24px rgba(220,53,69,0.5);
            }
            .delete-hr-modal__btn--danger.is-disabled,
            .delete-hr-modal__btn--danger:disabled {
              background: var(--btn-disabled-bg);
              color: var(--btn-disabled-text);
              box-shadow: none;
              cursor: not-allowed;
              opacity: 0.75;
            }

            @media (max-width: 480px) {
              .delete-hr-modal__body {
                padding: 1.5rem 1.15rem 1.1rem;
              }
              .delete-hr-modal__footer {
                padding: 0.9rem 1.15rem 1.15rem;
                flex-direction: column-reverse;
              }
              .delete-hr-modal__btn {
                width: 100%;
                min-width: 0;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteHelpRequestModal;