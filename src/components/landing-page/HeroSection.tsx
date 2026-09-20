import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { usePublicStats } from '../../hooks/usePublicStats';
import { getPostAuthPath } from '../../utils/authRedirect';
import {
  FaHandshake,
  FaExchangeAlt,
  FaShieldAlt,
  FaWhatsapp,
  FaUsers,
  FaCheckCircle,
  FaChevronLeft,
} from 'react-icons/fa';

const HeroSection = () => {
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { stats, loading: statsLoading } = usePublicStats();
  const authedLink = user ? getPostAuthPath(user) : '/register';

  // ✅ Trust points — user count shows shimmer while loading
  const trustPoints = [
    {
      icon: <FaUsers size={12} />,
      label: 'مستخدم',
      // Show the number only when stats loaded; otherwise null
      number: !statsLoading && stats?.users.display_format
        ? stats.users.display_format
        : null,
    },
    { icon: <FaCheckCircle size={12} />, label: 'هوية موثّقة' },
    { icon: <FaWhatsapp size={12} />, label: 'واتساب مباشر' },
  ];

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '90px',
        paddingBottom: '50px',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-body)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <Row className="align-items-center w-100 g-4">
          {/* Text Content Column */}
          <Col xs={12} lg={6}>
            <div
              className="text-center text-lg-end"
              style={{
                padding: '0.5rem',
              }}
            >
              <h1
                className="hero-main-title"
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 900,
                  lineHeight: 1.25,
                  marginBottom: '1.25rem',
                  minHeight: 'clamp(5rem, 9vw, 8rem)',
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
                    fontWeight: 800,
                  }}
                />
              </h1>

              <p
                className="hero-desc-text mx-auto ms-lg-auto me-lg-0"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 'clamp(1rem, 1.3vw, 1.2rem)',
                  lineHeight: '1.8',
                  marginBottom: '1.75rem',
                  maxWidth: '550px',
                }}
              >
                منصة بصمة تهدف إلى تعزيز التكافل الاجتماعي وتسهيل تبادل الموارد
                والخدمات داخل المجتمع بروح التعاون والمحبة.
              </p>

              {/* CTA Buttons */}
              <div className="hero-cta-group d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <Button
                  as={Link as any}
                  to={isAuthenticated ? authedLink : '/register'}
                  className="rounded-pill fw-bold hero-btn-primary"
                  style={{
                    backgroundColor: '#E87A20',
                    borderColor: '#E87A20',
                    color: 'white',
                    padding: '12px 28px',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(232, 122, 32, 0.3)',
                    flex: '1 1 auto',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D46A1A';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 24px rgba(232, 122, 32, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#E87A20';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 16px rgba(232, 122, 32, 0.3)';
                  }}
                >
                  {isAuthenticated ? 'لوحة التحكم' : 'انضم إلينا الآن'}
                </Button>

                <Button
                  as={Link as any}
                  to="/announcements"
                  className="rounded-pill fw-bold hero-btn-outline"
                  style={{
                    padding: '12px 28px',
                    fontSize: '0.95rem',
                    borderWidth: '2px',
                    borderColor: '#E87A20',
                    color: '#E87A20',
                    backgroundColor: 'transparent',
                    transition: 'all 0.3s ease',
                    flex: '1 1 auto',
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

              {/* Trust Points */}
              <div
                className="trust-points-container"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem 1rem',
                  marginTop: '1.75rem',
                  justifyContent: 'center',
                }}
              >
                {trustPoints.map((point, index) => (
                  <div
                    key={index}
                    className="trust-point-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      fontFamily: 'Cairo, sans-serif',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
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

                    {/* ✅ Number + label with shimmer while loading */}
                    {point.number !== undefined ? (
                      point.number ? (
                        <>
                          <span
                            style={{
                              fontFamily:
                                "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                              fontVariantNumeric: 'lining-nums tabular-nums',
                              fontWeight: 800,
                              color: 'var(--text-secondary)',
                              direction: 'ltr',
                              display: 'inline-block',
                            }}
                          >
                            {point.number}
                          </span>
                          <span>{point.label}</span>
                        </>
                      ) : (
                        <>
                          {/* Shimmer placeholder while stats load */}
                          <span
                            className="hero-trust-shimmer"
                            aria-label="جاري التحميل"
                            style={{
                              display: 'inline-block',
                              width: '42px',
                              height: '10px',
                              borderRadius: '4px',
                              backgroundColor: isDark
                                ? 'rgba(196,168,138,0.15)'
                                : 'rgba(139,90,43,0.08)',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          />
                          <span>{point.label}</span>
                        </>
                      )
                    ) : (
                      <span>{point.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Desktop Visual Column (Hidden on Mobile) */}
          <Col
            lg={6}
            className="d-none d-lg-flex justify-content-center align-items-center"
            style={{ minHeight: '420px' }}
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
                    style={{
                      background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                    }}
                  >
                    <FaHandshake size={30} color="#FFFFFF" />
                    <span className="hero-bubble-label">تعاون</span>
                  </div>
                </div>

                <div className="hero-bubble-wrap bubble-2">
                  <div
                    className="hero-bubble"
                    style={{
                      background: 'linear-gradient(135deg, #8B5A2B, #C49A6C)',
                    }}
                  >
                    <FaExchangeAlt size={28} color="#FFFFFF" />
                    <span className="hero-bubble-label">تبادل</span>
                  </div>
                </div>

                <div className="hero-bubble-wrap bubble-3">
                  <div
                    className="hero-bubble"
                    style={{
                      background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
                    }}
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

          {/* Mobile Connected Chain Cards Row with Typing Caption */}
          <Col xs={12} className="d-lg-none mt-4">
            <div
              className="mobile-cards-wrapper"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
                padding: '0.5rem 0',
                width: '100%',
                margin: '0 auto',
              }}
            >
              {/* Card 1: تعاون */}
              <div
                className="mobile-card-item mobile-card-1"
                style={{
                  flex: '0 1 96px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '12px 4px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    margin: '0 auto 6px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                  }}
                >
                  <FaHandshake size={15} />
                </div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: 'var(--text-secondary)',
                  }}
                >
                  تعاون
                </span>
              </div>

              {/* Connecting Link Arrow 1 */}
              <div
                className="mobile-card-item mobile-card-link-1"
                style={{
                  color: '#E87A20',
                  opacity: 0.7,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaChevronLeft size={13} />
              </div>

              {/* Card 2: تبادل */}
              <div
                className="mobile-card-item mobile-card-2"
                style={{
                  flex: '0 1 96px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '12px 4px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    margin: '0 auto 6px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B5A2B, #C49A6C)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                  }}
                >
                  <FaExchangeAlt size={14} />
                </div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: 'var(--text-secondary)',
                  }}
                >
                  تبادل
                </span>
              </div>

              {/* Connecting Link Arrow 2 */}
              <div
                className="mobile-card-item mobile-card-link-2"
                style={{
                  color: '#8B5A2B',
                  opacity: 0.7,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaChevronLeft size={13} />
              </div>

              {/* Card 3: ثقة */}
              <div
                className="mobile-card-item mobile-card-3"
                style={{
                  flex: '0 1 96px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '12px 4px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    margin: '0 auto 6px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                  }}
                >
                  <FaShieldAlt size={14} />
                </div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: 'var(--text-secondary)',
                  }}
                >
                  ثقة
                </span>
              </div>
            </div>

            <p
              className="hero-mobile-caption-wrap"
              style={{
                textAlign: 'center',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                fontFamily: 'Cairo, sans-serif',
                marginTop: '12px',
                padding: '0 1rem',
                lineHeight: '1.7',
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: '360px',
                minHeight: '50px',
              }}
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
                className="hero-mobile-caption-cursor"
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  lineHeight: 1.7,
                }}
              />
            </p>
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

        .hero-section .mobile-card-item {
          opacity: 0;
          animation: basma-mobile-card-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .hero-section .mobile-card-1 { animation-delay: 0.15s; }
        .hero-section .mobile-card-link-1 { animation-delay: 0.3s; }
        .hero-section .mobile-card-2 { animation-delay: 0.45s; }
        .hero-section .mobile-card-link-2 { animation-delay: 0.6s; }
        .hero-section .mobile-card-3 { animation-delay: 0.75s; }

        .hero-section .hero-typing-cursor::after {
          content: '|';
          animation: blink 0.8s step-end 3, hideCursor 0s 3s forwards;
        }

        .hero-section .hero-caption-cursor::after,
        .hero-section .hero-mobile-caption-cursor::after {
          content: '|';
          animation: blink 0.8s step-end 3, hideCursor 0s 5s forwards;
        }

        /* ✅ Shimmer for the user-count placeholder */
        .hero-section .hero-trust-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(232, 122, 32, 0.15) 50%,
            transparent 100%
          );
          animation: hero-shimmer 1.6s infinite;
        }

        [data-theme="dark"] .hero-section .hero-trust-shimmer::after {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(196, 168, 138, 0.15) 50%,
            transparent 100%
          );
        }

        @keyframes hero-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
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

        @keyframes basma-mobile-card-in {
          0% { opacity: 0; transform: scale(0.8) translateY(12px); }
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
          .hero-section p.hero-desc-text {
            font-size: 0.95rem !important;
            line-height: 1.7 !important;
          }

          .hero-section .hero-btn-primary,
          .hero-section .hero-btn-outline {
            flex: 1 !important;
            text-align: center !important;
            padding: 10px 14px !important;
            font-size: 0.88rem !important;
            min-width: 0 !important;
          }

          .trust-points-container {
            justify-content: center !important;
            gap: 12px !important;
          }

          .trust-point-item {
            font-size: 0.72rem !important;
            gap: 4px !important;
          }
        }

        @media (max-width: 380px) {
          .hero-main-title {
            font-size: 2.3rem !important;
            min-height: 5.5rem !important;
          }

          .hero-cta-group {
            gap: 8px !important;
          }

          .hero-btn-primary,
          .hero-btn-outline {
            padding: 10px 10px !important;
            font-size: 0.82rem !important;
          }

          .mobile-cards-wrapper {
            gap: 4px !important;
            padding: 0 2px !important;
          }

          .mobile-cards-wrapper > div.mobile-card-item:not(.mobile-card-link-1):not(.mobile-card-link-2) {
            flex: 0 1 88px !important;
            padding: 10px 2px !important;
          }
        }

        @media (max-width: 576px) {
          .hero-section {
            padding-top: 76px !important;
            padding-bottom: 30px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;