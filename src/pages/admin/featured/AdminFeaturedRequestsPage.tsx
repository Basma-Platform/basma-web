import { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaStar, FaInbox, FaTimes } from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAdminFeaturedRequests } from '../../../hooks/useAdminFeaturedRequests';
import Pagination from '../../../components/shared/Pagination';
import {
  AdminFeaturedStatsCards,
  AdminFeaturedFilters,
  AdminFeaturedRequestCard,
  AdminFeaturedSkeleton,
} from '../../../components/admin/featured';
import type {
  AdminFeaturedStatusFilter,
  AdminFeaturedSort,
  AdminFeaturedPaymentFilter,
} from '../../../components/admin/featured';
import {
  FEATURED_PER_PAGE_OPTIONS,
  FEATURED_DEFAULT_PER_PAGE,
} from '../../../utils/featuredHelpers';
import type { AdminFeaturedRequestListItem } from '../../../types';

// ============================================
// URL helpers — pure functions, no hooks
// ============================================
const readUrlParam = (key: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  const params = new URLSearchParams(window.location.search);
  return params.get(key) ?? fallback;
};

const readUrlNumber = (key: string, fallback: number): number => {
  if (typeof window === 'undefined') return fallback;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get(key);
  if (raw === null) return fallback;
  const num = Number(raw);
  return isNaN(num) ? fallback : num;
};

const writeUrlParams = (params: Record<string, string | number | null>) => {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === '' || value === 'all') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
  }
  window.history.replaceState({}, '', url.toString());
};

// ============================================
// Page
// ============================================
const AdminFeaturedRequestsPage = () => {
  const navigate = useNavigate();
  const { requests, meta, stats, loading, fetchRequests } =
    useAdminFeaturedRequests();

  // ============================================
  // Filter state — initialized from URL on first render
  // ============================================
  const [status, setStatus] = useState<AdminFeaturedStatusFilter>(
    () => readUrlParam('status', 'all') as AdminFeaturedStatusFilter
  );
  const [paymentMethod, setPaymentMethod] =
    useState<AdminFeaturedPaymentFilter>(
      () => readUrlParam('payment_method', 'all') as AdminFeaturedPaymentFilter
    );
  const [sort, setSort] = useState<AdminFeaturedSort>(
    () => readUrlParam('sort', 'newest') as AdminFeaturedSort
  );
  const [search, setSearch] = useState(
    () => readUrlParam('search', '')
  );
  const [page, setPage] = useState(
    () => readUrlNumber('page', 1)
  );
  const [perPage, setPerPage] = useState(
    () => readUrlNumber('per_page', FEATURED_DEFAULT_PER_PAGE)
  );

  const [localSearch, setLocalSearch] = useState(search);
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const isFirstFetch = useRef(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ============================================
  // Sync URL whenever filters change
  // ============================================
  useEffect(() => {
    writeUrlParams({
      status: status === 'all' ? null : status,
      payment_method: paymentMethod === 'all' ? null : paymentMethod,
      sort: sort === 'newest' ? null : sort,
      search: search || null,
      page: page > 1 ? page : null,
      per_page: perPage !== FEATURED_DEFAULT_PER_PAGE ? perPage : null,
    });
  }, [status, paymentMethod, sort, search, page, perPage]);

  // ============================================
  // Debounce search
  // ============================================
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
        setPage(1);
      }
    }, 450);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  // ============================================
  // Fetch on filter change
  // ============================================
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!isMountedRef.current) return;
      try {
        setIsSearching(true);
        await fetchRequests({
          status,
          payment_method:
            paymentMethod === 'all' ? undefined : paymentMethod,
          search: search || undefined,
          sort,
          page,
          per_page: perPage,
        });
      } catch {
        // toast handled in hook
      } finally {
        if (!cancelled && isMountedRef.current) {
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
  }, [status, paymentMethod, search, sort, page, perPage]);

  // ============================================
  // Handlers
  // ============================================
  const handleClearFilters = useCallback(() => {
    setStatus('all');
    setPaymentMethod('all');
    setSort('newest');
    setSearch('');
    setLocalSearch('');
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePerPageChange = useCallback((pp: number) => {
    setPerPage(pp);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((s: AdminFeaturedStatusFilter) => {
    setStatus(s);
    setPage(1);
  }, []);

  const handlePaymentChange = useCallback(
    (p: AdminFeaturedPaymentFilter) => {
      setPaymentMethod(p);
      setPage(1);
    },
    []
  );

  const handleSortChange = useCallback((s: AdminFeaturedSort) => {
    setSort(s);
    setPage(1);
  }, []);

  const handleCardClick = useCallback(
    (request: AdminFeaturedRequestListItem) => {
      navigate(`/admin/featured-requests/${request.id}`);
    },
    [navigate]
  );

  const hasActiveFilters =
    status !== 'all' ||
    paymentMethod !== 'all' ||
    sort !== 'newest' ||
    search.trim() !== '';

  // ============================================
  // Initial loading skeleton
  // ============================================
  if (initialLoading && !stats) {
    return (
      <>
        <SEO title="طلبات التمييز" />
        <div className="admin-featured-page" dir="rtl">
          <Container fluid="xl" className="px-2 px-md-4 py-3">
            <AdminFeaturedSkeleton variant="stats" />
            <div style={{ marginTop: '1.25rem' }}>
              <AdminFeaturedSkeleton variant="list" count={6} />
            </div>
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="طلبات التمييز"
        description="إدارة طلبات تمييز الإعلانات على منصة بصمة"
      />

      <div className="admin-featured-page" dir="rtl">
        <Container
          fluid="xl"
          className="px-2 px-md-4 py-3"
          style={{ maxWidth: '100%', boxSizing: 'border-box' }}
        >
          {/* Breadcrumb + Title */}
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
                to="/admin/dashboard"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                لوحة الإدارة
              </Link>
              <FaChevronLeft size={9} style={{ opacity: 0.4 }} />
              <span style={{ opacity: 0.7 }}>طلبات التمييز</span>
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
                  boxShadow: '0 4px 16px rgba(255,193,7,0.35)',
                  flexShrink: 0,
                }}
              >
                <FaStar size={19} color="#FFFFFF" />
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
                  إدارة ومراجعة جميع طلبات تمييز الإعلانات
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          {stats && (
            <div style={{ marginBottom: '1.25rem' }}>
              <AdminFeaturedStatsCards
                stats={stats}
                activeFilter={status}
                onFilterClick={handleStatusChange}
              />
            </div>
          )}

          {/* Filters */}
          <AdminFeaturedFilters
            search={localSearch}
            onSearchChange={setLocalSearch}
            status={status}
            onStatusChange={handleStatusChange}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={handlePaymentChange}
            sort={sort}
            onSortChange={handleSortChange}
            isSearching={isSearching}
          />

          {/* ============================================ */}
          {/* Results Count + Clear Filters — Below Filters */}
          {/* Same layout as AdminVerificationListPage */}
          {/* ============================================ */}
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
            <AdminFeaturedSkeleton variant="list" count={6} />
          ) : requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: 'clamp(2.25rem, 8vw, 3rem) 1.5rem',
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
                  background: 'rgba(255,193,7,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFC107',
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
                  : 'لم يقدّم أي مستخدم طلب تمييز بعد'}
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
            <div className="admin-featured-grid">
              {requests.map((request, idx) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(idx * 0.04, 0.4),
                  }}
                  style={{ minWidth: 0 }}
                >
                  <AdminFeaturedRequestCard
                    request={request}
                    onClick={handleCardClick}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <Pagination
              currentPage={page}
              lastPage={meta.last_page}
              total={meta.total}
              perPage={perPage}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              perPageOptions={[...FEATURED_PER_PAGE_OPTIONS]}
              isLoading={loading}
              itemLabel="طلب"
            />
          )}
        </Container>
      </div>

      <style>{`
        .admin-featured-page {
          background-color: var(--bg-body);
          min-height: 100vh;
          padding-top: 1rem;
          padding-bottom: 3rem;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .admin-featured-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (min-width: 1600px) {
          .admin-featured-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 380px));
          }
        }

        @media (max-width: 380px) {
          .admin-featured-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default AdminFeaturedRequestsPage;