import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { useTheme } from '../../context/ThemeContext';
import heroImageLeft from '../../assets/hero.png';

const HeroSection = () => {
  const { isDark } = useTheme();

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        paddingTop: '76px',
        overflow: 'hidden',
        backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container
        style={{
          height: '100%',
          minHeight: 'calc(100vh - 76px)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Row className="align-items-center w-100">
          {/* RIGHT SIDE - Text Content (RTL) */}
          <Col xs={12} lg={6}>
            <div
              style={{
                padding: '2rem 1rem',
                textAlign: 'right',
              }}
            >
              {/* Orange Accent Line */}
              <div
                style={{
                  width: '60px',
                  height: '4px',
                  backgroundColor: '#E87A20',
                  borderRadius: '2px',
                  marginRight: 'auto',
                  marginLeft: 0,
                  marginBottom: '1.5rem',
                }}
              />

              {/* Headline with Typing Animation */}
              <h1
                style={{
                  color: isDark ? '#FDF5E6' : '#6B4226',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 900,
                  lineHeight: 1.2,
                  marginBottom: '1.5rem',
                  minHeight: 'clamp(5rem, 10vw, 8rem)',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <TypeAnimation
                  sequence={[
                    // First line
                    'تواصل إنساني',
                    1000,
                    // Second line (appears after first)
                    () => {
                      // This will add the second line
                    },
                    'تواصل إنساني\nبلمسة رقمية',
                    200,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={0} // Only once
                  cursor={true}
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'pre-line',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 700,
                  }}
                />
              </h1>

              <p
                style={{
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: 'clamp(1rem, 1.4vw, 1.3rem)',
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                  maxWidth: '550px',
                  marginRight: 'auto',
                  marginLeft: 0,
                }}
              >
                منصة بصمة تهدف إلى تعزيز التكافل الاجتماعي
                <br />
                وتسهيل تبادل الموارد والخدمات داخل المجتمع
                <br />
                بروح التعاون والمحبة.
              </p>

              {/* Buttons */}
              <div
                className="d-flex flex-wrap gap-3"
                style={{ justifyContent: 'flex-start' }}
              >
                <Button
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  as={Link as any}
                  to="/register"
                  className="rounded-pill fw-bold"
                  style={{
                    backgroundColor: '#E87A20',
                    borderColor: '#E87A20',
                    color: 'white',
                    padding: 'clamp(10px, 1.5vw, 16px) clamp(20px, 3vw, 40px)',
                    fontSize: 'clamp(0.85rem, 1.1vw, 1.1rem)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(232, 122, 32, 0.3)',
                    minWidth: 'clamp(120px, 15vw, 160px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D46A1A';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(232, 122, 32, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#E87A20';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(232, 122, 32, 0.3)';
                  }}
                >
                  انضم إلينا الآن
                </Button>

                <Button
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  as={Link as any}
                  to="/announcements"
                  className="rounded-pill fw-bold"
                  style={{
                    padding: 'clamp(10px, 1.5vw, 16px) clamp(20px, 3vw, 40px)',
                    fontSize: 'clamp(0.85rem, 1.1vw, 1.1rem)',
                    borderWidth: '2px',
                    borderColor: '#E87A20',
                    color: '#E87A20',
                    backgroundColor: 'transparent',
                    transition: 'all 0.3s ease',
                    minWidth: 'clamp(120px, 15vw, 160px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E87A20';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#E87A20';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  تصفح الإعلانات
                </Button>
              </div>
            </div>
          </Col>

          {/* LEFT SIDE - Hero Image (Hidden on mobile) */}
          <Col
            lg={6}
            className="d-none d-lg-flex justify-content-center align-items-center"
            style={{ minHeight: '400px' }}
          >
            <img
              src={heroImageLeft}
              alt="منصة بصمة"
              style={{
                width: '100%',
                maxWidth: '680px',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.1))',
              }}
            />
          </Col>
        </Row>
      </Container>

      {/*
        FIX: every selector below is now prefixed with `.hero-section`.
        Previously these were bare (`.container`, `.col-12 h1`, `.col-12 .d-flex .btn`, ...)
        with `!important`. A <style> tag is never scoped to its component — it's injected
        globally — so those rules were matching the SAME Bootstrap classes on every other
        page (About page cards, Footer columns, etc.) and overriding their responsive
        behavior below 991px. Scoping fixes that leak.
      */}
      <style>{`
        @media (max-width: 991px) {
          .hero-section .d-none.d-lg-flex {
            display: none !important;
          }

          .hero-section .container {
            text-align: right !important;
          }

          .hero-section .col-12 > div {
            text-align: right !important;
            padding: 1rem !important;
          }

          .hero-section .col-12 .d-flex {
            justify-content: flex-start !important;
            gap: 0.75rem !important;
          }

          .hero-section .col-12 h1 {
            text-align: right !important;
            font-size: 2.2rem !important;
          }

          .hero-section .col-12 p {
            text-align: right !important;
            margin-right: auto !important;
            margin-left: 0 !important;
            font-size: 1rem !important;
          }

          .hero-section .col-12 .d-flex .btn {
            padding: 8px 16px !important;
            font-size: 0.85rem !important;
            min-width: 100px !important;
            flex: 1 !important;
            max-width: 48% !important;
          }
        }

        @media (max-width: 576px) {
          .hero-section {
            min-height: auto !important;
            padding-bottom: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;