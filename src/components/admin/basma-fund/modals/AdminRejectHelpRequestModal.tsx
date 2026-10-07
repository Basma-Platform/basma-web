import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaBolt,
} from 'react-icons/fa';

interface AdminRejectHelpRequestModalProps {
  isOpen: boolean;
  requestTitle?: string;
  onConfirm: (reason: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const MIN_LENGTH = 10;
const MAX_LENGTH = 500;

const QUICK_REASONS = [
  { label: 'فيديو غير واضح', text: 'الفيديو غير واضح — يرجى إعادة رفع فيديو بجودة أفضل.' },
  { label: 'معلومات ناقصة', text: 'المعلومات المقدمة غير كافية لتقييم الطلب.' },
  { label: 'طلب مكرر', text: 'يوجد طلب آخر من نفس المستخدم خلال الفترة الأخيرة.' },
  { label: 'مخالفة للسياسات', text: 'المحتوى يخالف سياسات المنصة.' },
  { label: 'فيديو طويل جداً', text: 'الفيديو يتجاوز الحد الأقصى للمدة المسموح بها.' },
];

const AdminRejectHelpRequestModal = ({
  isOpen,
  requestTitle,
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminRejectHelpRequestModalProps) => {
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

  const handleConfirm = async () => {
    if (isLoading) return;
    const trimmed = reason.trim();
    if (trimmed.length < MIN_LENGTH) {
      setError(`السبب يجب أن يكون ${MIN_LENGTH} أحرف على الأقل`);
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`السبب يجب ألا يتجاوز ${MAX_LENGTH} حرف`);
      return;
    }
    setError(null);
    await onConfirm(trimmed);
    setReason('');
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
                initial={{ scale: 0, rotate: 180 }}
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
                <FaTimesCircle size={28} />
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
                تأكيد الرفض
              </h3>

              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                  margin: '0 0 1.25rem',
                }}
              >
                {requestTitle ? (
                  <>
                    سيتم رفض{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      &quot;{requestTitle}&quot;
                    </strong>{' '}
                    وإشعار المستخدم بالسبب.
                  </>
                ) : (
                  'سيتم رفض الطلب وإشعار المستخدم بالسبب.'
                )}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  marginBottom: '1rem',
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
                  يرجى كتابة سبب واضح — سيستلمه المستخدم ليصحّح ما يلزم.
                </span>
              </div>

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
                  أسباب جاهزة:
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {QUICK_REASONS.map((r) => (
                    <button
                      key={r.label}
                      type="button"
                      onClick={() => {
                        setReason(r.text.slice(0, MAX_LENGTH));
                        if (error) setError(null);
                      }}
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
                        whiteSpace: 'nowrap',
                        opacity: isLoading ? 0.5 : 1,
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
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
                سبب الرفض <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value.slice(0, MAX_LENGTH));
                  if (error) setError(null);
                }}
                disabled={isLoading}
                placeholder="اكتب سبب الرفض..."
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
                  boxSizing: 'border-box',
                  lineHeight: 1.5,
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
                    <FaExclamationTriangle size={10} />
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
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  {reason.length}/{MAX_LENGTH}
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
                      ? 'var(--btn-disabled-bg)'
                      : 'linear-gradient(135deg, #DC3545, #B02A37)',
                  color:
                    !isValid || isLoading
                      ? 'var(--btn-disabled-text)'
                      : '#FFFFFF',
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
                  opacity: !isValid || isLoading ? 0.7 : 1,
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

export default AdminRejectHelpRequestModal;