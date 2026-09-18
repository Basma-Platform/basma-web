import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimes, FaUserCheck, FaMagic } from 'react-icons/fa';

interface AdminApproveModalProps {
  isOpen: boolean;
  userName?: string;
  onConfirm: (notes?: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const APPROVE_TEMPLATES = [
  'تم التحقق من صحة ومطابقة بيانات الهوية بنجاح.',
  'صورة الهوية واضحة والبيانات مطابقة للملف الشخصي.',
  'تم الاعتماد بنجاح، شكراً لتعاونكم.',
];

const AdminApproveModal = ({
  isOpen,
  userName,
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminApproveModalProps) => {
  const [notes, setNotes] = useState('');
  const MAX_LENGTH = 500;

  const handleClose = () => {
    if (isLoading) return;
    setNotes('');
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
              maxWidth: '460px',
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
                zIndex: 2,
                opacity: isLoading ? 0.5 : 1,
              }}
              aria-label="إغلاق"
            >
              <FaTimes size={12} />
            </button>

            <div
              style={{
                padding: '1.75rem 1.5rem 1.5rem',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {/* Icon with Animation */}
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
                      'linear-gradient(135deg, rgba(40,167,69,0.15), rgba(40,167,69,0.06))',
                    border: '2px solid rgba(40,167,69,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <FaCheckCircle size={30} color="#28A745" />
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
                      border: '2px solid #28A745',
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
                }}
              >
                تأكيد الموافقة على التحقق
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
                {userName ? (
                  <>
                    سيتم منح{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      "{userName}"
                    </strong>{' '}
                    شارة التوثيق، وستصبح مزايا الحساب الموثق مفعّلة تلقائياً.
                  </>
                ) : (
                  'سيتم منح المستخدم شارة التوثيق وستُفعّل مزايا الحساب الموثق.'
                )}
              </p>

              {/* Info Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 14px',
                  background:
                    'linear-gradient(135deg, rgba(40,167,69,0.08), rgba(40,167,69,0.03))',
                  border: '1px solid rgba(40,167,69,0.25)',
                  borderRadius: '12px',
                  marginBottom: '1.25rem',
                }}
              >
                <FaUserCheck
                  size={14}
                  color="#28A745"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: '#28A745',
                    lineHeight: 1.55,
                  }}
                >
                  سيتم إشعار المستخدم بالبريد الإلكتروني وبإشعار داخلي فور
                  الموافقة. كما سيُسجَّل إجراءك في سجل النشاط.
                </div>
              </div>

              {/* Quick Templates */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    marginBottom: '6px',
                  }}
                >
                  <FaMagic size={11} color="#28A745" />
                  قوالب ملاحظات سريعة:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {APPROVE_TEMPLATES.map((tpl, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      onClick={() => setNotes(tpl)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    >
                      {tpl}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Optional Notes */}
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                ملاحظات إدارية{' '}
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                  (اختياري)
                </span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, MAX_LENGTH))}
                disabled={isLoading}
                placeholder="مثلاً: تم التحقق من صحة الهوية..."
                rows={3}
                maxLength={MAX_LENGTH}
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
                }}
              />
              {notes.length > 0 && (
                <div
                  style={{
                    textAlign: 'left',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    marginTop: '4px',
                  }}
                >
                  {notes.length}/{MAX_LENGTH}
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
              }}
            >
              <motion.button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                style={{
                  flex: 1,
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
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
                  flex: 1,
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #28A745, #1e7e34)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: '0 4px 16px rgba(40,167,69,0.35)',
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
                    نعم، وافق
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

export default AdminApproveModal;