import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHandHoldingHeart, FaUserShield, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthorization } from '../../../hooks/useAuthorization';

/**
 * Bottom CTA — encourages verified users to submit a help request,
 * or guests to register.
 *
 * Rules:
 *  - Hidden entirely for admins (they don't submit help requests)
 *  - Content centered on mobile
 *  - Button stacks below the text on < 640px
 */
const FundCTASection = () => {
  const { isAuthenticated, user } = useAuth();
  const { isAdmin } = useAuthorization();

  // ✅ Admin never sees this — not a relevant action for them
  if (isAdmin) return null;

  const isVerified = !!user?.is_verified;

  const targetPath = isAuthenticated
    ? isVerified
      ? '/user/basma-fund/help-requests/create'
      : '/user/verify-identity'
    : '/register';

  const ctaLabel = isAuthenticated
    ? isVerified
      ? 'قدّم طلب مساعدة'
      : 'وثّق هويتك أولاً'
    : 'انضم إلينا';

  const helperText = isVerified
    ? 'احصل على المساعدة التي تحتاجها، سرّاً وآمناً.'
    : isAuthenticated
    ? 'التوثيق شرط أساسي لتقديم طلب مساعدة.'
    : 'أنشئ حساباً موثقاً للاستفادة من صندوق بصمة.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55 }}
      className="fund-cta"
      style={{
        marginTop: '2.5rem',
        padding: 'clamp(1.5rem, 4vw, 2.25rem)',
        borderRadius: '24px',
        background:
          'linear-gradient(135deg, #138496 0%, #17A2B8 55%, #20C9E0 100%)',
        color: '#FFFFFF',
        fontFamily: 'Cairo, sans-serif',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 16px 40px rgba(23,162,184,0.3)',
      }}
    >
      {/* ============================================ */}
      {/* Shimmer sweep */}
      {/* ============================================ */}
      <motion.div
        aria-hidden="true"
        initial={{ x: '-120%' }}
        animate={{ x: '220%' }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          repeatDelay: 2.5,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '40%',
          background:
            'linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.28) 50%, transparent 80%)',
          transform: 'skewX(-18deg)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Corner glows */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          left: '-60px',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-60px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating particles */}
      {[
        { left: '12%', delay: 0, size: 6 },
        { left: '48%', delay: 1.2, size: 4 },
        { left: '78%', delay: 2.4, size: 5 },
      ].map((p, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          animate={{
            y: [30, -80],
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ))}

      {/* Animated right accent bar */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '18%',
          bottom: '18%',
          right: 0,
          width: '4px',
          borderRadius: '4px 0 0 4px',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.15))',
          transformOrigin: 'center',
          zIndex: 1,
        }}
      />

      {/* ============================================ */}
      {/* Content wrapper — grid for responsive layout */}
      {/* ============================================ */}
      <div className="fund-cta__content">
        {/* Left: icon + text */}
        <div className="fund-cta__info">
          <motion.div
            animate={{
              scale: [1, 1.08, 1, 1.05, 1],
              rotate: [0, 4, -4, 3, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
            className="fund-cta__icon"
            style={{
              background: 'rgba(255,255,255,0.22)',
              border: '1px solid rgba(255,255,255,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              backdropFilter: 'blur(6px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            {isVerified ? (
              <FaHandHoldingHeart size={22} />
            ) : (
              <FaUserShield size={22} />
            )}
          </motion.div>

          <div className="fund-cta__text" style={{ minWidth: 0 }}>
            <h3
              style={{
                fontSize: 'clamp(1.05rem, 3vw, 1.3rem)',
                fontWeight: 900,
                margin: '0 0 4px',
                color: '#FFFFFF',
                lineHeight: 1.25,
              }}
            >
              هل تحتاج مساعدة؟
            </h3>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.9)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {helperText}
            </p>
          </div>
        </div>

        {/* Right: CTA button */}
        <Link
          to={targetPath}
          className="fund-cta__button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '13px 24px',
            borderRadius: '14px',
            backgroundColor: '#FFFFFF',
            color: '#138496',
            fontWeight: 800,
            fontSize: '0.9rem',
            textDecoration: 'none',
            boxShadow: '0 8px 22px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            whiteSpace: 'nowrap',
            position: 'relative',
            zIndex: 2,
            overflow: 'hidden',
          }}
        >
          <span className="fund-cta__shine" aria-hidden="true" />

          {ctaLabel}
          <span className="fund-cta__arrow">
            <FaArrowLeft size={11} />
          </span>
        </Link>
      </div>

      {/* Grain texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
          opacity: 0.05,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ============================================ */}
      {/* Scoped styles */}
      {/* ============================================ */}
      <style>{`
        /* ✅ Desktop: side-by-side */
        .fund-cta__content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .fund-cta__info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1 1 320px;
          min-width: 0;
        }

        .fund-cta__icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
        }

        /* ✅ Mobile: stack vertically + center everything */
        @media (max-width: 640px) {
          .fund-cta__content {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 1.25rem;
          }

          .fund-cta__info {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            flex: 0 1 auto;
            gap: 12px;
          }

          .fund-cta__text {
            text-align: center;
          }

          .fund-cta__icon {
            width: 60px;
            height: 60px;
          }

          .fund-cta__button {
            width: 100%;
            max-width: 320px;
          }
        }

        /* Button interactions */
        .fund-cta__button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }
        .fund-cta__button:active {
          transform: translateY(0);
        }
        .fund-cta__arrow {
          display: inline-flex;
          transition: transform 0.25s ease;
        }
        .fund-cta__button:hover .fund-cta__arrow {
          transform: translateX(-4px);
        }
        .fund-cta__shine {
          position: absolute;
          top: 0;
          bottom: 0;
          left: -60%;
          width: 40%;
          background: linear-gradient(
            100deg,
            transparent 20%,
            rgba(23, 162, 184, 0.22) 50%,
            transparent 80%
          );
          transform: skewX(-18deg);
          transition: left 0.6s ease;
          pointer-events: none;
        }
        .fund-cta__button:hover .fund-cta__shine {
          left: 120%;
        }

        @media (prefers-reduced-motion: reduce) {
          .fund-cta__button,
          .fund-cta__arrow,
          .fund-cta__shine {
            transition: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default FundCTASection;