import { Container, Row, Col } from 'react-bootstrap';

const AboutHero = () => {
  return (
    <section
      style={{
        padding: '5rem 0 3rem',
        backgroundColor: 'var(--bg-body)',
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
                color: 'var(--text-secondary)',
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
                color: 'var(--text-muted)',
                fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)',
                fontWeight: 600,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1.5rem',
              }}
            >
              نؤمن بأن التبادل هو أساس لزيادة التكافل في المجتمع
            </h3>

            <p
              style={{
                color: 'var(--text-primary)',
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