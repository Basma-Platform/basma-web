import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaCheckCircle,
  FaInfoCircle,
  FaMoneyBillWave,
  FaClock,
  FaBolt,
} from 'react-icons/fa';
import {
  formatFeaturedPrice,
  getDurationLabel,
} from '../../../utils/featuredHelpers';

interface AdminApproveFeaturedModalProps {
  isOpen: boolean;
  userName?: string;
  amount?: number;
  currency?: string;
  durationDays?: number;
  onConfirm: (notes?: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const MAX_NOTES = 500;

// ============================================
// Quick-reason templates for approval
// ============================================
const APPROVE_QUICK_REASONS: { label: string; text: string }[] = [
  {
    label: 'تم التحقق من الدفع',
    text: 'تم التحقق من صحة إشعار التحويل ومطابقة المبلغ.',
  },
  {
    label: 'التحويل صحيح',
    text: 'التحويل مطابق للرسوم المطلوبة وتم تأكيده.',
  },
  {
    label: 'إيصال واضح',
    text: 'صورة إشعار التحويل واضحة ومطابقة للبيانات المطلوبة.',
  },
  {
    label: 'تم التفعيل فوراً',
    text: 'تم تفعيل التمييز فور استلام الإشعار.',
  },
];

// ============================================
// Animated Icon Wrapper
//
// The ripple is a SIBLING inside a fixed-size wrapper, so both the
// wrapper and the icon share the exact same dimensions and origin.
// Framer Motion handles the `x: '-50%'` for horizontal centering
// (never a raw CSS `transform`, which framer-motion would override).
// ============================================
const AnimatedSuccessIcon = () => {
  const SIZE = 72;
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
        {/* Ripple ring 1 — pulses out from the icon's border */}
        <motion.span
          initial={{ x: '-50%', y: '-50%', scale: 1, opacity: 0 }}
          animate={{
            x: '-50%',
            y: '-50%',
            scale: [1, 1.6],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 1.4,
            delay: 0.5,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            borderRadius: '50%',
            border: '2px solid #28A745',
            pointerEvents: 'none',
          }}
        />

        {/* Ripple ring 2 — delayed */}
        <motion.span
          initial={{ x: '-50%', y: '-50%', scale: 1, opacity: 0 }}
          animate={{
            x: '-50%',
            y: '-50%',
            scale: [1, 1.9],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 1.4,
            delay: 0.8,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            borderRadius: '50%',
            border: '2px solid #28A745',
            pointerEvents: 'none',
          }}
        />

        {/* Icon circle */}
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
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(40,167,69,0.4)',
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
            <FaCheckCircle size={30} />
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};

const AdminApproveFeaturedModal = ({
  isOpen,
  userName,
  amount,
  currency = 'ILS',
  durationDays,
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminApproveFeaturedModalProps) => {
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

  const handleQuickReason = (text: string) => {
    setNotes(text.slice(0, MAX_NOTES));
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
              {/* Animated Icon */}
              <AnimatedSuccessIcon />

              <h3
                style={{
                  textAlign: 'center',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: 'var(--text-secondary)',
                  margin: '0 0 8px',
                }}
              >
                تأكيد الموافقة
              </h3>

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
                    سيتم تفعيل تمييز إعلان{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      {userName}
                    </strong>{' '}
                    فوراً.
                  </>
                ) : (
                  'سيتم تفعيل تمييز الإعلان فوراً.'
                )}
              </p>

              {/* Summary chips */}
              {(amount != null || durationDays != null) && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '8px',
                    marginBottom: '1.25rem',
                  }}
                >
                  {amount != null && (
                    <div
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          marginBottom: '4px',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <FaMoneyBillWave size={11} />
                        <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                          المبلغ
                        </span>
                      </div>
                      <div
                        style={{
                          color: '#28A745',
                          fontSize: '0.9rem',
                          fontWeight: 900,
                          fontFamily:
                            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                          fontVariantNumeric: 'lining-nums tabular-nums',
                        }}
                      >
                        {formatFeaturedPrice(amount, currency)}
                      </div>
                    </div>
                  )}
                  {durationDays != null && (
                    <div
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          marginBottom: '4px',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <FaClock size={11} />
                        <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                          المدة
                        </span>
                      </div>
                      <div
                        style={{
                          color: '#17A2B8',
                          fontSize: '0.9rem',
                          fontWeight: 900,
                        }}
                      >
                        {getDurationLabel(durationDays)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Info banner */}
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
                  سيتم إشعار المستخدم بالبريد الإلكتروني وبإشعار داخلي فور
                  الموافقة.
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
                  <FaBolt size={11} color="#FFC107" />
                  ملاحظات جاهزة (اختياري):
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  {APPROVE_QUICK_REASONS.map((reason) => (
                    <button
                      key={reason.label}
                      type="button"
                      onClick={() => handleQuickReason(reason.text)}
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
                          'rgba(40,167,69,0.1)';
                        e.currentTarget.style.borderColor = '#28A745';
                        e.currentTarget.style.color = '#28A745';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          'var(--bg-input)';
                        e.currentTarget.style.borderColor =
                          'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      {reason.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes textarea */}
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
                placeholder="اكتب ملاحظة أو اختر من الملاحظات الجاهزة بالأعلى..."
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
              {notes.length > 0 && (
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
                  {notes.length}/{MAX_NOTES}
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

export default AdminApproveFeaturedModal;