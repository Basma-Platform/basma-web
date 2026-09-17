import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { getPostAuthPath } from '../../utils/authRedirect';

const CTASection = () => {
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const authedLink = user ? getPostAuthPath(user) : '/dashboard';

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
      {/* Static Stable Neon Corner Glow Circles (No vibrating scaling on mobile) */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-8%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          backgroundColor: isDark ? 'rgba(232, 122, 32, 0.12)' : 'rgba(255, 255, 255, 0.15)',
          pointerEvents: 'none',
          boxShadow: isDark ? '0 0 50px rgba(232, 122, 32, 0.1)' : '0 0 60px rgba(255, 255, 255, 0.2)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-8%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          backgroundColor: isDark ? 'rgba(232, 122, 32, 0.12)' : 'rgba(255, 255, 255, 0.15)',
          pointerEvents: 'none',
          boxShadow: isDark ? '0 0 50px rgba(232, 122, 32, 0.1)' : '0 0 60px rgba(255, 255, 255, 0.2)',
        }}
      />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="text-center justify-content-center">
          <Col xs={12} lg={10}>
            {/* Title & Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                style={{
                  color: isDark ? 'var(--text-secondary)' : '#FFFFFF',
                  fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '0.75rem',
                  transition: 'color 0.3s ease',
                  textShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.1)',
                }}
              >
                {isAuthenticated ? 'مرحباً بعودتك إلى بصمة' : 'انضم إلى مجتمع بصمة اليوم'}
              </h2>

              <p
                style={{
                  color: isDark ? 'var(--text-muted)' : '#FDF5E6',
                  fontSize: 'clamp(1rem, 1.4vw, 1.3rem)',
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '2.5rem',
                  opacity: 0.95,
                  maxWidth: '650px',
                  margin: '0 auto 2.5rem',
                  transition: 'color 0.3s ease',
                }}
              >
                {isAuthenticated
                  ? 'استكشف لوحة التحكم وتابع إعلاناتك ونشاطاتك بروح التكافل والتعاون'
                  : 'آلاف المستخدمين يثقون ببصمة لتبادل الخدمات والسلع - انضم إليهم الآن'}
              </p>
            </motion.div>

            {/* Action Buttons Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="d-flex flex-wrap justify-content-center gap-3"
            >
              {isAuthenticated ? (
                <Button
                  as={Link as any}
                  to={authedLink}
                  className="rounded-pill fw-bold"
                  style={{
                    backgroundColor: isDark ? 'var(--primary-orange)' : '#FDF8F2',
                    borderColor: isDark ? 'var(--primary-orange)' : '#FDF8F2',
                    color: isDark ? '#FFFFFF' : 'var(--primary-orange)',
                    padding: 'clamp(12px, 1.5vw, 16px) clamp(32px, 4vw, 56px)',
                    fontSize: 'clamp(1rem, 1.2vw, 1.2rem)',
                    fontFamily: 'Cairo, sans-serif',
                    transition: 'all 0.3s ease',
                    boxShadow: isDark ? '0 6px 20px rgba(232, 122, 32, 0.35)' : '0 6px 20px rgba(0,0,0,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'var(--primary-orange-dark)' : '#FFFFFF';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.22)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'var(--primary-orange)' : '#FDF8F2';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = isDark ? '0 6px 20px rgba(232, 122, 32, 0.35)' : '0 6px 20px rgba(0,0,0,0.15)';
                  }}
                >
                  لوحة التحكم
                </Button>
              ) : (
                <Button
                  as={Link as any}
                  to="/register"
                  className="rounded-pill fw-bold"
                  style={{
                    backgroundColor: isDark ? 'var(--primary-orange)' : '#FDF8F2',
                    borderColor: isDark ? 'var(--primary-orange)' : '#FDF8F2',
                    color: isDark ? '#FFFFFF' : 'var(--primary-orange)',
                    padding: 'clamp(12px, 1.5vw, 16px) clamp(32px, 4vw, 56px)',
                    fontSize: 'clamp(1rem, 1.2vw, 1.2rem)',
                    fontFamily: 'Cairo, sans-serif',
                    transition: 'all 0.3s ease',
                    boxShadow: isDark ? '0 6px 20px rgba(232, 122, 32, 0.35)' : '0 6px 20px rgba(0,0,0,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'var(--primary-orange-dark)' : '#FFFFFF';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.22)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'var(--primary-orange)' : '#FDF8F2';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = isDark ? '0 6px 20px rgba(232, 122, 32, 0.35)' : '0 6px 20px rgba(0,0,0,0.15)';
                  }}
                >
                  سجل الآن
                </Button>
              )}

              <Button
                as={Link as any}
                to="/announcements"
                className="rounded-pill fw-bold"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                  borderColor: isDark ? 'var(--border-color)' : '#FDF8F2',
                  color: isDark ? 'var(--text-secondary)' : '#FDF8F2',
                  padding: 'clamp(12px, 1.5vw, 16px) clamp(32px, 4vw, 56px)',
                  fontSize: 'clamp(1rem, 1.2vw, 1.2rem)',
                  fontFamily: 'Cairo, sans-serif',
                  borderWidth: '2px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(232, 122, 32, 0.15)' : 'rgba(253, 245, 230, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                تصفح الإعلانات
              </Button>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CTASection;