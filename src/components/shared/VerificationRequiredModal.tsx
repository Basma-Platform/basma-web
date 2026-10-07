import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaShieldAlt,
  FaCheckCircle,
  FaLock,
  FaArrowLeft,
  FaStar,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface VerificationRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  reason?: string;
  benefits?: string[];
  redirectTo?: string;
}

// ============================================
// ✅ EXACT PATH → ARABIC (highest priority)
// ============================================
const PATH_TO_ARABIC: Record<string, string> = {
  '/user/basma-fund/help-requests': 'طلبات المساعدة',
  '/user/basma-fund/help-requests/create': 'تقديم طلب مساعدة',
  '/user/community-posts': 'منشورات المجتمع',
  '/user/community-posts/create': 'إنشاء منشور جديد',
  '/user/my-announcements': 'خدماتي',
  '/user/announcements/create': 'نشر عرض أو طلب',
  '/user/featured-requests': 'طلبات التمييز',
  '/user/my-reviews': 'تقييماتي',
  '/user/verify-identity': 'التحقق من الهوية',
};

// ============================================
// ✅ URL SLUG → ARABIC (fallback for segments)
// ============================================
const SLUG_TO_ARABIC: Record<string, string> = {
  'basma-fund': 'صندوق بصمة',
  'help-requests': 'طلبات المساعدة',
  create: 'تقديم طلب',
  'community-posts': 'منشورات المجتمع',
  announcements: 'تبادل الخدمات',
  'my-announcements': 'خدماتي',
  'featured-requests': 'طلبات التمييز',
  'my-reviews': 'تقييماتي',
  'verify-identity': 'التحقق من الهوية',
};

const GENERIC_REASON =
  'للوصول إلى هذه الميزة، يجب توثيق هويتك أولاً. التوثيق يضمن مجتمعاً آمناً وموثوقاً للجميع.';

const GENERIC_BENEFITS = [
  'الوصول إلى ميزات حساسة',
  'مصداقية أعلى مع المجتمع',
  'حماية أفضل لبياناتك',
];

const ARABIC_REGEX = /[\u0600-\u06FF]/;

/**
 * ✅ Bulletproof resolver — never returns English.
 */
const resolveDisplayName = (
  rawFeatureName: string,
  redirectTo?: string
): string => {
  // 1. Already Arabic → keep
  if (rawFeatureName && ARABIC_REGEX.test(rawFeatureName)) {
    return rawFeatureName;
  }

  // 2. Exact match on redirectTo
  if (redirectTo && PATH_TO_ARABIC[redirectTo]) {
    return PATH_TO_ARABIC[redirectTo];
  }

  // 3. Exact match on featureName in PATH_TO_ARABIC
  if (rawFeatureName && PATH_TO_ARABIC[rawFeatureName]) {
    return PATH_TO_ARABIC[rawFeatureName];
  }

  // 4. Exact match on redirectTo in SLUG_TO_ARABIC
  if (redirectTo && SLUG_TO_ARABIC[redirectTo]) {
    return SLUG_TO_ARABIC[redirectTo];
  }

  // 5. Exact match on featureName in SLUG_TO_ARABIC
  if (rawFeatureName && SLUG_TO_ARABIC[rawFeatureName]) {
    return SLUG_TO_ARABIC[rawFeatureName];
  }

  // 6. Walk redirectTo segments — composite then singles
  if (redirectTo) {
    const parts = redirectTo.split('/').filter(Boolean);
    for (let i = 0; i < parts.length; i++) {
      for (let j = parts.length; j > i; j--) {
        const composite = parts.slice(i, j).join('/');
        if (SLUG_TO_ARABIC[composite]) return SLUG_TO_ARABIC[composite];
      }
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      if (SLUG_TO_ARABIC[parts[i]]) return SLUG_TO_ARABIC[parts[i]];
    }
  }

  // 7. Walk featureName segments
  if (rawFeatureName) {
    const parts = rawFeatureName.split('/').filter(Boolean);
    for (let i = parts.length - 1; i >= 0; i--) {
      if (SLUG_TO_ARABIC[parts[i]]) return SLUG_TO_ARABIC[parts[i]];
    }
  }

  // 8. Absolute fallback — never raw input
  return 'ميزة محمية';
};

const VerificationRequiredModal = ({
  isOpen,
  onClose,
  featureName,
  reason,
  benefits,
  redirectTo,
}: VerificationRequiredModalProps) => {
  const handleClose = () => {
    onClose();
  };

  const displayFeatureName = resolveDisplayName(featureName, redirectTo);
  const displayReason =
    reason && ARABIC_REGEX.test(reason) ? reason : GENERIC_REASON;
  const displayBenefits =
    benefits && benefits.length > 0 ? benefits : GENERIC_BENEFITS;

  const verifyUrl = redirectTo
    ? `/user/verify-identity?redirect=${encodeURIComponent(redirectTo)}`
    : '/user/verify-identity';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            direction: 'rtl',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              boxShadow:
                '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              position: 'relative',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                position: 'relative',
                padding: '2.25rem 1.5rem 1.75rem',
                background:
                  'linear-gradient(160deg, rgba(232,122,32,0.12) 0%, rgba(232,122,32,0.04) 40%, transparent 70%)',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <motion.div
                animate={{
                  opacity: [0.3, 0.55, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  top: '-60px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '240px',
                  height: '240px',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(232,122,32,0.35) 0%, transparent 65%)',
                  pointerEvents: 'none',
                }}
              />

              <button
                type="button"
                onClick={handleClose}
                aria-label="إغلاق"
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(220,53,69,0.12)';
                  e.currentTarget.style.color = '#DC3545';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                <FaTimes size={13} />
              </button>

              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                  style={{
                    position: 'relative',
                    width: '72px',
                    height: '72px',
                  }}
                >
                  <motion.span
                    animate={{
                      scale: [1, 1.18, 1],
                      opacity: [0.5, 0.15, 0.5],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      position: 'absolute',
                      inset: '-8px',
                      borderRadius: '50%',
                      border: '2px solid rgba(232,122,32,0.5)',
                      pointerEvents: 'none',
                    }}
                  />

                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, #E87A20 0%, #F5A623 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow:
                        '0 12px 28px rgba(232,122,32,0.45), inset 0 -4px 8px rgba(0,0,0,0.1)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <FaShieldAlt size={30} />
                  </div>

                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 15,
                      delay: 0.4,
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#DC3545',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2.5px solid var(--bg-card)',
                      boxShadow: '0 4px 12px rgba(220,53,69,0.4)',
                      zIndex: 2,
                    }}
                  >
                    <FaLock size={9} />
                  </motion.span>
                </motion.div>
              </div>

              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                style={{
                  textAlign: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: 'var(--text-secondary)',
                  margin: '0 0 6px',
                  lineHeight: 1.4,
                }}
              >
                ميزة تتطلب التوثيق
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.3 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(232,122,32,0.12)',
                    color: 'var(--primary-orange)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    border: '1px solid rgba(232,122,32,0.25)',
                  }}
                >
                  <FaLock size={9} />
                  {displayFeatureName}
                </span>
              </motion.div>
            </div>

            {/* Body */}
            <div
              style={{
                padding: '0 1.5rem 1rem',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                style={{
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.75,
                  margin: '0 0 1.25rem',
                }}
              >
                {displayReason}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                style={{
                  padding: '1rem 1.15rem',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: 'var(--text-secondary)',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FaStar size={11} color="#FFC107" />
                  ما ستحصل عليه بعد التوثيق
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {displayBenefits.map((b, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.45 + i * 0.06,
                        duration: 0.25,
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.55,
                      }}
                    >
                      <FaCheckCircle
                        size={13}
                        color="#28A745"
                        style={{ flexShrink: 0, marginTop: '3px' }}
                      />
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 12px',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  opacity: 0.85,
                }}
              >
                <FaShieldAlt size={10} color="#17A2B8" />
                <span>بياناتك مشفرة ومحمية — تُستخدم للتحقق فقط</span>
              </motion.div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '1rem 1.5rem 1.35rem',
                display: 'flex',
                gap: '10px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                flexWrap: 'wrap',
                flexShrink: 0,
              }}
            >
              <motion.button
                type="button"
                onClick={handleClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: '1 1 100px',
                  minWidth: '100px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--text-muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                ربما لاحقاً
              </motion.button>

              <Link
                to={verifyUrl}
                onClick={handleClose}
                style={{
                  flex: '2 1 0',
                  minWidth: '160px',
                  textDecoration: 'none',
                }}
              >
                <motion.button
                  type="button"
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    padding: '13px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background:
                      'linear-gradient(135deg, #E87A20 0%, #F5A623 100%)',
                    color: '#FFFFFF',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow:
                      '0 8px 24px rgba(232,122,32,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <motion.span
                    initial={{ x: '100%' }}
                    animate={{ x: '-150%' }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      repeatDelay: 1.2,
                      ease: 'easeInOut',
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      width: '80px',
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                      pointerEvents: 'none',
                      skewX: '-15deg',
                    }}
                  />
                  <FaShieldAlt size={14} />
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    وثّق الآن
                  </span>
                  <FaArrowLeft size={12} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerificationRequiredModal;