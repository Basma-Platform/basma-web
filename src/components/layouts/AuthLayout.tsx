import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const AuthLayout = () => {
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
            {/* Logo */}
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
                }}
              />
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                بصمة
              </span>
            </Link>

            {/* روابط بسيطة */}
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
          {/*
            FIX: this used to hardcode maxWidth: '480px' here, which capped
            EVERY auth page (login, register, forgot/reset password, verify
            email) to the same narrow width. Login/Forgot/Reset already set
            their own maxWidth on their own wrapper, so removing this doesn't
            change them at all — it only frees Register to use a wider
            two-panel layout instead of being squeezed into 480px.
          */}
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