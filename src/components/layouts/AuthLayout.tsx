import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo.png';

const AuthLayout = () => {
  const { isDark, toggleDarkMode } = useTheme();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-body)',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* ✅ Navbar مبسّط */}
      <nav
        style={{
          padding: '12px 24px',
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <Container>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo - مع لون مناسب للوضع الفاتح/الداكن */}
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
              }}
            >
              <img
                src={logo}
                alt="بصمة"
                style={{
                  height: '36px',
                  width: 'auto',
                  // ✅ في الوضع الداكن: يصبح أبيض، في الوضع الفاتح: لونه الطبيعي
                  filter: isDark ? 'brightness(0) invert(1)' : 'none',
                  transition: 'filter 0.3s ease',
                }}
              />
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  transition: 'color 0.3s ease',
                }}
              >
                بصمة
              </span>
            </Link>

            {/* روابط بسيطة + Dark Mode Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <Link
                to="/"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  fontFamily: 'Cairo, sans-serif',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary-orange)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                الرئيسية
              </Link>
              <Link
                to="/announcements"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  fontFamily: 'Cairo, sans-serif',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary-orange)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                الإعلانات
              </Link>

              {/* ✅ Dark Mode Toggle Button */}
              <button
                onClick={toggleDarkMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.08)';
                  e.currentTarget.style.color = 'var(--primary-orange)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
                aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
              >
                {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
              </button>
            </div>
          </div>
        </Container>
      </nav>

      {/* ✅ محتوى الصفحة */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
        }}
      >
        <Container>
          <Outlet />
        </Container>
      </main>

      {/* ✅ Footer مبسّط */}
      <footer
        style={{
          padding: '16px 24px',
          backgroundColor: 'var(--bg-card)',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <Container>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontFamily: 'Cairo, sans-serif',
              margin: 0,
              opacity: 0.6,
            }}
          >
            © {new Date().getFullYear()} بصمة - منصة تبادل مجتمعية لأهل غزة
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default AuthLayout;