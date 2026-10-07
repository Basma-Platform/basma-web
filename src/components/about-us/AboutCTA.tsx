import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaExchangeAlt,
  FaHandHoldingHeart,
  FaBullhorn,
  FaArrowLeft,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { getPostAuthPath } from '../../utils/authRedirect';

const AboutCTA = () => {
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const authedLink = user ? getPostAuthPath(user) : '/dashboard';

  // ============================================
  // Three pillars — reused for both views
  // ============================================
  const pillars = [
    {
      Icon: FaExchangeAlt,
      title: 'تبادل الخدمات',
      short: 'اعرض أو اطلب خدمة',
      path: '/announcements',
      color: '#E87A20',
      colorLight: '#F5A623',
    },
    {
      Icon: FaHandHoldingHeart,
      title: 'صندوق بصمة',
      short: 'ادعم حالة موثّقة',
      path: '/basma-fund',
      color: '#17A2B8',
      colorLight: '#20C9E0',
    },
    {
      Icon: FaBullhorn,
      title: 'منشورات المجتمع',
      short: 'انشر ما يهم مجتمعنا',
      path: '/community',
      color: '#9C27B0',
      colorLight: '#BA68C8',
    },
  ];

  return (
    <section
      style={{
        padding: '5rem 0',
        backgroundColor: isDark ? 'var(--bg-body)' : 'var(--primary-orange)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Decorative ambient circles */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          backgroundColor: isDark
            ? 'rgba(232, 122, 32, 0.08)'
            : 'rgba(255, 255, 255, 0.06)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-60px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          backgroundColor: isDark
            ? 'rgba(232, 122, 32, 0.06)'
            : 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none',
        }}
      />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        {/* ============================================ */}
        {/* Header — centered */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
          style={{ textAlign: 'center' }}
        >
          <h2
            style={{
              color: isDark ? 'var(--text-secondary)' : '#FFFFFF',
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '0.75rem',
              lineHeight: 1.3,
              textShadow: isDark
                ? 'none'
                : '0 2px 10px rgba(0, 0, 0, 0.12)',
              textAlign: 'center',
            }}
          >
            {isAuthenticated
              ? 'أكمل رحلتك مع بصمة'
              : 'اختر طريقتك في التأثير'}
          </h2>

          <p
            style={{
              color: isDark
                ? 'var(--text-muted)'
                : 'rgba(255, 255, 255, 0.95)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
              fontFamily: 'Cairo, sans-serif',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 2,
              textAlign: 'center',
            }}
          >
            {isAuthenticated ? (
              <>
                لديك ثلاث طرق لمتابعة بصمتك في مجتمعنا —{' '}
                <span
                  style={{
                    color: isDark ? '#F5A623' : '#FFFFFF',
                    fontWeight: 900,
                    backgroundColor: isDark
                      ? 'rgba(245, 166, 35, 0.15)'
                      : 'rgba(255, 255, 255, 0.22)',
                    padding: '2px 10px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    margin: '0 2px',
                  }}
                >
                  تبادل خدمة
                </span>
                ،{' '}
                <span
                  style={{
                    color: isDark ? '#4FCB6E' : '#FFFFFF',
                    fontWeight: 900,
                    backgroundColor: isDark
                      ? 'rgba(79, 203, 110, 0.15)'
                      : 'rgba(255, 255, 255, 0.22)',
                    padding: '2px 10px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    margin: '0 2px',
                  }}
                >
                  دعم محتاج
                </span>
                ، أو{' '}
                <span
                  style={{
                    color: isDark ? '#BA68C8' : '#FFFFFF',
                    fontWeight: 900,
                    backgroundColor: isDark
                      ? 'rgba(186, 104, 200, 0.15)'
                      : 'rgba(255, 255, 255, 0.22)',
                    padding: '2px 10px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    margin: '0 2px',
                  }}
                >
                  نشر ما يهم مجتمعنا
                </span>
                . اختر ما يلهمك اليوم.
              </>
            ) : (
              <>
                في بصمة، كل شخص قادر على ترك أثر.{' '}
                <span
                  style={{
                    color: isDark ? '#F5A623' : '#FFFFFF',
                    fontWeight: 900,
                    backgroundColor: isDark
                      ? 'rgba(245, 166, 35, 0.15)'
                      : 'rgba(255, 255, 255, 0.22)',
                    padding: '2px 10px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    margin: '0 2px',
                  }}
                >
                  تبادل خدمة
                </span>
                ،{' '}
                <span
                  style={{
                    color: isDark ? '#4FCB6E' : '#FFFFFF',
                    fontWeight: 900,
                    backgroundColor: isDark
                      ? 'rgba(79, 203, 110, 0.15)'
                      : 'rgba(255, 255, 255, 0.22)',
                    padding: '2px 10px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    margin: '0 2px',
                  }}
                >
                  دعم محتاج
                </span>
                ، أو{' '}
                <span
                  style={{
                    color: isDark ? '#BA68C8' : '#FFFFFF',
                    fontWeight: 900,
                    backgroundColor: isDark
                      ? 'rgba(186, 104, 200, 0.15)'
                      : 'rgba(255, 255, 255, 0.22)',
                    padding: '2px 10px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    margin: '0 2px',
                  }}
                >
                  نشر ما يهم مجتمعنا
                </span>{' '}
                <br/>
                 ثلاث طرق مختلفة، وهدف واحد: مجتمع متكافل ومترابط.
              </>
            )}
          </p>
        </motion.div>

        {/* ============================================ */}
        {/* Three pillars — clickable cards */}
        {/* ============================================ */}
        <Row className="g-3 g-md-4 justify-content-center mb-4">
          {pillars.map((p, index) => {
            const Icon = p.Icon;
            return (
              <Col key={p.title} xs={12} sm={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  style={{ height: '100%' }}
                >
                  <Link
                    to={p.path}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      style={{
                        height: '100%',
                        padding: '1.75rem 1.5rem',
                        borderRadius: '20px',
                        backgroundColor: isDark
                          ? 'var(--bg-card)'
                          : 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: isDark ? 'none' : 'blur(12px)',
                        WebkitBackdropFilter: isDark ? 'none' : 'blur(12px)',
                        border: isDark
                          ? `1.5px solid ${p.color}30`
                          : '1.5px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = isDark
                          ? p.color
                          : '#FFFFFF';
                        e.currentTarget.style.boxShadow = isDark
                          ? `0 12px 40px ${p.color}25`
                          : '0 12px 40px rgba(0, 0, 0, 0.15)';
                        e.currentTarget.style.backgroundColor = isDark
                          ? 'var(--bg-card)'
                          : 'rgba(255, 255, 255, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = isDark
                          ? `${p.color}30`
                          : 'rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.backgroundColor = isDark
                          ? 'var(--bg-card)'
                          : 'rgba(255, 255, 255, 0.15)';
                      }}
                    >
                      {/* Icon */}
                      <div
                        style={{
                          width: '62px',
                          height: '62px',
                          borderRadius: '18px',
                          background: `linear-gradient(135deg, ${p.color}, ${p.colorLight})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          margin: '0 auto 1.1rem',
                          boxShadow: `0 6px 18px ${p.color}40`,
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        <Icon size={26} />
                      </div>

                      {/* Title */}
                      <h4
                        style={{
                          color: isDark
                            ? 'var(--text-secondary)'
                            : '#FFFFFF',
                          fontSize: '1.1rem',
                          fontWeight: 900,
                          fontFamily: 'Cairo, sans-serif',
                          marginBottom: '0.4rem',
                          textShadow: isDark
                            ? 'none'
                            : '0 1px 4px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        {p.title}
                      </h4>

                      {/* Short caption */}
                      <p
                        style={{
                          color: isDark
                            ? 'var(--text-muted)'
                            : 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          fontFamily: 'Cairo, sans-serif',
                          marginBottom: '1rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {p.short}
                      </p>

                      {/* Arrow */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: isDark ? p.color : '#FFFFFF',
                          fontFamily: 'Cairo, sans-serif',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          opacity: 0.85,
                        }}
                      >
                        ابدأ الآن
                        <FaArrowLeft size={11} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </Col>
            );
          })}
        </Row>

        {/* ============================================ */}
        {/* Primary CTA — register or dashboard */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
          style={{ marginTop: '2rem', textAlign: 'center' }}
        >
          <Button
            as={Link as any}
            to={isAuthenticated ? authedLink : '/register'}
            className="rounded-pill fw-bold"
            style={{
              backgroundColor: isDark
                ? 'var(--primary-orange)'
                : '#FFFFFF',
              borderColor: isDark ? 'var(--primary-orange)' : '#FFFFFF',
              color: isDark ? '#FFFFFF' : 'var(--primary-orange)',
              padding: '14px 42px',
              fontSize: '1.05rem',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              transition: 'all 0.3s ease',
              boxShadow: isDark
                ? '0 6px 20px rgba(232, 122, 32, 0.35)'
                : '0 6px 24px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark
                ? 'var(--primary-orange-dark)'
                : 'var(--bg-body)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = isDark
                ? '0 10px 32px rgba(232, 122, 32, 0.45)'
                : '0 12px 36px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark
                ? 'var(--primary-orange)'
                : '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDark
                ? '0 6px 20px rgba(232, 122, 32, 0.35)'
                : '0 6px 24px rgba(0, 0, 0, 0.2)';
            }}
          >
            {isAuthenticated
              ? 'العودة إلى لوحة التحكم'
              : 'انضم إلى مجتمع بصمة مجاناً'}
          </Button>

          {/* Guest reassurance line */}
          {!isAuthenticated && (
            <p
              style={{
                color: isDark
                  ? 'var(--text-muted)'
                  : 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.82rem',
                fontFamily: 'Cairo, sans-serif',
                marginTop: '1rem',
                marginBottom: 0,
                lineHeight: 1.6,
                textAlign: 'center',
              }}
            >
              التسجيل مجاني وسريع — ولا يتطلب أي رسوم.
            </p>
          )}
        </motion.div>
      </Container>
    </section>
  );
};

export default AboutCTA;