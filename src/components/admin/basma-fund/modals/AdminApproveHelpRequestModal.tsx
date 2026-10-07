import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaInfoCircle, FaBolt } from 'react-icons/fa';

interface AdminApproveHelpRequestModalProps {
  isOpen: boolean;
  requestTitle?: string;
  onConfirm: (notes?: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const MAX_NOTES = 500;

const QUICK_NOTES = [
  { label: 'طلب صحيح', text: 'تم التحقق من صحة الطلب والفيديو، والموافقة عليه.' },
  { label: 'معلومات موثقة', text: 'المعلومات واضحة وجديرة بالنشر في القائمة العامة.' },
  { label: 'طلب عاجل', text: 'طلب عاجل ومستحق — تمت الموافقة للنشر فوراً.' },
];

const AdminApproveHelpRequestModal = ({
  isOpen,
  requestTitle,
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminApproveHelpRequestModalProps) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) setNotes('');
  }, [isOpen]);

  const handleClose = () => {
    if (isLoading) return;
    onCancel();
  };

  const handleConfirm = async () => {
    if (isLoading) return;
    await onConfirm(notes.trim() || undefined);
    setNotes('');
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
              maxWidth: '480px',
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
                initial={{ scale: 0, rotate: -180 }}
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
                    'linear-gradient(135deg, #28A745, #4FCB6E)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  margin: '0 auto 1rem',
                  boxShadow: '0 8px 24px rgba(40,167,69,0.4)',
                }}
              >
                <FaCheckCircle size={28} />
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
                تأكيد الموافقة
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
                    سيتم نشر{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      &quot;{requestTitle}&quot;
                    </strong>{' '}
                    في القائمة العامة.
                  </>
                ) : (
                  'سيتم نشر الطلب في القائمة العامة.'
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
                  color="#28A745"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.55,
                  }}
                >
                  سيتم إشعار المستخدم فور الموافقة، وسيظهر طلبه للمتبرعين.
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
                  <FaBolt size={11} color="#FFC107" />
                  ملاحظات جاهزة (اختياري):
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {QUICK_NOTES.map((n) => (
                    <button
                      key={n.label}
                      type="button"
                      onClick={() => setNotes(n.text.slice(0, MAX_NOTES))}
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
                      {n.label}
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
                ملاحظات{' '}
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                  (اختياري)
                </span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, MAX_NOTES))}
                disabled={isLoading}
                rows={3}
                maxLength={MAX_NOTES}
                placeholder="اكتب ملاحظة..."
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
                  background: 'linear-gradient(135deg, #28A745, #1e7e34)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: '0 4px 16px rgba(40,167,69,0.4)',
                  opacity: isLoading ? 0.7 : 1,
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
                    <FaCheckCircle size={13} />
                    تأكيد الموافقة
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

export default AdminApproveHelpRequestModal;