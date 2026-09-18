import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaShieldAlt,
  FaInbox,
  FaTimes,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAdminVerifications } from '../../../hooks/useAdminVerifications';
import {
  AdminVerificationStats,
  AdminVerificationFilters,
  AdminVerificationCard,
  AdminVerificationSkeleton,
} from '../../../components/admin/verification';
import type { AdminVerificationFilter } from '../../../components/admin/verification';
import Pagination from '../../../components/shared/Pagination';

const DEFAULT_PER_PAGE = 12;

const AdminVerificationListPage = () => {
  const { requests, meta, stats, loading, fetchRequests } =
    useAdminVerifications();

  const [statusFilter, setStatusFilter] =
    useState<AdminVerificationFilter>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // ============================================
  // Load requests
  // ============================================
  const loadRequests = useCallback(
    async (
      page: number = 1,
      filterOverride?: AdminVerificationFilter,
      searchOverride?: string,
      perPageOverride?: number
    ) => {
      const f = filterOverride ?? statusFilter;
      const s = searchOverride ?? search;
      const pp = perPageOverride ?? perPage;
      await fetchRequests({
        status: f,
        search: s || undefined,
        page,
        per_page: pp,
      });
    },
    [fetchRequests, statusFilter, search, perPage]
  );

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        await loadRequests(1);
      } finally {
        setInitialLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter change → reset page
  useEffect(() => {
    if (initialLoading) return;
    setCurrentPage(1);
    loadRequests(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    if (initialLoading) return;
    setIsSearching(true);
    const t = setTimeout(() => {
      setCurrentPage(1);
      loadRequests(1).finally(() => setIsSearching(false));
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ============================================
  // Pagination Handlers
  // ============================================
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await loadRequests(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = async (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    await loadRequests(1, undefined, undefined, newPerPage);
  };

  // ============================================
  // Clear Filters
  // ============================================
  const handleClearFilters = () => {
    setStatusFilter('all');
    setSearch('');
  };

  const hasFilters = statusFilter !== 'all' || search.trim() !== '';

  // ============================================
  // Initial Loading
  // ============================================
  if (initialLoading && !stats) {
    return (
      <>
        <SEO title="طلبات التحقق" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '1rem',
            paddingBottom: '3rem',
          }}
        >
          <Container fluid="xl" className="px-3 px-md-4">
            <AdminVerificationSkeleton variant="list" count={6} />
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="طلبات التحقق"
        description="إدارة طلبات توثيق الهوية على منصة بصمة"
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
          {/* Breadcrumb + Title */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '1.5rem' }}
          >
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
                to="/admin/dashboard"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                لوحة الإدارة
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ opacity: 0.7 }}>طلبات التحقق</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(23,162,184,0.3)',
                }}
              >
                <FaShieldAlt size={22} color="#FFFFFF" />
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
                  طلبات التحقق
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  إدارة ومراجعة طلبات توثيق الهوية
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          {stats && (
            <div style={{ marginBottom: '1.25rem' }}>
              <AdminVerificationStats
                stats={stats}
                activeFilter={statusFilter}
                onFilterClick={setStatusFilter}
              />
            </div>
          )}

          {/* Filters */}
          <AdminVerificationFilters
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            counts={{
              all: stats?.total || 0,
              pending: stats?.pending || 0,
              approved: stats?.approved || 0,
              rejected: stats?.rejected || 0,
            }}
            isSearching={isSearching}
          />

          {/* Results Count + Clear */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '1rem',
              padding: '0 4px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              {!loading && meta && (
                <>
                  عرض {requests.length} من {meta.total} طلب
                </>
              )}
            </span>

            {hasFilters && (
              <Button
                variant="link"
                onClick={handleClearFilters}
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FaTimes size={11} />
                مسح الفلاتر
              </Button>
            )}
          </div>

          {/* Grid */}
          {loading && requests.length === 0 ? (
            <AdminVerificationSkeleton variant="list" count={6} />
          ) : requests.length === 0 ? (
            <motion.div
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
                  background: 'rgba(23,162,184,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#17A2B8',
                }}
              >
                <FaInbox size={36} opacity={0.6} />
              </div>
              <h3
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  margin: '0 0 8px',
                }}
              >
                {hasFilters ? 'لا توجد نتائج مطابقة' : 'لا توجد طلبات'}
              </h3>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  margin: 0,
                }}
              >
                {hasFilters
                  ? 'حاول تغيير الفلاتر أو كلمات البحث'
                  : 'لم يقدّم أي مستخدم طلب توثيق بعد'}
              </p>
              {hasFilters && (
                <Button
                  onClick={handleClearFilters}
                  style={{
                    marginTop: '1.25rem',
                    backgroundColor: 'var(--primary-orange)',
                    borderColor: 'var(--primary-orange)',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '10px 22px',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  مسح الفلاتر
                </Button>
              )}
            </motion.div>
          ) : (
            <Row className="g-3">
              {requests.map((request, index) => (
                <Col key={request.id} xs={12} sm={6} lg={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.05, 0.4),
                    }}
                    style={{ height: '100%' }}
                  >
                    <AdminVerificationCard request={request} />
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}

          {/* ============================================ */}
          {/* Full-featured Pagination */}
          {/* ============================================ */}
          {meta && requests.length > 0 && (
            <Pagination
              currentPage={currentPage}
              lastPage={meta.last_page}
              total={meta.total}
              perPage={perPage}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              perPageOptions={[6, 12, 24, 48]}
              isLoading={loading}
            />
          )}
        </Container>
      </div>
    </>
  );
};

export default AdminVerificationListPage;