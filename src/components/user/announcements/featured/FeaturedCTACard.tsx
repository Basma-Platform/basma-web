import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaStar,
  FaRocket,
  FaEye,
  FaArrowLeft,
  FaCheckCircle,
} from 'react-icons/fa';
import { getFeaturedBenefits } from '../../../../utils/featuredHelpers';

interface FeaturedCTACardProps {
  announcementId: number;
  /** Optional: from suggestion in create response */
  benefits?: string[];
  variant?: 'success' | 'inline';
}

const DEFAULT_BENEFITS = getFeaturedBenefits();

const FeaturedCTACard = ({
  announcementId,
  benefits = DEFAULT_BENEFITS,
  variant = 'success',
}: FeaturedCTACardProps) => {
  const isSuccess = variant === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      dir="rtl"
      style={{ fontFamily: 'Cairo, sans-serif' }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          padding: isSuccess ? '1.75rem 1.5rem' : '1.5rem',
          background:
            'linear-gradient(135deg, rgba(245,166,35,0.12) 0%, rgba(232,122,32,0.06) 50%, rgba(139,90,43,0.04) 100%)',
          backgroundColor: 'var(--bg-card)',
          border: '1.5px solid rgba(245,166,35,0.35)',
          boxShadow: '0 8px 32px rgba(245,166,35,0.15)',
        }}
      >
        {/* ============================================ */}
        {/* Decorative Background */}
        {/* ============================================ */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '-60px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(245,166,35,0.15), transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(232,122,32,0.12), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* ============================================ */}
          {/* Header: Icon + Badge */}
          {/* ============================================ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              position: 'relative',
            }}
          >
            <motion.div
              animate={{
                y: [0, -6, 0],
                rotate: [0, 3, -3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F5A623, #E87A20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow:
                  '0 12px 32px rgba(245,166,35,0.5), inset 0 -4px 12px rgba(0,0,0,0.1)',
                position: 'relative',
              }}
            >
              <FaStar size={32} />

              {/* Sparkle effects */}
              <motion.span
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                }}
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, #FFF 30%, transparent 70%)',
                  filter: 'blur(1px)',
                }}
              />
              <motion.span
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1,
                }}
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '-6px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, #FFF 40%, transparent 70%)',
                  filter: 'blur(1px)',
                }}
              />
            </motion.div>

            {/* "مميز" Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                delay: 0.4,
              }}
              style={{
                position: 'absolute',
                top: '-4px',
                right: 'calc(50% - 62px)',
                padding: '4px 12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #E87A20, #D46A1A)',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                boxShadow: '0 4px 12px rgba(232,122,32,0.4)',
                letterSpacing: '0.5px',
              }}
            >
              ✨ مميز
            </motion.div>
          </div>

          {/* ============================================ */}
          {/* Title */}
          {/* ============================================ */}
          <h3
            style={{
              textAlign: 'center',
              fontSize: isSuccess ? '1.25rem' : '1.1rem',
              fontWeight: 900,
              color: 'var(--text-secondary)',
              margin: '0 0 8px',
              fontFamily: 'Cairo, sans-serif',
              lineHeight: 1.35,
            }}
          >
            اجعل إعلانك مميزاً 🚀
          </h3>

          {/* ============================================ */}
          {/* Subtitle */}
          {/* ============================================ */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              margin: '0 0 1.25rem',
              fontFamily: 'Cairo, sans-serif',
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            اجعل إعلانك يصل إلى{' '}
            <strong style={{ color: 'var(--primary-orange)' }}>
              آلاف المستخدمين
            </strong>{' '}
            بزيادة في المشاهدات تصل إلى{' '}
            <strong style={{ color: '#F5A623' }}>10 أضعاف</strong>
          </p>

          {/* ============================================ */}
          {/* Benefits Grid */}
          {/* ============================================ */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
              marginBottom: '1.25rem',
            }}
          >
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + idx * 0.08 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(245,166,35,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FaCheckCircle size={11} color="#E87A20" />
                </div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.35,
                  }}
                >
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>

          {/* ============================================ */}
          {/* Stats Preview (for success variant) */}
          {/* ============================================ */}
          {isSuccess && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                gap: '10px',
                padding: '12px 16px',
                marginBottom: '1.25rem',
                backgroundColor: 'var(--bg-input)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
              }}
            >
              <StatItem
                Icon={<FaEye size={16} />}
                value="10x"
                label="مشاهدات"
              />
              <div
                style={{
                  width: '1px',
                  height: '30px',
                  backgroundColor: 'var(--border-color)',
                }}
              />
              <StatItem
                Icon={<FaRocket size={16} />}
                value="أعلى"
                label="في البحث"
              />
              <div
                style={{
                  width: '1px',
                  height: '30px',
                  backgroundColor: 'var(--border-color)',
                }}
              />
              <StatItem
                Icon={<FaStar size={16} />}
                value="ذهبية"
                label="شارة مميزة"
              />
            </div>
          )}

          {/* ============================================ */}
          {/* CTA Button */}
          {/* ============================================ */}
          <Link
            to={`/user/announcements/${announcementId}/feature`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <motion.button
              type="button"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: '14px',
                border: 'none',
                background:
                  'linear-gradient(135deg, #F5A623 0%, #E87A20 100%)',
                color: '#FFFFFF',
                fontFamily: 'Cairo, sans-serif',
                fontSize: isSuccess ? '1rem' : '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(245,166,35,0.4)',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 14px 32px rgba(245,166,35,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(245,166,35,0.4)';
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatDelay: 1,
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '50px',
                  height: '100%',
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                  pointerEvents: 'none',
                }}
              />
              <FaStar size={16} />
              <span>ميّز إعلانك الآن</span>
              <FaArrowLeft size={13} />
            </motion.button>
          </Link>

          {/* Note */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              marginTop: '12px',
              marginBottom: 0,
              fontFamily: 'Cairo, sans-serif',
              opacity: 0.8,
            }}
          >
            💰 بسعر رمزي • يُراجع خلال 24 ساعة
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// Helper Component
// ============================================
interface StatItemProps {
  Icon: React.ReactNode;
  value: string;
  label: string;
}

const StatItem = ({ Icon, value, label }: StatItemProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      flex: 1,
    }}
  >
    <span style={{ color: '#E87A20', fontSize: '1rem' }}>{Icon}</span>
    <span
      style={{
        fontSize: '0.95rem',
        fontWeight: 900,
        color: 'var(--text-secondary)',
        fontFamily: 'Cairo, sans-serif',
        lineHeight: 1,
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontSize: '0.65rem',
        color: 'var(--text-muted)',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {label}
    </span>
  </div>
);

export default FeaturedCTACard;