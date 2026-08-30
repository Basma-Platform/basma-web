import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { getPostAuthPath } from '../../utils/authRedirect';
import {
  FaHandshake,
  FaExchangeAlt,
  FaShieldAlt,
  FaWhatsapp,
  FaUsers,
  FaCheckCircle,
} from 'react-icons/fa';

const HeroSection = () => {
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const authedLink = user ? getPostAuthPath(user) : '/register';

  const trustPoints = [
    { icon: <FaUsers size={14} />, label: '+10,000 مستخدم' },
    { icon: <FaCheckCircle size={14} />, label: 'هوية موثّقة' },
    { icon: <FaWhatsapp size={14} />, label: 'تواصل مباشر بواتساب' },
  ];

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '108px',
        paddingBottom: '64px',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-body)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <Row className="align-items-center w-100">
          <Col xs={12} lg={6}>
            <div
              style={{
                padding: '1rem',
                textAlign: 'right',
              }}
            >
              <h1
                style={{
                  color: 'var(--text-secondary)',
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
                    'تواصل إنساني',
                    800,
                    'تواصل إنساني\nبلمسة رقمية',
                    200,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={0}
                  cursor={true}
                  className="hero-typing-cursor"
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
                  color: 'var(--text-muted)',
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

              <div
                className="d-flex flex-wrap gap-3"
                style={{ justifyContent: 'flex-start' }}
              >
                <Button
                  as={Link as any}
                  to={isAuthenticated ? authedLink : '/register'}
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
                  {isAuthenticated ? 'لوحة التحكم' : 'انضم إلينا الآن'}
                </Button>

                <Button
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

              <div
                className="d-flex flex-wrap"
                style={{
                  gap: '1.5rem',
                  marginTop: '2rem',
                  justifyContent: 'flex-start',
                }}
              >
                {trustPoints.map((point, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isDark
                          ? 'rgba(232,122,32,0.15)'
                          : 'rgba(232,122,32,0.1)',
                        color: '#E87A20',
                        flexShrink: 0,
                      }}
                    >
                      {point.icon}
                    </span>
                    {point.label}
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col
            lg={6}
            className="d-none d-lg-flex justify-content-center align-items-center"
            style={{ minHeight: '460px' }}
          >
            <div className="hero-triangle-wrap">
              <div className="hero-triangle">
                <svg
                  className="hero-triangle-svg"
                  viewBox="0 0 460 440"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <marker
                      id="basma-arrow-1"
                      markerWidth="9"
                      markerHeight="9"
                      refX="5"
                      refY="4.5"
                      orient="auto"
                    >
                      <path d="M0,0 L9,4.5 L0,9 Z" fill="#E87A20" />
                    </marker>
                    <marker
                      id="basma-arrow-2"
                      markerWidth="9"
                      markerHeight="9"
                      refX="5"
                      refY="4.5"
                      orient="auto"
                    >
                      <path d="M0,0 L9,4.5 L0,9 Z" fill="#8B5A2B" />
                    </marker>
                    <marker
                      id="basma-arrow-3"
                      markerWidth="9"
                      markerHeight="9"
                      refX="5"
                      refY="4.5"
                      orient="auto"
                    >
                      <path d="M0,0 L9,4.5 L0,9 Z" fill="#28A745" />
                    </marker>
                  </defs>

                  <path
                    id="basma-path-1"
                    className="hero-arrow-path path-1"
                    d="M265,138 Q350,180 345,272"
                    fill="none"
                    stroke="#E87A20"
                    strokeWidth="3"
                    strokeLinecap="round"
                    markerEnd="url(#basma-arrow-1)"
                  />
                  <path
                    id="basma-path-2"
                    className="hero-arrow-path path-2"
                    d="M312,330 Q230,380 148,330"
                    fill="none"
                    stroke="#8B5A2B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    markerEnd="url(#basma-arrow-2)"
                  />
                  <path
                    id="basma-path-3"
                    className="hero-arrow-path path-3"
                    d="M115,272 Q110,180 195,138"
                    fill="none"
                    stroke="#28A745"
                    strokeWidth="3"
                    strokeLinecap="round"
                    markerEnd="url(#basma-arrow-3)"
                  />

                  <circle r="5" fill="#E87A20" opacity="0">
                    <animate
                      attributeName="opacity"
                      from="0"
                      to="1"
                      dur="0.01s"
                      begin="1.7s"
                      fill="freeze"
                    />
                    <animateMotion dur="3s" repeatCount="indefinite" begin="1.7s">
                      <mpath href="#basma-path-1" />
                    </animateMotion>
                  </circle>
                  <circle r="5" fill="#8B5A2B" opacity="0">
                    <animate
                      attributeName="opacity"
                      from="0"
                      to="1"
                      dur="0.01s"
                      begin="1.95s"
                      fill="freeze"
                    />
                    <animateMotion dur="3s" repeatCount="indefinite" begin="1.95s">
                      <mpath href="#basma-path-2" />
                    </animateMotion>
                  </circle>
                  <circle r="5" fill="#28A745" opacity="0">
                    <animate
                      attributeName="opacity"
                      from="0"
                      to="1"
                      dur="0.01s"
                      begin="2.2s"
                      fill="freeze"
                    />
                    <animateMotion dur="3s" repeatCount="indefinite" begin="2.2s">
                      <mpath href="#basma-path-3" />
                    </animateMotion>
                  </circle>
                </svg>

                <div className="hero-bubble-wrap bubble-1">
                  <div
                    className="hero-bubble"
                    style={{ background: 'linear-gradient(135deg, #E87A20, #F5A623)' }}
                  >
                    <FaHandshake size={30} color="#FFFFFF" />
                    <span className="hero-bubble-label">تعاون</span>
                  </div>
                </div>

                <div className="hero-bubble-wrap bubble-2">
                  <div
                    className="hero-bubble"
                    style={{ background: 'linear-gradient(135deg, #8B5A2B, #C49A6C)' }}
                  >
                    <FaExchangeAlt size={28} color="#FFFFFF" />
                    <span className="hero-bubble-label">تبادل</span>
                  </div>
                </div>

                <div className="hero-bubble-wrap bubble-3">
                  <div
                    className="hero-bubble"
                    style={{ background: 'linear-gradient(135deg, #28A745, #4FCB6E)' }}
                  >
                    <FaShieldAlt size={28} color="#FFFFFF" />
                    <span className="hero-bubble-label">ثقة</span>
                  </div>
                </div>
              </div>

              <p
                className="hero-triangle-caption"
                style={{ color: 'var(--text-muted)' }}
              >
                <TypeAnimation
                  sequence={[
                    'من التعاون يبدأ التبادل،',
                    700,
                    'من التعاون يبدأ التبادل، ومن التبادل تُبنى الثقة،',
                    700,
                    'من التعاون يبدأ التبادل، ومن التبادل تُبنى الثقة، سعياً نحو مجتمع متكافل ومترابط',
                    200,
                  ]}
                  wrapper="span"
                  speed={65}
                  repeat={0}
                  cursor={true}
                  className="hero-caption-cursor"
                  style={{
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                    fontWeight: 600,
                    lineHeight: 1.8,
                  }}
                />
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .hero-section .hero-triangle-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-section .hero-triangle {
          position: relative;
          width: 460px;
          height: 420px;
          max-width: 100%;
        }

        .hero-section .hero-triangle-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .hero-section .hero-arrow-path {
          stroke-dasharray: 480;
          stroke-dashoffset: 480;
          animation: basma-draw 0.9s ease forwards;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05));
        }

        .hero-section .path-1 { animation-delay: 0.8s; }
        .hero-section .path-2 { animation-delay: 1.05s; }
        .hero-section .path-3 { animation-delay: 1.3s; }

        .hero-section .hero-bubble-wrap {
          position: absolute;
          width: 136px;
          height: 136px;
          opacity: 0;
          animation: basma-bubble-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     basma-float 5s ease-in-out infinite;
          filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12));
        }

        .hero-section .bubble-1 {
          top: 12px;
          left: 162px;
          animation-delay: 0s, 0.7s;
        }

        .hero-section .bubble-2 {
          top: 262px;
          left: 312px;
          animation-delay: 0.25s, 0.95s;
        }

        .hero-section .bubble-3 {
          top: 262px;
          left: 12px;
          animation-delay: 0.5s, 1.2s;
        }

        .hero-section .hero-bubble {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
          transition: transform 0.3s ease;
          cursor: default;
        }

        .hero-section .hero-bubble:hover {
          transform: scale(1.06);
        }

        .hero-section .hero-bubble-label {
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.95rem;
          font-family: 'Cairo', sans-serif;
        }

        .hero-section .hero-triangle-caption {
          margin-top: 20px;
          font-size: 0.9rem;
          font-family: 'Cairo', sans-serif;
          text-align: center;
          max-width: 400px;
          line-height: 1.8;
          min-height: 80px;
        }

        .hero-section .hero-typing-cursor::after {
          content: '|';
          animation: blink 0.8s step-end 3, hideCursor 0s 3s forwards;
        }

        .hero-section .hero-caption-cursor::after {
          content: '|';
          animation: blink 0.8s step-end 3, hideCursor 0s 5s forwards;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes hideCursor {
          to { opacity: 0; }
        }

        @keyframes basma-bubble-in {
          0% { opacity: 0; transform: scale(0.3) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes basma-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes basma-draw {
          to { stroke-dashoffset: 0; }
        }

        @media (max-width: 1200px) {
          .hero-section .hero-triangle-wrap {
            transform: scale(0.85);
          }
        }

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
            padding-top: 88px !important;
            padding-bottom: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;