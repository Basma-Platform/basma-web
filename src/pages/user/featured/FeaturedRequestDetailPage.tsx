import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaStar,
  FaExclamationTriangle,
  FaArrowRight,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useUserFeaturedRequestDetail } from '../../../hooks/useUserFeaturedRequestDetail';
import { UserFeaturedRequestDetailCard } from '../../../components/user/featured';

const FeaturedRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { detail, loading, fetchDetail } = useUserFeaturedRequestDetail();

  // ✅ Track whether the fetch for the current id has finished
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const load = async () => {
      setHasAttempted(false);
      try {
        await fetchDetail(Number(id));
      } catch {
        // Error toast handled inside hook
      } finally {
        if (!cancelled) setHasAttempted(true);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, fetchDetail]);

  // ============================================
  // Loading
  // ============================================
  if (loading || !hasAttempted) {
    return (
      <>
        <SEO title="تفاصيل طلب التمييز" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '1rem',
            paddingBottom: '3rem',
          }}
        >
          <Container fluid="xl" className="px-3 px-md-4">
            <div
              style={{
                maxWidth: '720px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <style>{`
                @keyframes pageShimmer {
                  0% { opacity: 0.4; }
                  50% { opacity: 0.85; }
                  100% { opacity: 0.4; }
                }
                .featured-page-skeleton {
                  animation: pageShimmer 1.5s ease-in-out infinite;
                  background-color: var(--border-color);
                }
              `}</style>
              <div
                className="featured-page-skeleton"
                style={{ height: '70px', borderRadius: '14px' }}
              />
              <div
                className="featured-page-skeleton"
                style={{ height: '120px', borderRadius: '14px' }}
              />
              <div
                className="featured-page-skeleton"
                style={{ height: '100px', borderRadius: '14px' }}
              />
            </div>
          </Container>
        </div>
      </>
    );
  }

  // ============================================
  // Error / not found
  // ============================================
  if (!detail) {
    return (
      <>
        <SEO title="تفاصيل طلب التمييز" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
          }}
        >
          <div
            style={{
              maxWidth: '460px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <FaExclamationTriangle size={42} color="#DC3545" opacity={0.6} />
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                fontWeight: 800,
                margin: '1rem 0 8px',
              }}
            >
              الطلب غير موجود
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              لا يمكن عرض تفاصيل هذا الطلب.
            </p>
            <Link
              to="/user/featured-requests"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-orange)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              <FaArrowRight size={11} />
              العودة إلى الطلبات
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // Success
  // ============================================
  return (
    <>
      <SEO
        title={`تفاصيل طلب التمييز #${detail.id}`}
        description="تفاصيل طلب تمييز الإعلان"
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '1rem',
          paddingBottom: '3rem',
        }}
        dir="rtl"
      >
        <Container fluid="xl" className="px-3 px-md-4">
          {/* ============================================
              Breadcrumb + Title
              ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              maxWidth: '720px',
              margin: '0 auto 1.25rem',
            }}
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
                to="/user/featured-requests"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                طلبات التمييز
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ opacity: 0.7 }}>طلب #{detail.id}</span>
            </div>

            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FFC107, #F5A623)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(255,193,7,0.35)',
                  flexShrink: 0,
                }}
              >
                <FaStar size={22} color="#FFFFFF" />
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
                  تفاصيل طلب التمييز
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  عرض كامل لتفاصيل طلب التمييز #{detail.id}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <UserFeaturedRequestDetailCard detail={detail} />
          </div>
        </Container>
      </div>
    </>
  );
};

export default FeaturedRequestDetailPage;