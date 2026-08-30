import { Link } from 'react-router-dom';
import { FaMapSigns } from 'react-icons/fa';
import { Container } from 'react-bootstrap';
import SEO from '../components/SEO';

const NotFoundPage = () => {
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
      <SEO title="الصفحة غير موجودة" />
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
          <FaMapSigns size={62} color="var(--primary-orange)" className="mb-4" />
          <h1
            style={{
              color: 'var(--text-secondary)',
              fontSize: '2.4rem',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '0.25rem',
            }}
          >
            404
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              lineHeight: 1.9,
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
          <div className="mt-4">
            <Link to="/" style={{ color: 'var(--primary-orange)', fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;