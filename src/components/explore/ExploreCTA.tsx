import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaExchangeAlt,
  FaHandHoldingHeart,
  FaBullhorn,
  FaArrowLeft,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { getPostAuthPath } from '../../utils/authRedirect';
import { EXPLORE_COPY, EXPLORE_DESIGN } from '../../utils/exploreHelpers';

const EASE = EXPLORE_DESIGN.ease_out_expo;

const FLOATING_ICONS = [
  { Icon: FaExchangeAlt, x: '8%', y: '20%', delay: 0.5 },
  { Icon: FaHandHoldingHeart, x: '86%', y: '28%', delay: 0.8 },
  { Icon: FaBullhorn, x: '14%', y: '74%', delay: 1.1 },
];

const ExploreCTA = () => {
  const { isAuthenticated, user } = useAuth();
  const authedLink = user ? getPostAuthPath(user) : '/register';
  const needsVerification = authedLink === '/verify-email';

  const primaryLabel = !isAuthenticated
    ? EXPLORE_COPY.cta_primary
    : needsVerification
      ? 'تفعيل البريد الإلكتروني'
      : 'العودة إلى لوحة التحكم';

  return (
    <section
      style={{
        paddingTop: 'clamp(3rem, 6vw, 4rem)',
        paddingBottom: 'clamp(3.5rem, 7vw, 5rem)',
        backgroundColor: 'var(--bg-white)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            position: 'relative',
            borderRadius: '28px',
            overflow: 'hidden',
            background:
              'linear-gradient(135deg, #E87A20 0%, #D46A1A 40%, #8B5A2B 100%)',
            padding: 'clamp(2.25rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem)',
            textAlign: 'center',
            boxShadow: '0 24px 64px rgba(232, 122, 32, 0.35)',
          }}
        >
          {/* Soft glows */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              pointerEvents: 'none',
              filter: 'blur(30px)',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            style={{
              position: 'absolute',
              bottom: '-120px',
              left: '-80px',
              width: '340px',
              height: '340px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.12)',
              pointerEvents: 'none',
              filter: 'blur(40px)',
            }}
          />

          {/* Floating pillar icons */}
          {FLOATING_ICONS.map(({ Icon, x, y, delay }, idx) => (
            <motion.div
              key={idx}
              animate={{
                y: [0, -12, 0],
                rotate: [0, 5, 0],
                opacity: [0.08, 0.15, 0.08],
              }}
              transition={{
                duration: 7 + idx,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
              }}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                color: '#FFFFFF',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              <Icon size={44} />
            </motion.div>
          ))}

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.35,
                margin: '0 0 1rem',
                textShadow: '0 2px 12px rgba(0,0,0,0.15)',
              }}
            >
              {EXPLORE_COPY.cta_title}
            </h2>

            <p
              style={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.9,
                maxWidth: '580px',
                margin: '0 auto 2rem',
              }}
            >
              {EXPLORE_COPY.cta_description}
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link
                to={isAuthenticated ? authedLink : '/register'}
                className="explore-cta-btn explore-cta-btn--primary"
              >
                {primaryLabel}
              </Link>

              <Link
                to={EXPLORE_COPY.cta_secondary_path}
                className="explore-cta-btn explore-cta-btn--ghost"
              >
                {EXPLORE_COPY.cta_secondary}
                <FaArrowLeft size={12} />
              </Link>
            </div>

            {!isAuthenticated && (
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.88)',
                  fontSize: '0.82rem',
                  fontFamily: 'Cairo, sans-serif',
                  margin: '1.25rem 0 0',
                  lineHeight: 1.6,
                }}
              >
                التسجيل مجاني وسريع — ولا يتطلب أي رسوم.
              </p>
            )}
          </div>
        </motion.div>
      </Container>

      <style>{`
        .explore-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
          padding: 13px 32px;
          border-radius: 999px;
          font-family: 'Cairo', sans-serif;
          font-size: 1rem;
          font-weight: 800;
          text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease,
            background-color 0.25s ease;
        }

        /* Explicit colors on :hover so the global a:hover rule
           (orange-dark text) can never wash these out. */
        .explore-cta-btn--primary,
        .explore-cta-btn--primary:hover,
        .explore-cta-btn--primary:focus {
          background-color: #FFFFFF;
          color: #D46A1A;
        }
        .explore-cta-btn--primary {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        }
        .explore-cta-btn--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.24);
        }

        .explore-cta-btn--ghost,
        .explore-cta-btn--ghost:hover,
        .explore-cta-btn--ghost:focus {
          color: #FFFFFF;
        }
        .explore-cta-btn--ghost {
          background-color: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.6);
        }
        .explore-cta-btn--ghost:hover {
          background-color: rgba(255, 255, 255, 0.22);
          transform: translateY(-2px);
        }

        @media (max-width: 480px) {
          .explore-cta-btn {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .explore-cta-btn {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
};

export default ExploreCTA;
