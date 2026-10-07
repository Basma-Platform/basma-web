import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaArrowUp,
  FaHeadset,
} from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

// ============================================
// Columns content
// ============================================
const COMMUNITY_LINKS = [
  { path: '/announcements', label: 'تبادل الخدمات' },
  { path: '/basma-fund', label: 'صندوق بصمة' },
  { path: '/community', label: 'منشورات المجتمع' },
];

const QUICK_LINKS = [
  { path: '/about', label: 'من نحن' },
  { path: '/faq', label: 'الأسئلة الشائعة' },
  { path: '/contact', label: 'اتصل بنا' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      icon: <FaFacebookF size={18} />,
      url: '#',
      color: '#1877F2',
      label: 'فيسبوك',
    },
    {
      icon: <FaXTwitter size={18} />,
      url: '#',
      color: '#000000',
      label: 'X',
    },
    {
      icon: <FaInstagram size={18} />,
      url: '#',
      color: '#E4405F',
      label: 'انستغرام',
    },
    {
      icon: <FaYoutube size={18} />,
      url: '#',
      color: '#FF0000',
      label: 'يوتيوب',
    },
    {
      icon: <FaWhatsapp size={18} />,
      url: '#',
      color: '#25D366',
      label: 'واتساب',
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-footer)',
        color: 'var(--text-footer)',
        padding: '4rem 0 1.5rem',
        marginTop: 'auto',
        position: 'relative',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <Container style={{ maxWidth: '1200px' }}>
        {/* ============================================ */}
        {/* Top grid: Brand + Community + Quick + Contact */}
        {/* ============================================ */}
        <Row className="g-4">
          {/* ---------- Brand ---------- */}
          <Col xs={12} lg={4}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '1rem',
              }}
            >
              <img
                src={logo}
                alt="بصمة"
                height="45"
                style={{
                  filter: 'brightness(0) invert(1)',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    'rotate(-8deg) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotate(0) scale(1)';
                }}
              />
              <span
                style={{
                  color: '#E87A20',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                بصمة
              </span>
            </div>

            <p
              style={{
                fontSize: '0.95rem',
                opacity: 0.8,
                lineHeight: 1.8,
                maxWidth: '360px',
                fontFamily: 'Cairo, sans-serif',
                color: 'var(--text-footer)',
                transition: 'color 0.3s ease',
              }}
            >
              منصة مجتمعية متكاملة لأهل غزة — تبادل الخدمات، صندوق بصمة
              للتبرعات، ومنشورات المجتمع. نساهم في بناء مجتمع أقوى من خلال
              التكافل والتعاون.
            </p>

            <div
              className="d-flex gap-3 mt-3"
              style={{ flexWrap: 'wrap' }}
            >
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: 'var(--text-footer)',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.color;
                    e.currentTarget.style.transform =
                      'translateY(-4px) scale(1.1)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${social.color}40`;
                    e.currentTarget.style.borderColor = social.color;
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform =
                      'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = 'var(--text-footer)';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </Col>

          {/* ---------- مجتمع بصمة ---------- */}
          <Col xs={6} sm={4} lg={2}>
            <h6
              style={{
                color: '#E87A20',
                fontSize: '1rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1.2rem',
                position: 'relative',
              }}
            >
              مجتمع بصمة
              <span
                style={{
                  display: 'block',
                  width: '30px',
                  height: '2px',
                  backgroundColor: '#E87A20',
                  marginTop: '6px',
                  borderRadius: '1px',
                }}
              />
            </h6>
            <div className="d-flex flex-column gap-2">
              {COMMUNITY_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    color: 'var(--text-footer)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Cairo, sans-serif',
                    display: 'inline-block',
                    opacity: 0.8,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#E87A20';
                    e.currentTarget.style.transform = 'translateX(-6px)';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-footer)';
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.opacity = '0.8';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>

          {/* ---------- روابط سريعة ---------- */}
          <Col xs={6} sm={4} lg={2}>
            <h6
              style={{
                color: '#E87A20',
                fontSize: '1rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1.2rem',
                position: 'relative',
              }}
            >
              روابط سريعة
              <span
                style={{
                  display: 'block',
                  width: '30px',
                  height: '2px',
                  backgroundColor: '#E87A20',
                  marginTop: '6px',
                  borderRadius: '1px',
                }}
              />
            </h6>
            <div className="d-flex flex-column gap-2">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    color: 'var(--text-footer)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Cairo, sans-serif',
                    display: 'inline-block',
                    opacity: 0.8,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#E87A20';
                    e.currentTarget.style.transform = 'translateX(-6px)';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-footer)';
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.opacity = '0.8';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>

          {/* ---------- تواصل معنا ---------- */}
          <Col xs={12} lg={4}>
            <h6
              style={{
                color: '#E87A20',
                fontSize: '1rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1.2rem',
                position: 'relative',
              }}
            >
              تواصل معنا
              <span
                style={{
                  display: 'block',
                  width: '30px',
                  height: '2px',
                  backgroundColor: '#E87A20',
                  marginTop: '6px',
                  borderRadius: '1px',
                }}
              />
            </h6>

            <p
              style={{
                color: 'var(--text-footer)',
                fontSize: '0.9rem',
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1.25rem',
                transition: 'color 0.3s ease',
                opacity: 0.85,
                lineHeight: 1.75,
              }}
            >
              هل لديك استفسار، ملاحظة، أو فكرة تخدم مجتمعنا؟
              <br />
              فريق بصمة جاهز لمساعدتك.
            </p>

            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                backgroundColor: '#E87A20',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Cairo, sans-serif',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(232, 122, 32, 0.25)',
                maxWidth: 'fit-content',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D46A1A';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(232, 122, 32, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E87A20';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 16px rgba(232, 122, 32, 0.25)';
              }}
            >
              <FaHeadset size={15} />
              تواصل معنا
            </Link>
          </Col>
        </Row>

        {/* ============================================ */}
        {/* Divider */}
        {/* ============================================ */}
        <hr
          style={{
            border: 'none',
            height: '1px',
            background:
              'linear-gradient(to left, transparent, rgba(255,255,255,0.1), transparent)',
            margin: '2.5rem 0 1.5rem',
          }}
        />

        {/* ============================================ */}
        {/* Bottom bar */}
        {/* ============================================ */}
        <Row className="align-items-center">
          <Col xs={12} md={6}>
            <div
              className="text-center text-md-end"
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-footer)',
                opacity: 0.7,
                fontFamily: 'Cairo, sans-serif',
                transition: 'color 0.3s ease',
              }}
            >
              © {currentYear} بصمة — منصة مجتمعية لأهل غزة.
              <br className="d-md-none" />
              جميع الحقوق محفوظة.
            </div>
          </Col>
          <Col
            xs={12}
            md={6}
            className="text-center text-md-start mt-3 mt-md-0"
          >
            <div
              className="d-flex flex-wrap justify-content-center justify-content-md-start"
              style={{
                gap: '1.5rem',
                fontSize: '0.8rem',
              }}
            >
              <Link
                to="/privacy-policy"
                style={{
                  color: 'var(--text-footer)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontFamily: 'Cairo, sans-serif',
                  opacity: 0.7,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#E87A20';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-footer)';
                  e.currentTarget.style.opacity = '0.7';
                }}
              >
                سياسة الخصوصية
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
              <Link
                to="/terms"
                style={{
                  color: 'var(--text-footer)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontFamily: 'Cairo, sans-serif',
                  opacity: 0.7,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#E87A20';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-footer)';
                  e.currentTarget.style.opacity = '0.7';
                }}
              >
                شروط الخدمة
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
              <Link
                to="/contact"
                style={{
                  color: 'var(--text-footer)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontFamily: 'Cairo, sans-serif',
                  opacity: 0.7,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#E87A20';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-footer)';
                  e.currentTarget.style.opacity = '0.7';
                }}
              >
                اتصل بنا
              </Link>
            </div>
          </Col>
        </Row>
      </Container>

      {/* ============================================ */}
      {/* Scroll to Top */}
      {/* ============================================ */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#E87A20',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(232, 122, 32, 0.4)',
            zIndex: 1000,
            animation: 'footerFadeInUp 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#D46A1A';
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
            e.currentTarget.style.boxShadow =
              '0 8px 32px rgba(232, 122, 32, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#E87A20';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow =
              '0 4px 16px rgba(232, 122, 32, 0.4)';
          }}
          aria-label="العودة إلى الأعلى"
        >
          <FaArrowUp />
        </button>
      )}

      <style>{`
        @keyframes footerFadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;