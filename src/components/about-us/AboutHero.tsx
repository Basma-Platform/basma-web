import { Container, Row, Col } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';

const AboutHero = () => {
  const { isDark } = useTheme();

  return (
    <section
      style={{
        padding: '5rem 0 3rem',
        backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
        textAlign: 'center',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            {/* Orange Accent */}
            <div
              style={{
                width: '60px',
                height: '4px',
                backgroundColor: '#E87A20',
                borderRadius: '2px',
                margin: '0 auto 1.5rem',
              }}
            />

            <h1
              style={{
                color: isDark ? '#FDF5E6' : '#6B4226',
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1rem',
              }}
            >
              من نحن
            </h1>

            <h3
              style={{
                color: isDark ? '#C49A6C' : '#8B5A2B',
                fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)',
                fontWeight: 600,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1.5rem',
              }}
            >
              نؤمن بأن التبادل هو أساس المجتمع
            </h3>

            <p
              style={{
                color: isDark ? '#e8e8e8' : '#6B4226',
                fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
                lineHeight: 1.9,
                fontFamily: 'Cairo, sans-serif',
                maxWidth: '700px',
                margin: '0 auto',
              }}
            >
              منصة بصمة هي منصة تبادل مجتمعية أُنشئت لخدمة أهل غزة،
              <br />
              حيث نؤمن بأن التكافل والتعاون هما أساس بناء مجتمع قوي ومتماسك.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutHero;