import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaStar,
  FaChevronLeft,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaHourglassHalf,
  FaEye,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useUserAnnouncement } from '../../../hooks/useUserAnnouncement';
import {
  FeaturedRequestForm,
  FeaturedRequestPageSkeleton,
} from '../../../components/user/announcements';

const RequestFeaturedPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { announcement, loading, fetchAnnouncement } = useUserAnnouncement();

  useEffect(() => {
    if (id) fetchAnnouncement(Number(id));
  }, [id, fetchAnnouncement]);

  // ============================================
  // Loading
  // ============================================
  if (loading && !announcement) {
    return (
      <>
        <SEO title="طلب تمييز الإعلان" />
        <FeaturedRequestPageSkeleton />
      </>
    );
  }

  // ============================================
  // Not Found
  // ============================================
  if (!announcement) {
    return (
      <>
        <SEO title="الإعلان غير موجود" />
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-body)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 12px 24px',
            overflowX: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
          }}
          dir="rtl"
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              padding: '1.75rem 1rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              fontFamily: 'Cairo, sans-serif',
              boxShadow: '0 8px 24px var(--shadow-sm)',
              boxSizing: 'border-box',
            }}
          >
            <FaExclamationTriangle size={42} color="#DC3545" opacity={0.6} />
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                fontWeight: 800,
                margin: '0.85rem 0 6px',
              }}
            >
              الإعلان غير موجود
            </h3>
            <Link
              to="/user/my-announcements"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-orange)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginTop: '0.85rem',
              }}
            >
              <FaChevronLeft size={10} />
              العودة إلى إعلاناتي
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // Already Featured
  // ============================================
  if (announcement.is_currently_featured) {
    return (
      <>
        <SEO title="الإعلان مميز بالفعل" />
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-body)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 12px 24px',
            overflowX: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
          }}
          dir="rtl"
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              padding: '1.75rem 1rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1.5px solid rgba(40,167,69,0.3)',
              background:
                'linear-gradient(135deg, rgba(40,167,69,0.06), transparent)',
              textAlign: 'center',
              fontFamily: 'Cairo, sans-serif',
              boxShadow: '0 8px 24px var(--shadow-sm)',
              boxSizing: 'border-box',
            }}
          >
            <FaCheckCircle size={42} color="#28A745" />
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                fontWeight: 800,
                margin: '0.85rem 0 6px',
              }}
            >
              الإعلان مميز بالفعل
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                lineHeight: 1.6,
                margin: '0 0 1.25rem',
              }}
            >
              هذا الإعلان يتمتع بخاصية التمييز حالياً. يمكنك إعادة تمييزه بعد
              انتهاء الباقة النشطة.
            </p>
            <Link
              to={`/user/announcements/${announcement.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-orange)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <FaEye size={11} />
              عرض الإعلان
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // Pending Request Exists
  // ============================================
  if (announcement.featured_request_status === 'pending') {
    return (
      <>
        <SEO title="طلب قيد المراجعة" />
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-body)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 12px 24px',
            overflowX: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
          }}
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '2rem 1.25rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '18px',
              border: '1.5px solid rgba(232,122,32,0.4)',
              background:
                'linear-gradient(135deg, rgba(232,122,32,0.08), var(--bg-card))',
              textAlign: 'center',
              fontFamily: 'Cairo, sans-serif',
              boxShadow: '0 10px 30px rgba(232,122,32,0.15)',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: 'rgba(232,122,32,0.15)',
                color: 'var(--primary-orange)',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginBottom: '1rem',
              }}
            >
              <FaHourglassHalf size={10} className="fa-spin" />
              طلب تمييز معلق
            </div>

            <div
              style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 12px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F5A623, #E87A20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 15px rgba(232,122,32,0.3)',
              }}
            >
              <FaClock size={24} />
            </div>

            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.15rem',
                fontWeight: 900,
                margin: '0 0 8px',
              }}
            >
              لديك طلب تمييز قيد المراجعة لهذا الإعلان
            </h3>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                lineHeight: 1.6,
                margin: '0 0 1.5rem',
              }}
            >
              تم استلام إيصال التحويل بنجاح، وطلبك الآن قيد التدقيق من قِبل
              الإدارة. سيتم تفعيل التمييز خلال أقل من 24 ساعة.
            </p>

            <div
              style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}
            >
              <Link
                to="/user/featured-requests"
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-orange)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(232,122,32,0.3)',
                }}
              >
                <FaEye size={11} />
                عرض طلباتي
              </Link>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // ============================================
  // Standard Render (Form Page)
  // ============================================
  return (
    <>
      <SEO
        title={`تمييز: ${announcement.title}`}
        description="ميّز إعلانك ليصل إلى آلاف المستخدمين"
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '4.5rem',
          paddingBottom: '3rem',
          overflowX: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
        }}
        dir="rtl"
      >
        <Container
          fluid
          style={{
            paddingLeft: '12px',
            paddingRight: '12px',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              maxWidth: '850px',
              margin: '0 auto',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                marginBottom: '1.25rem',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Breadcrumb */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.65rem',
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
                <FaChevronLeft size={9} style={{ opacity: 0.4 }} />
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
                <FaChevronLeft size={9} style={{ opacity: 0.4 }} />
                <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                  تمييز الإعلان
                </span>
              </div>

              {/* Title Container */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'var(--bg-card)',
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 16px var(--shadow-sm)',
                  boxSizing: 'border-box',
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #F5A623, #E87A20)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 3px 12px rgba(245,166,35,0.4)',
                    flexShrink: 0,
                  }}
                >
                  <FaStar size={16} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h1
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'clamp(1rem, 4vw, 1.35rem)',
                      fontWeight: 900,
                      fontFamily: 'Cairo, sans-serif',
                      margin: 0,
                      lineHeight: 1.25,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    ميّز إعلانك الآن
                  </h1>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontFamily: 'Cairo, sans-serif',
                      margin: '2px 0 0 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    اختر الباقة، حوّل المبلغ، وارفع الإشعار لزيادة مبيعاتك
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Form Component */}
            <FeaturedRequestForm
              announcement={announcement as any}
              onSuccess={() => {
                // Navigation handled inside FeaturedRequestForm
                // Fallback: if for some reason onSuccess fires without navigation
                // we go to the list.
              }}
              onCancel={() => navigate(`/user/announcements/${announcement.id}`)}
            />
          </div>
        </Container>
      </div>
    </>
  );
};

export default RequestFeaturedPage;