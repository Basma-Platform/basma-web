import { Link } from 'react-router-dom';
import { FaBan } from 'react-icons/fa';
import { Container } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { getDashboardPath } from '../utils/authRedirect';
import SEO from '../components/SEO';

const NotAuthorizedPage = () => {
  const { user } = useAuth();
  const homeLink = getDashboardPath(user?.role);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        paddingTop: '100px',
        paddingBottom: '60px',
        backgroundColor: 'var(--bg-body)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <SEO title="غير مصرح بالوصول" />
      <Container>
        <div
          className="text-center"
          style={{
            maxWidth: 520,
            margin: '0 auto',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            boxShadow: '0 8px 32px var(--shadow-sm)',
            border: '1px solid var(--border-color)',
          }}
        >
          <FaBan size={62} color="var(--error)" className="mb-4" />
          <h1
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.6rem',
              fontWeight: 800,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '0.5rem',
            }}
          >
            غير مصرح لك بالوصول لهذه الصفحة
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              lineHeight: 1.9,
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            حسابك لا يملك الصلاحية اللازمة لعرض هذا المحتوى.
          </p>
          <div className="mt-4">
            <Link to={homeLink} style={{ color: 'var(--primary-orange)', fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              العودة إلى لوحة التحكم
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotAuthorizedPage;