import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const AboutCTA = () => {
  const { isDark } = useTheme();

  return (
    <section
      style={{
        padding: '4rem 0',
        backgroundColor: isDark ? '#1a1a2e' : '#E87A20',
        textAlign: 'center',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            <h2
              style={{
                color: isDark ? '#FDF5E6' : '#FFFFFF',
                fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '0.5rem',
                transition: 'color 0.3s ease',
              }}
            >
              انضم إلى مجتمع بصمة
            </h2>

            <p
              style={{
                color: isDark ? '#C49A6C' : '#FDF5E6',
                fontSize: '1.1rem',
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '2rem',
                opacity: 0.9,
                transition: 'color 0.3s ease',
              }}
            >
              كن جزءاً من التغيير وساهم في بناء مجتمع أقوى
            </p>

            <Button
              as={Link as any}
              to="/register"
              className="rounded-pill fw-bold"
              style={{
                backgroundColor: isDark ? '#E87A20' : '#FFFFFF',
                borderColor: isDark ? '#E87A20' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#E87A20',
                padding: '14px 48px',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                boxShadow: isDark ? '0 4px 16px rgba(232, 122, 32, 0.3)' : '0 4px 16px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={(e) => {
                if (isDark) {
                  e.currentTarget.style.backgroundColor = '#D46A1A';
                } else {
                  e.currentTarget.style.backgroundColor = '#FDF5E6';
                }
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#E87A20' : '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDark ? '0 4px 16px rgba(232, 122, 32, 0.3)' : '0 4px 16px rgba(0,0,0,0.15)';
              }}
            >
              انضم إلينا الآن
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutCTA;