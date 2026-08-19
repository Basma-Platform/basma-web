import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaXTwitter, FaInstagram, FaYoutube, FaWhatsapp, FaArrowUp } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';

const Footer = () => {
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top button after scrolling 300px
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
    { icon: <FaFacebookF size={18} />, url: '#', color: '#1877F2', label: 'فيسبوك' },
    { icon: <FaXTwitter size={18} />, url: '#', color: '#000000', label: 'X' },
    { icon: <FaInstagram size={18} />, url: '#', color: '#E4405F', label: 'انستغرام' },
    { icon: <FaYoutube size={18} />, url: '#', color: '#FF0000', label: 'يوتيوب' },
    { icon: <FaWhatsapp size={18} />, url: '#', color: '#25D366', label: 'واتساب' },
  ];

  const quickLinks = [
    { path: '/announcements', label: 'الإعلانات' },
    { path: '/about', label: 'من نحن' },
    { path: '/faq', label: 'الأسئلة الشائعة' },
    { path: '/contact', label: 'اتصل بنا' },
  ];

  const legalLinks = [
    { path: '/privacy-policy', label: 'سياسة الخصوصية' },
    { path: '/terms', label: 'شروط الخدمة' },
  ];

  return (
    <footer
      style={{
        backgroundColor: isDark ? '#0d0d1a' : '#6B4226',
        color: isDark ? '#C49A6C' : '#FDF5E6',
        padding: '4rem 0 1.5rem',
        marginTop: 'auto',
        position: 'relative',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <Container>
        <Row className="g-5">
          {/* Brand Column */}
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
                  filter: isDark ? 'brightness(0) invert(1)' : 'brightness(0) invert(1)',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(-8deg) scale(1.1)';
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
                maxWidth: '350px',
                fontFamily: 'Cairo, sans-serif',
                color: isDark ? '#C49A6C' : '#FDF5E6',
                transition: 'color 0.3s ease',
              }}
            >
              منصة تبادل مجتمعية لأهل غزة، نساهم في بناء مجتمع أقوى من خلال التبادل والتعاون.
            </p>

            {/* Social Icons */}
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
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)',
                    color: isDark ? '#C49A6C' : '#FDF5E6',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.color;
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${social.color}40`;
                    e.currentTarget.style.borderColor = social.color;
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = isDark ? '#C49A6C' : '#FDF5E6';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={6} lg={2}>
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
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    color: isDark ? '#C49A6C' : '#C49A6C',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Cairo, sans-serif',
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#E87A20';
                    e.currentTarget.style.transform = 'translateX(-6px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isDark ? '#C49A6C' : '#C49A6C';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>

          {/* Legal Links */}
          <Col xs={6} lg={2}>
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
              روابط قانونية
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
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    color: isDark ? '#C49A6C' : '#C49A6C',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Cairo, sans-serif',
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#E87A20';
                    e.currentTarget.style.transform = 'translateX(-6px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isDark ? '#C49A6C' : '#C49A6C';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>

          {/* Newsletter / Contact */}
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
                color: isDark ? '#C49A6C' : '#C49A6C',
                fontSize: '0.9rem',
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1rem',
                transition: 'color 0.3s ease',
              }}
            >
              تابعنا على وسائل التواصل الاجتماعي
              <br />
              للبقاء على اطلاع بآخر الإعلانات والفعاليات.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '4px',
                maxWidth: '320px',
                transition: 'background-color 0.3s ease',
              }}
            >
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '10px',
                  backgroundColor: 'transparent',
                  color: isDark ? '#FDF5E6' : '#FDF5E6',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'Cairo, sans-serif',
                  direction: 'rtl',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              />
              <button
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '10px',
                  backgroundColor: '#E87A20',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Cairo, sans-serif',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D46A1A';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#E87A20';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                اشترك
              </button>
            </div>
          </Col>
        </Row>

        {/* Divider */}
        <hr
          style={{
            border: 'none',
            height: '1px',
            background: isDark 
              ? 'linear-gradient(to left, transparent, rgba(255,255,255,0.05), transparent)'
              : 'linear-gradient(to left, transparent, rgba(255,255,255,0.1), transparent)',
            margin: '2.5rem 0 1.5rem',
          }}
        />

        {/* Bottom Bar */}
        <Row className="align-items-center">
          <Col xs={12} md={6}>
            <div
              className="text-center text-md-end"
              style={{
                fontSize: '0.85rem',
                color: isDark ? '#C49A6C' : '#C49A6C',
                opacity: 0.7,
                fontFamily: 'Cairo, sans-serif',
                transition: 'color 0.3s ease',
              }}
            >
              © {currentYear} بصمة - منصة تبادل مجتمعية لأهل غزة.
              <br className="d-md-none" />
              جميع الحقوق محفوظة.
            </div>
          </Col>
          <Col xs={12} md={6} className="text-center text-md-start mt-3 mt-md-0">
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
                  color: isDark ? '#C49A6C' : '#C49A6C',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontFamily: 'Cairo, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#E87A20';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? '#C49A6C' : '#C49A6C';
                }}
              >
                سياسة الخصوصية
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
              <Link
                to="/terms"
                style={{
                  color: isDark ? '#C49A6C' : '#C49A6C',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontFamily: 'Cairo, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#E87A20';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? '#C49A6C' : '#C49A6C';
                }}
              >
                شروط الخدمة
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
              <Link
                to="/contact"
                style={{
                  color: isDark ? '#C49A6C' : '#C49A6C',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontFamily: 'Cairo, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#E87A20';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? '#C49A6C' : '#C49A6C';
                }}
              >
                اتصل بنا
              </Link>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
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
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(232, 122, 32, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#E87A20';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(232, 122, 32, 0.4)';
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