import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPause,
  FaTimes,
  FaClock,
  FaInfoCircle,
  FaPlay,
} from 'react-icons/fa';

interface DisableConfirmModalProps {
  isOpen: boolean;
  announcementTitle?: string;
  mode?: 'disable' | 'enable';
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DisableConfirmModal = ({
  isOpen,
  announcementTitle,
  mode = 'disable',
  onConfirm,
  onCancel,
  isLoading = false,
}: DisableConfirmModalProps) => {
  const [reason, setReason] = useState('');

  const isDisable = mode === 'disable';

  // Theme based on mode
  const theme = isDisable
    ? {
        color: '#D97706', // High-contrast amber for pristine dark/light mode readability
        accent: '#F5A623',
        gradient: 'linear-gradient(135deg, rgba(245,166,35,0.14), rgba(245,166,35,0.06))',
        border: 'rgba(245,166,35,0.35)',
        buttonGradient: 'linear-gradient(135deg, #F5A623, #D97706)',
        buttonColor: '#FFFFFF',
        buttonShadow: 'rgba(245,166,35,0.35)',
        buttonShadowHover: 'rgba(245,166,35,0.45)',
        icon: <FaPause size={28} />,
        title: 'تأكيد تعطيل الإعلان',
        description: 'سيتم إخفاء الإعلان مؤقتاً عن المستخدمين الآخرين',
        actionLabel: 'نعم، عطّل الإعلان',
        loadingLabel: 'جاري التعطيل...',
        infoIcon: <FaClock size={14} />,
        infoText: (
          <>
            سيتم إخفاء الإعلان فوراً عن المستخدمين. سيتم نقله إلى
            المحذوفات تلقائياً بعد <strong style={{ color: '#F5A623' }}>14 يوماً</strong> إذا لم تقم
            بإعادة تفعيله.
          </>
        ),
        reasonLabel: 'سبب التعطيل',
        reasonPlaceholder: 'مثلاً: تم البيع، لم يعد متاحاً...',
        reasonOptional: true,
      }
    : {
        color: '#28A745',
        accent: '#28A745',
        gradient: 'linear-gradient(135deg, rgba(40,167,69,0.12), rgba(40,167,69,0.06))',
        border: 'rgba(40,167,69,0.25)',
        buttonGradient: 'linear-gradient(135deg, #28A745, #1e7e34)',
        buttonColor: '#FFFFFF',
        buttonShadow: 'rgba(40,167,69,0.35)',
        buttonShadowHover: 'rgba(40,167,69,0.45)',
        icon: <FaPlay size={28} />,
        title: 'تأكيد تفعيل الإعلان',
        description: 'سيصبح الإعلان مرئياً للمستخدمين مرة أخرى',
        actionLabel: 'نعم، فعّل الإعلان',
        loadingLabel: 'جاري التفعيل...',
        infoIcon: <FaInfoCircle size={14} />,
        infoText: (
          <>
            سيتم عرض الإعلان للمستخدمين حسب إعدادات الخصوصية المحددة.
            تأكد من أن الإعلان لا يزال صالحاً.
          </>
        ),
        reasonLabel: 'ملاحظة',
        reasonPlaceholder: 'مثلاً: المنتج متوفر مجدداً...',
        reasonOptional: true,
      };

  const handleClose = () => {
    if (isLoading) return;
    setReason('');
    onCancel();
  };

  const handleConfirm = () => {
    if (isLoading) return;
    onConfirm(isDisable ? reason.trim() || undefined : undefined);
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
                {/* Icon */}
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
                      background: theme.gradient,
                      border: `2px solid ${theme.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.accent,
                      position: 'relative',
                    }}
                  >
                    {theme.icon}

                    {/* Pulse Ring */}
                    <motion.span
                      animate={{
                        scale: [1, 1.5, 1.5],
                        opacity: [0.5, 0, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                      style={{
                        position: 'absolute',
                        inset: -2,
                        borderRadius: '50%',
                        border: `2px solid ${theme.accent}`,
                        pointerEvents: 'none',
                      }}
                    />
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
                  {theme.title}
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
                  {announcementTitle ? (
                    <>
                      الإعلان:{' '}
                      <strong style={{ color: 'var(--text-secondary)' }}>
                        "{announcementTitle}"
                      </strong>
                    </>
                  ) : (
                    theme.description
                  )}
                </p>

                {/* Info Box */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 14px',
                    backgroundColor: theme.gradient,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    marginBottom: '1rem',
                  }}
                >
                  <span
                    style={{
                      color: theme.accent,
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {theme.infoIcon}
                  </span>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: theme.color,
                      lineHeight: 1.55,
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    {theme.infoText}
                  </div>
                </div>

                {/* Reason Field */}
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
                  {theme.reasonLabel}{' '}
                  {theme.reasonOptional && (
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontWeight: 500,
                      }}
                    >
                      (اختياري)
                    </span>
                  )}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isLoading}
                  placeholder={theme.reasonPlaceholder}
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
                    minWidth: '140px',
                    padding: '11px 16px',
                    borderRadius: '11px',
                    border: 'none',
                    background: theme.buttonGradient,
                    color: theme.buttonColor,
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    boxShadow: `0 4px 16px ${theme.buttonShadow}`,
                    transition: 'all 0.2s ease',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (isLoading) return;
                    e.currentTarget.style.boxShadow = `0 8px 24px ${theme.buttonShadowHover}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 4px 16px ${theme.buttonShadow}`;
                  }}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        style={{ width: '13px', height: '13px' }}
                      />
                      {theme.loadingLabel}
                    </>
                  ) : (
                    <>
                      {isDisable ? <FaPause size={12} /> : <FaPlay size={12} />}
                      {theme.actionLabel}
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

export default DisableConfirmModal;