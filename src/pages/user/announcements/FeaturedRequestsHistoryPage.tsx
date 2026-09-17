import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
  const { loading, requests, fetchMyFeaturedRequests } = useFeaturedRequest();

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // Fetch Requests
  // ============================================
  useEffect(() => {
    const load = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        await fetchMyFeaturedRequests({ page: 1, per_page: 20 });
      } catch (err) {
        setError('حدث خطأ في تحميل طلبات التمييز');
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, [fetchMyFeaturedRequests]);

  // ============================================
  // Filter
  // ============================================
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

  // ============================================
  // Initial Skeleton
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
          <Container fluid="xl" className="px-3 px-md-4">
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
          {/* ============================================ */}
          {/* Header */}
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
              <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                طلبات التمييز
              </span>
            </div>

            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #F5A623, #E87A20)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(245,166,35,0.35)',
                }}
              >
                <FaHistory size={22} />
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
                  طلبات التمييز
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  سجل كامل لطلبات تمييز إعلاناتك
                </p>
              </div>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* Status Filters */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              display: 'flex',
              gap: '6px',
              padding: '4px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem',
              overflowX: 'auto',
              flexWrap: 'wrap',
            }}
          >
            {(
              [
                { value: 'all', label: 'الكل', count: counts.all },
                { value: 'pending', label: 'قيد المراجعة', count: counts.pending },
                { value: 'approved', label: 'تمت الموافقة', count: counts.approved },
                { value: 'rejected', label: 'مرفوض', count: counts.rejected },
              ] as const
            ).map((tab) => {
              const active = statusFilter === tab.value;
              return (
                <motion.button
                  key={tab.value}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setStatusFilter(tab.value)}
                  style={{
                    flex: '1 1 auto',
                    minWidth: 'fit-content',
                    padding: '9px 16px',
                    borderRadius: '9px',
                    border: 'none',
                    backgroundColor: active ? 'var(--bg-card)' : 'transparent',
                    color: active ? 'var(--primary-orange)' : 'var(--text-muted)',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.8rem',
                    fontWeight: active ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? '0 2px 8px var(--shadow-sm)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                  <span
                    style={{
                      padding: '1px 7px',
                      borderRadius: '6px',
                      backgroundColor: active
                        ? 'rgba(232,122,32,0.15)'
                        : 'rgba(0,0,0,0.05)',
                      color: active ? 'var(--primary-orange)' : 'var(--text-muted)',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      fontFamily: 'system-ui, sans-serif',
                      minWidth: '20px',
                      textAlign: 'center',
                    }}
                  >
                    {tab.count}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* ============================================ */}
          {/* Error State */}
          {/* ============================================ */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(220,53,69,0.08)',
                color: 'var(--error)',
                borderRadius: '12px',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                border: '1px solid rgba(220,53,69,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FaExclamationTriangle size={14} />
              {error}
            </div>
          )}

          {/* ============================================ */}
          {/* Requests List */}
          {/* ============================================ */}
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
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '20px',
                  border: '1px dashed var(--border-color)',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 1rem',
                    borderRadius: '50%',
                    background: 'rgba(245,166,35,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaBoxOpen size={36} color="#F5A623" opacity={0.6} />
                </div>
                <h3
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    margin: '0 0 8px',
                  }}
                >
                  {statusFilter === 'all'
                    ? 'لا توجد طلبات تمييز بعد'
                    : 'لا توجد طلبات في هذه الفئة'}
                </h3>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    margin: '0 0 1.25rem',
                    lineHeight: 1.6,
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
                      gap: '8px',
                      padding: '11px 22px',
                      borderRadius: '11px',
                      background: 'linear-gradient(135deg, #F5A623, #E87A20)',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      boxShadow: '0 4px 16px rgba(245,166,35,0.35)',
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
                      borderRadius: '10px',
                      border: '1.5px solid var(--primary-orange)',
                      backgroundColor: 'transparent',
                      color: 'var(--primary-orange)',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.85rem',
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
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                {filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.05, 0.4),
                    }}
                  >
                    <FeaturedRequestCard request={request} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </div>
    </>
  );
};

export default FeaturedRequestsHistoryPage;