import { useNavigate, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaBullhorn, FaPlus } from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAuth } from '../../../hooks/useAuth';
import CreateAnnouncementForm from '../../../components/user/announcements/forms/CreateAnnouncementForm';

const CreateAnnouncementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ Not authenticated (should not happen — PrivateRoute guards)
  if (!user) {
    return null;
  }

  return (
    <>
      <SEO
        title="إنشاء إعلان جديد"
        description="انشر إعلانك الجديد على منصة بصمة - تبادل السلع والخدمات في غزة"
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '1rem',
          paddingBottom: '3rem',
        }}
      >
        <Container fluid="xl" className="px-3 px-md-4">
          {/* ============================================ */}
          {/* Breadcrumb + Page Title */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '1.5rem' }}
          >
            {/* Breadcrumb */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
                flexWrap: 'wrap',
              }}
            >
              <Link
                to="/user/dashboard"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                لوحة التحكم
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <Link
                to="/user/my-announcements"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                إعلاناتي
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                إنشاء إعلان
              </span>
            </div>

            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg, #E87A20, #F5A623)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                }}
              >
                <FaPlus size={22} color="#FFFFFF" />
              </div>
              <div>
                <h1
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.4rem, 2vw, 1.7rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  إنشاء إعلان جديد
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  شارك السلع أو الخدمات مع مجتمعك في غزة
                </p>
              </div>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* Info Banner */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              backgroundColor: 'rgba(40,167,69,0.06)',
              border: '1px solid rgba(40,167,69,0.2)',
              borderRadius: '12px',
              marginBottom: '1.25rem',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'rgba(40,167,69,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FaBullhorn size={14} color="#28A745" />
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                flex: 1,
                minWidth: 0,
              }}
            >
              {user.is_verified ? (
                <>
                  بصفتك مستخدماً موثقاً، يمكنك نشر{' '}
                  <strong style={{ color: '#28A745' }}>
                    عدد غير محدود
                  </strong>{' '}
                  من الإعلانات.
                </>
              ) : (
                <>
                  يمكنك نشر حتى{' '}
                  <strong style={{ color: 'var(--primary-orange)' }}>
                    5 إعلانات
                  </strong>{' '}
                  شهرياً. <Link
                    to="/user/verify-identity"
                    style={{
                      color: 'var(--primary-orange)',
                      fontWeight: 700,
                      textDecoration: 'none',
                      marginRight: '4px',
                    }}
                  >
                    وثّق حسابك
                  </Link>{' '}
                  للنشر غير المحدود.
                </>
              )}
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* Form */}
          {/* ============================================ */}
          <CreateAnnouncementForm
            user={user}
            onSuccess={(id) => navigate(`/user/announcements/${id}/success`)}
            onCancel={() => navigate('/user/my-announcements')}
          />
        </Container>
      </div>
    </>
  );
};

export default CreateAnnouncementPage;