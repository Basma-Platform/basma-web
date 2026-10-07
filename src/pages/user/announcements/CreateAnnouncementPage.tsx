import { useNavigate, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaBullhorn,
  FaPlus,
  FaGift,
  FaSearch,
  FaArrowDown,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAuth } from '../../../hooks/useAuth';
import CreateAnnouncementForm from '../../../components/user/announcements/forms/CreateAnnouncementForm';
import { DUAL_LABEL } from '../../../utils/announcementNaming';

const CreateAnnouncementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <SEO
        title={DUAL_LABEL.createCTA}
        description="انشر عرضاً لخدماتك أو طلباً لما تحتاجه على منصة بصمة"
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
          {/* Breadcrumb + Title */}
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
                خدماتي
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                إنشاء
              </span>
            </div>

            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                  flexShrink: 0,
                }}
              >
                <FaPlus size={22} color="#FFFFFF" />
              </div>
              <div style={{ minWidth: 0 }}>
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
                  {DUAL_LABEL.createCTA}
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  شارك خدماتك أو ابحث عن ما تحتاجه في مجتمعك
                </p>
              </div>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* Informational preview — two types (NOT clickable) */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
              marginBottom: '0.85rem',
            }}
          >
            {/* Card 1 — عرض خدمة */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 rgba(40,167,69,0)',
                  '0 0 0 3px rgba(40,167,69,0.08)',
                  '0 0 0 rgba(40,167,69,0)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-card)',
                border: '1.5px solid rgba(40,167,69,0.3)',
                fontFamily: 'Cairo, sans-serif',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '11px',
                  backgroundColor: 'rgba(40,167,69,0.15)',
                  color: '#28A745',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FaGift size={15} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    marginBottom: '2px',
                  }}
                >
                  عرض خدمة
                </div>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.7rem',
                  }}
                >
                  لديك خدمة تقدّمها للمجتمع
                </div>
              </div>
            </motion.div>

            {/* Card 2 — طلب خدمة */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 rgba(220,53,69,0)',
                  '0 0 0 3px rgba(220,53,69,0.08)',
                  '0 0 0 rgba(220,53,69,0)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.4,
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-card)',
                border: '1.5px solid rgba(220,53,69,0.3)',
                fontFamily: 'Cairo, sans-serif',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '11px',
                  backgroundColor: 'rgba(220,53,69,0.12)',
                  color: '#DC3545',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FaSearch size={15} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    marginBottom: '2px',
                  }}
                >
                  طلب خدمة
                </div>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.7rem',
                  }}
                >
                  تبحث عن خدمة يقدمها غيرك
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ============================================ */}
          {/* Hint — guide users to the form's type selector */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '1.25rem',
              color: 'var(--text-muted)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.78rem',
              fontWeight: 600,
              textAlign: 'center',
              flexWrap: 'wrap',
            }}
          >
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'rgba(232,122,32,0.1)',
                color: 'var(--primary-orange)',
              }}
            >
              <FaArrowDown size={10} />
            </motion.span>
            <span>اختر نوع الإعلان (عرض / طلب) من النموذج أدناه</span>
          </motion.div>

          {/* ============================================ */}
          {/* Info Banner */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
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
                  من العروض والطلبات.
                </>
              ) : (
                <>
                  يمكنك نشر حتى{' '}
                  <strong style={{ color: 'var(--primary-orange)' }}>
                    5 عروض أو طلبات
                  </strong>{' '}
                  شهرياً.{' '}
                  <Link
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
          {/* Form — the actual place to pick the type */}
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