import { motion, AnimatePresence } from 'framer-motion';
import {
  FaExclamationTriangle,
  FaTimes,
  FaIdCard,
  FaBan,
  FaRedo,
  FaArrowLeft,
  FaShieldAlt,
} from 'react-icons/fa';

interface NameChangeWarningModalProps {
  isOpen: boolean;
  oldName: string;
  newName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const NameChangeWarningModal = ({
  isOpen,
  oldName,
  newName,
  onConfirm,
  onCancel,
  isLoading = false,
}: NameChangeWarningModalProps) => {
  const handleClose = () => {
    if (isLoading) return;
    onCancel();
  };

  // ============================================
  // Warning Points
  // ============================================
  const warningPoints = [
    {
      icon: <FaIdCard size={14} />,
      color: '#DC3545',
      bg: 'rgba(220,53,69,0.1)',
      title: 'سيتم إلغاء شارة "موثق"',
      description: 'سيفقد حسابك شارة التوثيق التي حصلت عليها',
    },
    {
      icon: <FaBan size={14} />,
      color: '#F5A623',
      bg: 'rgba(245,166,35,0.1)',
      title: 'ستعود للحد الشهري العادي',
      description: '5 إعلانات كحد أقصى شهرياً بدلاً من عدد غير محدود',
    },
    {
      icon: <FaRedo size={14} />,
      color: '#17A2B8',
      bg: 'rgba(23,162,184,0.1)',
      title: 'ستحتاج لإعادة التوثيق',
      description: 'يجب رفع وثيقة الهوية مرة أخرى وانتظار المراجعة',
    },
  ];

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
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            fontFamily: 'Cairo, sans-serif',
          }}
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
              overflow: 'hidden',
              position: 'relative',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ============================================ */}
            {/* Close Button */}
            {/* ============================================ */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                width: '32px',
                height: '32px',
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
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (isLoading) return;
                e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.1)';
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

            {/* ============================================ */}
            {/* Content */}
            {/* ============================================ */}
            <div
              style={{
                padding: '1.75rem 1.5rem 1.25rem',
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
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 18,
                    delay: 0.1,
                  }}
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, rgba(220,53,69,0.15), rgba(220,53,69,0.06))',
                    border: '2px solid rgba(220,53,69,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FaExclamationTriangle size={32} color="#DC3545" />
                  </motion.div>

                  {/* Pulsing ring */}
                  <motion.span
                    animate={{
                      scale: [1, 1.35, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    style={{
                      position: 'absolute',
                      inset: -4,
                      borderRadius: '50%',
                      border: '2px solid #DC3545',
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
                  lineHeight: 1.35,
                }}
              >
                تنبيه: سيتم إلغاء توثيق حسابك
              </h3>

              {/* Description */}
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  margin: '0 0 1.25rem',
                }}
              >
                تغيير اسمك من{' '}
                <strong style={{ color: 'var(--text-secondary)' }}>
                  "{oldName}"
                </strong>{' '}
                إلى{' '}
                <strong style={{ color: 'var(--primary-orange)' }}>
                  "{newName}"
                </strong>{' '}
                سيؤدي إلى إلغاء توثيق حسابك.
              </p>

              {/* Warning Points */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '1.25rem',
                }}
              >
                {warningPoints.map((point, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.15 + idx * 0.08,
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        backgroundColor: point.bg,
                        color: point.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {point.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          color: point.color,
                          marginBottom: '2px',
                        }}
                      >
                        {point.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.55,
                        }}
                      >
                        {point.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Info Notice */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(23,162,184,0.06)',
                  border: '1px solid rgba(23,162,184,0.2)',
                  borderRadius: '10px',
                }}
              >
                <FaShieldAlt
                  size={12}
                  color="#17A2B8"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.55,
                  }}
                >
                  <strong style={{ color: 'var(--text-secondary)' }}>
                    لماذا؟
                  </strong>{' '}
                  لأسباب أمنية، يجب مطابقة الاسم في وثيقة الهوية مع الاسم في
                  حسابك. يمكنك إعادة التوثيق في أي وقت.
                </div>
              </div>
            </div>

            {/* ============================================ */}
            {/* Actions Footer */}
            {/* ============================================ */}
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
                onClick={onConfirm}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                style={{
                  flex: '1 1 200px',
                  minWidth: '180px',
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  background: isLoading
                    ? 'var(--primary-brown-light)'
                    : 'linear-gradient(135deg, #DC3545, #B02A37)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: isLoading
                    ? 'none'
                    : '0 4px 16px rgba(220,53,69,0.35)',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ width: '13px', height: '13px' }}
                    />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <FaArrowLeft size={12} />
                    نعم، احفظ وابدأ التوثيق
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

export default NameChangeWarningModal;