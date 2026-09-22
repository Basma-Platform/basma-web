import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaFlag,
  FaInfoCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import ReportReasonPicker from './ReportReasonPicker';
import ReportSkeleton from './ReportSkeleton';
import { useReportForm } from '../../hooks/useReportForm';
import type { CreateReportPayload } from '../../types';

const MAX_DESCRIPTION = 1000;

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'user' | 'announcement';
  reportedUserId?: number;
  announcementId?: number;
  targetName?: string;
}

const ReportModal = ({
  isOpen,
  onClose,
  targetType,
  reportedUserId,
  announcementId,
  targetName,
}: ReportModalProps) => {
  const {
    reasons,
    reasonsLoading,
    submitting,
    fetchReasons,
    submitReport,
    reset,
  } = useReportForm();

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load reasons when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedReason(null);
      setDescription('');
      setError(null);
      fetchReasons(targetType).catch(() => {
        // toast handled in hook
      });
    } else {
      reset();
    }
  }, [isOpen, targetType, fetchReasons, reset]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, submitting, onClose]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (submitting) return;

    // Validate
    if (!selectedReason) {
      setError('يرجى اختيار سبب الإبلاغ');
      return;
    }

    // Build payload
    const payload: CreateReportPayload = {
      target_type: targetType,
      reason: selectedReason,
      description: description.trim() || undefined,
    };

    if (targetType === 'user') {
      if (!reportedUserId) {
        setError('حدث خطأ — لا يمكن تحديد المستخدم');
        return;
      }
      payload.reported_user_id = reportedUserId;
    } else {
      if (!announcementId) {
        setError('حدث خطأ — لا يمكن تحديد الإعلان');
        return;
      }
      payload.announcement_id = announcementId;
    }

    setError(null);

    try {
      await submitReport(payload);
      onClose();
    } catch {
      // Error handled inside hook (toasts). Keep modal open so user can fix.
    }
  };

  const remaining = MAX_DESCRIPTION - description.length;
  const targetLabel = targetType === 'user' ? 'المستخدم' : 'الإعلان';

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
            backdropFilter: 'blur(5px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            direction: 'rtl',
            overflowY: 'auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              maxHeight: '94vh',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 28px 70px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              margin: 'auto',
            }}
          >
            {/* ============================================
                Close button (Optimized for Touch - min 44px)
                ============================================ */}
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0.06)',
                color: 'var(--text-muted)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                opacity: submitting ? 0.5 : 1,
                touchAction: 'manipulation',
                transition: 'background-color 0.2s',
              }}
              aria-label="إغلاق"
            >
              <FaTimes size={14} />
            </button>

            {/* ============================================
                Body
                ============================================ */}
            <div
              style={{
                padding: '2rem 1.5rem 1.25rem',
                overflowY: 'auto',
                flex: 1,
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {/* Animated Icon with looping pulsing/floating effect */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1.2rem',
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{
                    scale: [1, 1.06, 1],
                    rotate: [0, -3, 3, 0],
                    y: [0, -3, 0],
                  }}
                  transition={{
                    scale: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
                    rotate: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
                    y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
                    default: { type: 'spring', stiffness: 260, damping: 18 },
                  }}
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, rgba(220,53,69,0.18), rgba(220,53,69,0.06))',
                    border: '2px solid rgba(220,53,69,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DC3545',
                    boxShadow: '0 8px 20px rgba(220,53,69,0.15)',
                  }}
                >
                  <FaFlag size={30} />
                </motion.div>
              </div>

              {/* Title */}
              <h3
                style={{
                  textAlign: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: 'var(--text-secondary)',
                  margin: '0 0 6px',
                }}
              >
                الإبلاغ عن {targetLabel}
              </h3>

              {/* Subtitle with target name */}
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.65,
                  margin: '0 0 1.25rem',
                }}
              >
                {targetName ? (
                  <>
                    ساعدنا في الحفاظ على مجتمع آمن عبر الإبلاغ عن{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      "{targetName}"
                    </strong>{' '}
                    إذا كان مخالفاً لسياسات المنصة.
                  </>
                ) : (
                  'ساعدنا في الحفاظ على مجتمع آمن عبر الإبلاغ عن أي محتوى مخالف.'
                )}
              </p>

              {/* Info box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(23,162,184,0.08)',
                  border: '1px solid rgba(23,162,184,0.25)',
                  borderRadius: '12px',
                  marginBottom: '1.35rem',
                }}
              >
                <FaInfoCircle
                  size={14}
                  color="#17A2B8"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <span
                  style={{
                    fontSize: '0.76rem',
                    color: '#17A2B8',
                    lineHeight: 1.6,
                    fontWeight: 600,
                  }}
                >
                  بلاغك سري تماماً ولن يعرف الطرف المُبلَّغ عنه من قام بالإبلاغ.
                </span>
              </div>

              {/* Reasons section */}
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: 'var(--text-secondary)',
                  marginBottom: '10px',
                }}
              >
                سبب الإبلاغ <span style={{ color: 'var(--error)' }}>*</span>
              </label>

              {reasonsLoading ? (
                <ReportSkeleton variant="reasons" count={6} />
              ) : (
                <ReportReasonPicker
                  reasons={reasons}
                  selected={selectedReason}
                  onSelect={(v) => {
                    setSelectedReason(v);
                    if (error) setError(null);
                  }}
                  disabled={submitting}
                />
              )}

              {/* Description section */}
              <div style={{ marginTop: '1.35rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                  }}
                >
                  تفاصيل إضافية{' '}
                  <span
                    style={{ color: 'var(--text-muted)', fontWeight: 500 }}
                  >
                    (اختياري)
                  </span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value.slice(0, MAX_DESCRIPTION))
                  }
                  disabled={submitting}
                  placeholder="اشرح المشكلة بمزيد من التفصيل إن أمكن..."
                  rows={3}
                  maxLength={MAX_DESCRIPTION}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: 1.6,
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      'var(--primary-orange)';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 4px rgba(232,122,32,0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <div
                  style={{
                    textAlign: 'left',
                    fontSize: '0.7rem',
                    color:
                      remaining < 50 ? 'var(--error)' : 'var(--text-muted)',
                    fontFamily: 'system-ui, sans-serif',
                    marginTop: '6px',
                    opacity: 0.8,
                  }}
                >
                  {description.length}/{MAX_DESCRIPTION}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '12px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(220,53,69,0.08)',
                    border: '1px solid rgba(220,53,69,0.25)',
                    color: 'var(--error)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  <FaExclamationTriangle size={12} />
                  {error}
                </div>
              )}
            </div>

            {/* ============================================
                Footer (Touch optimized buttons)
                ============================================ */}
            <div
              style={{
                padding: '1.1rem 1.5rem 1.35rem',
                display: 'flex',
                gap: '12px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                style={{
                  flex: '1 1 0',
                  minWidth: '110px',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.5 : 1,
                  minHeight: '46px',
                  touchAction: 'manipulation',
                }}
              >
                إلغاء
              </button>

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !selectedReason || reasonsLoading}
                whileHover={
                  !submitting && selectedReason && !reasonsLoading
                    ? { scale: 1.02, y: -1 }
                    : {}
                }
                whileTap={
                  !submitting && selectedReason && !reasonsLoading
                    ? { scale: 0.97 }
                    : {}
                }
                style={{
                  flex: '1 1 0',
                  minWidth: '150px',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background:
                    !selectedReason || submitting || reasonsLoading
                      ? 'var(--primary-brown-light)'
                      : 'linear-gradient(135deg, #DC3545, #B02A37)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor:
                    submitting || !selectedReason || reasonsLoading
                      ? 'not-allowed'
                      : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow:
                    !selectedReason || submitting || reasonsLoading
                      ? 'none'
                      : '0 6px 20px rgba(220,53,69,0.4)',
                  opacity:
                    !selectedReason || submitting || reasonsLoading ? 0.6 : 1,
                  minHeight: '46px',
                  touchAction: 'manipulation',
                }}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ width: '14px', height: '14px' }}
                    />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <FaFlag size={13} />
                    إرسال البلاغ
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

export default ReportModal;