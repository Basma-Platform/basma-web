import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaVideo, FaExclamationTriangle, FaEye } from 'react-icons/fa';
import { FUND_THEME } from '../../../utils/helpRequestHelpers';

interface FundVideoWarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  /** عدد المشاهدات المتبقية (مثل 1 أو 3) */
  remainingViews?: number;
  /** الحد الأقصى الكلي (مثل 3) */
  maxViews?: number;
}

const FundVideoWarningModal = ({
  isOpen,
  onConfirm,
  onCancel,
  remainingViews = 1,
  maxViews = 1,
}: FundVideoWarningModalProps) => {
  // ============================================
  // Dynamic text based on remaining views
  // ============================================
  const viewsLabel =
    remainingViews === 1
      ? 'مرة واحدة فقط'
      : remainingViews === 2
      ? 'مرتين فقط'
      : remainingViews <= 10
      ? `${remainingViews} مرات فقط`
      : `${remainingViews} مرة فقط`;

  const bodyText =
    remainingViews === 1
      ? 'يمكنك مشاهدة هذا الفيديو مرة واحدة فقط. لن يمكنك إعادة فتحه بعد ذلك. هل أنت مستعد للمشاهدة الآن؟'
      : `لديك ${viewsLabel} لمشاهدة هذا الفيديو. كل ضغطة تشغيل تستهلك مشاهدة واحدة من رصيدك. هل أنت مستعد للمشاهدة الآن؟`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1095,
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
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              padding: '1.75rem 1.5rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <button
              type="button"
              onClick={onCancel}
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
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaTimes size={12} />
            </button>

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
                position: 'relative',
                width: '72px',
                height: '72px',
                margin: '0 auto 1rem',
                borderRadius: '50%',
                background: FUND_THEME.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: `0 8px 24px ${FUND_THEME.shadow}`,
              }}
            >
              <FaVideo size={28} />

              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 15,
                  delay: 0.45,
                }}
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#FFB800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-card)',
                  boxShadow: '0 4px 12px rgba(255,184,0,0.4)',
                }}
              >
                <motion.span
                  animate={{ rotate: [0, 12, -12, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: 'easeInOut',
                  }}
                  style={{ display: 'inline-flex' }}
                >
                  <FaExclamationTriangle size={12} color="#FFFFFF" />
                </motion.span>
              </motion.span>
            </motion.div>

            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.15rem',
                fontWeight: 900,
                margin: '0 0 10px',
              }}
            >
              ⚠️ تنبيه مهم
            </h3>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                lineHeight: 1.7,
                margin: '0 0 1.25rem',
              }}
            >
              {bodyText}
            </p>

            {/* Views chip */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: `${FUND_THEME.accent}12`,
                border: `1px solid ${FUND_THEME.accent}30`,
                marginBottom: '1.5rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: FUND_THEME.accent,
              }}
            >
              <FaEye size={11} />
              المشاهدات المتاحة:
              <strong
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.9rem',
                }}
              >
                {remainingViews} / {maxViews}
              </strong>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={onCancel}
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
                  cursor: 'pointer',
                }}
              >
                إلغاء
              </button>

              <motion.button
                type="button"
                onClick={onConfirm}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: '1 1 0',
                  minWidth: '140px',
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  background: FUND_THEME.gradient,
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: `0 4px 16px ${FUND_THEME.shadow}`,
                }}
              >
                <FaVideo size={13} />
                مشاهدة الآن
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FundVideoWarningModal;