import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronLeft,
  FaStar,
  FaHistory,
  FaBoxOpen,
  FaExclamationTriangle,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useFeaturedRequest } from '../../../hooks/useFeaturedRequest';
import {
  FeaturedRequestCard,
  FeaturedRequestsHistorySkeleton,
} from '../../../components/user/announcements';

const FeaturedRequestsHistoryPage = () => {
  const navigate = useNavigate();
  const { loading, requests, fetchMyFeaturedRequests } = useFeaturedRequest();

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        await fetchMyFeaturedRequests({ page: 1, per_page: 20 });
      } catch {
        setError('حدث خطأ في تحميل طلبات التمييز');
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, [fetchMyFeaturedRequests]);

  const filteredRequests =
    statusFilter === 'all'
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  const tabTheme: Record<string, string> = {
    all: 'var(--primary-orange)',
    pending: '#FFB800',
    approved: '#28A745',
    rejected: '#DC3545',
  };

  const handleCardClick = (requestId: number) => {
    navigate(`/user/featured-requests/${requestId}`);
  };

  // ============================================
  // Initial loading
  // ============================================
  if (initialLoading) {
    return (
      <>
        <SEO title="طلبات التمييز" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '1rem',
            paddingBottom: '3rem',
          }}
          dir="rtl"
        >
          <Container fluid="xl" className="px-2 px-md-4">
            <FeaturedRequestsHistorySkeleton count={4} />
          </Container>
        </div>
      </>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO
        title="طلبات التمييز"
        description="سجل جميع طلبات تمييز إعلاناتك"
      />

      <div className="featured-history-page" dir="rtl">
        <Container
          fluid="xl"
          className="px-2 px-md-4"
          style={{ maxWidth: '100%', boxSizing: 'border-box' }}
        >
          {/* ============================================
              Header
              ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '1.25rem' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '0.7rem',
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
              <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                طلبات التمييز
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FFC107, #F5A623)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(255,193,7,0.35)',
                  flexShrink: 0,
                }}
              >
                <FaHistory size={19} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.25rem, 4vw, 1.6rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  طلبات التمييز
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  سجل كامل لطلبات تمييز إعلاناتك
                </p>
              </div>
            </div>
          </motion.div>

          {/* ============================================
              Filters Tabs — evenly spread across full width
              ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="featured-history-tabs"
            role="tablist"
            aria-label="فلترة طلبات التمييز"
          >
            {(
              [
                { value: 'all', label: 'الكل', count: counts.all },
                {
                  value: 'pending',
                  label: 'قيد المراجعة',
                  count: counts.pending,
                },
                {
                  value: 'approved',
                  label: 'تمت الموافقة',
                  count: counts.approved,
                },
                { value: 'rejected', label: 'مرفوض', count: counts.rejected },
              ] as const
            ).map((tab) => {
              const active = statusFilter === tab.value;
              const color = tabTheme[tab.value];
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(tab.value)}
                  className="featured-history-tab"
                  style={{
                    color: active ? color : 'var(--text-muted)',
                    fontWeight: active ? 800 : 600,
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="featured-tab-highlight"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 32,
                      }}
                      className="featured-history-tab__highlight"
                    />
                  )}
                  <span className="featured-history-tab__label">
                    {tab.label}
                  </span>
                  <span
                    className="featured-history-tab__count"
                    style={{
                      backgroundColor: active
                        ? `${color}20`
                        : 'rgba(0,0,0,0.06)',
                      color: active ? color : 'var(--text-muted)',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* ============================================
              Error
              ============================================ */}
          {error && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(220,53,69,0.08)',
                color: 'var(--error)',
                borderRadius: '10px',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                border: '1px solid rgba(220,53,69,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FaExclamationTriangle size={13} />
              {error}
            </div>
          )}

          {/* ============================================
              List
              ============================================ */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FeaturedRequestsHistorySkeleton count={4} />
              </motion.div>
            ) : filteredRequests.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: 'clamp(2.25rem, 8vw, 3rem) 1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '18px',
                  border: '1px dashed var(--border-color)',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    margin: '0 auto 1rem',
                    borderRadius: '50%',
                    background: 'rgba(255,193,7,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFC107',
                  }}
                >
                  <FaBoxOpen size={30} opacity={0.75} />
                </div>
                <h3
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    margin: '0 0 6px',
                  }}
                >
                  {statusFilter === 'all'
                    ? 'لا توجد طلبات تمييز بعد'
                    : 'لا توجد طلبات في هذه الفئة'}
                </h3>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    margin: '0 0 1.25rem',
                    lineHeight: 1.6,
                    maxWidth: '320px',
                    marginInline: 'auto',
                  }}
                >
                  {statusFilter === 'all'
                    ? 'عند طلب تمييز إعلان، ستظهر حالة الطلب هنا.'
                    : 'حاول تغيير الفلتر لعرض نتائج أخرى.'}
                </p>

                {statusFilter === 'all' ? (
                  <Link
                    to="/user/my-announcements"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '11px 20px',
                      minHeight: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #FFC107, #F5A623)',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      boxShadow: '0 4px 16px rgba(255,193,7,0.32)',
                    }}
                  >
                    <FaStar size={13} />
                    اذهب إلى إعلاناتي
                  </Link>
                ) : (
                  <button
                    onClick={() => setStatusFilter('all')}
                    style={{
                      padding: '10px 20px',
                      minHeight: '44px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--primary-orange)',
                      backgroundColor: 'transparent',
                      color: 'var(--primary-orange)',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    عرض الكل
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(index * 0.04, 0.3),
                    }}
                  >
                    <FeaturedRequestCard
                      request={request}
                      onClick={() => handleCardClick(request.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </div>

      {/* ============================================
          Page-scoped styles
          ============================================ */}
      <style>{`
        .featured-history-page {
          background-color: var(--bg-body);
          min-height: 100vh;
          padding-top: 1rem;
          padding-bottom: 3rem;
          overflow-x: hidden;
        }

        /* ============================================
           Tabs — evenly spread across full container width
           ============================================ */
        .featured-history-tabs {
          display: flex;
          gap: 6px;
          padding: 5px;
          background-color: var(--bg-input);
          border-radius: 14px;
          border: 1px solid var(--border-color);
          margin-bottom: 1.25rem;
          width: 100%;
          box-sizing: border-box;
        }

        .featured-history-tab {
          position: relative;
          flex: 1 1 0;               /* ✅ distribute equally */
          min-width: 0;               /* ✅ prevent flex overflow */
          padding: 10px 8px;
          min-height: 40px;
          border-radius: 11px;
          border: none;
          background: transparent;
          font-family: 'Cairo', sans-serif;
          font-size: 0.78rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
          white-space: nowrap;
          overflow: hidden;           /* ✅ prevent text overflow */
          -webkit-tap-highlight-color: transparent;
          transition: color 0.2s ease;
        }

        .featured-history-tab__highlight {
          position: absolute;
          inset: 0;
          background-color: var(--bg-card);
          border-radius: 11px;
          box-shadow: 0 2px 10px var(--shadow-sm);
          z-index: 0;
        }

        .featured-history-tab__label {
          position: relative;
          z-index: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .featured-history-tab__count {
          position: relative;
          z-index: 1;
          padding: 1px 7px;
          border-radius: 7px;
          font-size: 0.65rem;
          font-weight: 800;
          font-family: system-ui, sans-serif;
          min-width: 18px;
          text-align: center;
          flex-shrink: 0;
        }

        /* ============================================
           Responsive — under 480px
           ============================================ */
        @media (max-width: 480px) {
          .featured-history-tabs {
            padding: 4px;
            gap: 4px;
            border-radius: 12px;
          }

          .featured-history-tab {
            padding: 8px 4px;
            min-height: 36px;
            font-size: 0.72rem;
            gap: 4px;
          }

          /* Hide count pill on the smallest screens if it crowds the label */
          .featured-history-tab__count {
            font-size: 0.6rem;
            padding: 1px 5px;
            min-width: 16px;
          }
        }

        /* Extra small — under 380px */
        @media (max-width: 380px) {
          .featured-history-tab {
            font-size: 0.68rem;
            padding: 8px 2px;
          }

          /* Long labels like "قيد المراجعة" get truncated instead of wrapping */
          .featured-history-tab__label {
            max-width: 60px;
          }
        }
      `}</style>
    </>
  );
};

export default FeaturedRequestsHistoryPage;