import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../hooks/useAuth';
import { CommunityIcons } from '../../../utils/communityIcons';
import { COMMUNITY_THEME } from '../../../utils/communityHelpers';
import { FaBullhorn } from 'react-icons/fa';

const CommunityHero = () => {
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const canPost = user?.is_verified === true;

  const getCta = () => {
    if (!isAuthenticated) {
      return { label: 'انضم للنشر في المجتمع', to: '/register' };
    }
    if (canPost) {
      return {
        label: 'انشر منشوراً جديداً',
        to: '/user/community-posts/create',
      };
    }
    return { label: 'وثّق حسابك للنشر', to: '/user/verify-identity' };
  };

  const cta = getCta();

  return (
    <section
      style={{
        paddingTop: '110px',
        paddingBottom: '3.5rem',
        backgroundColor: 'var(--bg-body)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Ambient decorative circles */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          backgroundColor: isDark
            ? 'rgba(156, 39, 176, 0.10)'
            : 'rgba(156, 39, 176, 0.07)',
          pointerEvents: 'none',
          filter: 'blur(30px)',
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-60px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          backgroundColor: isDark
            ? 'rgba(156, 39, 176, 0.08)'
            : 'rgba(156, 39, 176, 0.05)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}
        >
          {/* Icon with pulse */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: COMMUNITY_THEME.gradient,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: `0 12px 40px ${COMMUNITY_THEME.shadow}`,
              position: 'relative',
            }}
          >
            <FaBullhorn size={34} />

            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '24px',
                border: `2px solid ${COMMUNITY_THEME.accent}`,
                pointerEvents: 'none',
              }}
            />
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              width: '60px',
              height: '4px',
              backgroundColor: COMMUNITY_THEME.accent,
              borderRadius: '2px',
              margin: '0 auto 1.25rem',
            }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '1rem',
              lineHeight: 1.25,
            }}
          >
            منشورات المجتمع
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
              fontFamily: 'Cairo, sans-serif',
              lineHeight: 1.9,
              margin: '0 auto 2rem',
              maxWidth: '640px',
              textAlign: 'center',
            }}
          >
            مساحة مجتمعية للتوعية والتنبيه: تحذيرات أمنية، منشورات
            مفقود/موجود، وإعلانات عامة تخدم أهالي منطقتك.
          </motion.p>

          {/* ✅ CTA with enhanced animation (pulse + glow) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ display: 'inline-block', position: 'relative' }}
          >
            {/* Pulse ring behind CTA */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '30px',
                background: COMMUNITY_THEME.gradient,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Glow ring */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.4,
              }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '30px',
                border: `2px solid ${COMMUNITY_THEME.accent}`,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <motion.div
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <Link
                to={cta.to}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 34px',
                  borderRadius: '30px',
                  background: COMMUNITY_THEME.gradient,
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: `0 8px 24px ${COMMUNITY_THEME.shadow}`,
                  transition: 'box-shadow 0.25s ease',
                }}
              >
                <motion.span
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ display: 'inline-flex' }}
                >
                  <CommunityIcons.add size={14} />
                </motion.span>
                {cta.label}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CommunityHero;