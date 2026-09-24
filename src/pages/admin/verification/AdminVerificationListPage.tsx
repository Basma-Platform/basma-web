import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaShieldAlt, FaInbox, FaTimes } from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAdminVerifications } from '../../../hooks/useAdminVerifications';
import { useUrlFilters } from '../../../hooks/useUrlFilters';
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

  // ============================================
  // URL-driven filters ✅
  // Reads from ?status=pending&search=...
  // ============================================
  const { filters, setFilter, clearFilters, hasActiveFilters } = useUrlFilters({
    status: 'all' as AdminVerificationFilter,
    search: '' as string,
    page: 1 as number,
    per_page: DEFAULT_PER_PAGE as number,
  });

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const isFirstFetch = useRef(true);

  // ============================================
  // Debounce search → URL
  // ============================================
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        setFilter('search', localSearch);
        setFilter('page', 1);
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  useEffect(() => {
    setLocalSearch(filters.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  // ============================================
  // Fetch on URL filter change ✅
  // ============================================
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsSearching(true);
        await fetchRequests({
          status: filters.status,
          search: filters.search || undefined,
          page: filters.page,
          per_page: filters.per_page,
        });
      } catch {
        // toast handled in hook
      } finally {
        if (!cancelled) {
          setIsSearching(false);
          if (isFirstFetch.current) {
            setInitialLoading(false);
            isFirstFetch.current = false;
          }
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.search, filters.page, filters.per_page]);

  // ============================================
  // Handlers
  // ============================================
  const handleClearFilters = () => {
    clearFilters();
    setLocalSearch('');
  };

  const handlePageChange = (page: number) => {
    setFilter('page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = (pp: number) => {
    setFilter('per_page', pp);
    setFilter('page', 1);
  };

  const handleStatusChange = (s: AdminVerificationFilter) => {
    setFilter('status', s);
    setFilter('page', 1);
  };

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
          {/* Breadcrumb + Title */}
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
                activeFilter={filters.status}
                onFilterClick={handleStatusChange}
              />
            </div>
          )}

          {/* Filters */}
          <AdminVerificationFilters
            search={localSearch}
            onSearchChange={setLocalSearch}
            status={filters.status}
            onStatusChange={handleStatusChange}
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

            {hasActiveFilters && (
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
                {hasActiveFilters ? 'لا توجد نتائج مطابقة' : 'لا توجد طلبات'}
              </h3>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  margin: 0,
                }}
              >
                {hasActiveFilters
                  ? 'حاول تغيير الفلاتر أو كلمات البحث'
                  : 'لم يقدّم أي مستخدم طلب توثيق بعد'}
              </p>
              {hasActiveFilters && (
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

          {/* Pagination */}
          {meta && requests.length > 0 && (
            <Pagination
              currentPage={filters.page}
              lastPage={meta.last_page}
              total={meta.total}
              perPage={filters.per_page}
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