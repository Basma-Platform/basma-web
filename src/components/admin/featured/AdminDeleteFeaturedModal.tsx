import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaTrash,
  FaExclamationTriangle,
  FaBolt,
} from 'react-icons/fa';

interface AdminDeleteFeaturedModalProps {
  isOpen: boolean;
  requestId?: number;
  onConfirm: (reason?: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const MAX_REASON = 300;

// ============================================
// Quick-reason templates for deletion
// ============================================
const DELETE_QUICK_REASONS: { label: string; text: string }[] = [
  { label: 'طلب مكرر', text: 'طلب مكرر — يوجد طلب آخر بنفس البيانات.' },
  { label: 'طلب خاطئ', text: 'تم إنشاء الطلب بالخطأ من قِبل المستخدم.' },
  {
    label: 'مخالفة للسياسات',
    text: 'الطلب مرتبط بمحتوى يخالف سياسات المنصة.',
  },
  { label: 'إعلان محذوف', text: 'تم حذف الإعلان المرتبط بالطلب نهائياً.' },
  {
    label: 'بيانات غير صحيحة',
    text: 'البيانات المدخلة غير صحيحة أو غير مكتملة.',
  },
  { label: 'بناءً على طلب المستخدم', text: 'تم الحذف بناءً على طلب المستخدم.' },
];

// ============================================
// Animated Icon Wrapper — Delete
// ============================================
const AnimatedDeleteIcon = () => {
  const SIZE = 68;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: `${SIZE}px`,
          height: `${SIZE}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ripple ring 1 */}
        <motion.span
          initial={{ x: '-50%', y: '-50%', scale: 1, opacity: 0 }}
          animate={{
            x: '-50%',
            y: '-50%',
            scale: [1, 1.6],
            opacity: [0.6, 0],
          }}
          transition={{ duration: 1.4, delay: 0.5, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            borderRadius: '50%',
            border: '2px solid #DC3545',
            pointerEvents: 'none',
          }}
        />

        {/* Ripple ring 2 */}
        <motion.span
          initial={{ x: '-50%', y: '-50%', scale: 1, opacity: 0 }}
          animate={{
            x: '-50%',
            y: '-50%',
            scale: [1, 1.9],
            opacity: [0.4, 0],
          }}
          transition={{ duration: 1.4, delay: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            borderRadius: '50%',
            border: '2px solid #DC3545',
            pointerEvents: 'none',
          }}
        />

        {/* Icon circle */}
        <motion.div
          initial={{ scale: 0, rotate: -90, y: 10 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 16,
            delay: 0.1,
          }}
          style={{
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #DC3545, #E8707D)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(220,53,69,0.4)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 14,
              delay: 0.35,
            }}
            style={{ display: 'inline-flex' }}
          >
            <FaTrash size={26} />
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};

const AdminDeleteFeaturedModal = ({
  isOpen,
  requestId,
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminDeleteFeaturedModalProps) => {
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

  const handleQuickReason = (text: string) => {
    setReason(text.slice(0, MAX_REASON));
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
            backdropFilter: 'blur(4px)',
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
            transition={{ duration: 0.25, ease: 'easeOut' }}
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
              aria-label="إغلاق"
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
              <AnimatedDeleteIcon />

              <h3
                style={{
                  textAlign: 'center',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: 'var(--text-secondary)',
                  margin: '0 0 6px',
                }}
              >
                تأكيد حذف الطلب
              </h3>

              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  margin: '0 0 1.25rem',
                }}
              >
                {requestId != null
                  ? `سيتم حذف الطلب #${requestId} نهائياً ولا يمكن التراجع.`
                  : 'سيتم حذف الطلب نهائياً ولا يمكن التراجع.'}
              </p>

              {/* Warning banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                }}
              >
                <FaExclamationTriangle
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
                  هذا الإجراء سيُسجَّل في سجل النشاط. استخدمه فقط للطلبات
                  المكررة أو الخاطئة.
                </span>
              </div>

              {/* Quick reasons */}
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
                  أسباب جاهزة (اضغط للاختيار):
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  {DELETE_QUICK_REASONS.map((r) => (
                    <button
                      key={r.label}
                      type="button"
                      onClick={() => handleQuickReason(r.text)}
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
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                        opacity: isLoading ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (isLoading) return;
                        e.currentTarget.style.backgroundColor =
                          'rgba(220,53,69,0.1)';
                        e.currentTarget.style.borderColor = '#DC3545';
                        e.currentTarget.style.color = '#DC3545';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          'var(--bg-input)';
                        e.currentTarget.style.borderColor =
                          'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason textarea */}
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
                onChange={(e) => setReason(e.target.value.slice(0, MAX_REASON))}
                disabled={isLoading}
                placeholder="اكتب سبب الحذف أو اختر من الأسباب الجاهزة بالأعلى..."
                rows={3}
                maxLength={MAX_REASON}
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
                  lineHeight: 1.5,
                  boxSizing: 'border-box',
                }}
              />
              {reason.length > 0 && (
                <div
                  style={{
                    textAlign: 'left',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    marginTop: '4px',
                    opacity: 0.7,
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  {reason.length}/{MAX_REASON}
                </div>
              )}
            </div>

            {/* Footer */}
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

export default AdminDeleteFeaturedModal;