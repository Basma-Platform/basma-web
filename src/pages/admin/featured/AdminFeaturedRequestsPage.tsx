import { useState, useEffect, useRef } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaStar, FaInbox } from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAdminFeaturedRequests } from '../../../hooks/useAdminFeaturedRequests';
import { useUrlFilters } from '../../../hooks/useUrlFilters';
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

const AdminFeaturedRequestsPage = () => {
  const navigate = useNavigate();
  const { requests, meta, stats, loading, fetchRequests } =
    useAdminFeaturedRequests();

  // ============================================
  // URL-driven filters ✅
  // Reads from ?status=pending&sort=newest&...
  // ============================================
  const { filters, setFilter, clearFilters, hasActiveFilters } = useUrlFilters({
    status: 'all' as AdminFeaturedStatusFilter,
    payment_method: 'all' as AdminFeaturedPaymentFilter,
    sort: 'newest' as AdminFeaturedSort,
    search: '' as string,
    page: 1 as number,
    per_page: FEATURED_DEFAULT_PER_PAGE as number,
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
    }, 450);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  // Sync local when URL changes externally
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
          payment_method:
            filters.payment_method === 'all'
              ? undefined
              : filters.payment_method,
          search: filters.search || undefined,
          sort: filters.sort,
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
  }, [
    filters.status,
    filters.payment_method,
    filters.search,
    filters.sort,
    filters.page,
    filters.per_page,
  ]);

  // ============================================
  // Handlers — all update URL ✅
  // ============================================
  const handleClearFilters = () => {
    clearFilters();
    setLocalSearch('');
  };

  const handlePageChange = (p: number) => {
    setFilter('page', p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = (pp: number) => {
    setFilter('per_page', pp);
    setFilter('page', 1);
  };

  const handleCardClick = (request: AdminFeaturedRequestListItem) => {
    navigate(`/admin/featured-requests/${request.id}`);
  };

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
                activeFilter={filters.status}
                onFilterClick={(f) => {
                  setFilter('status', f);
                  setFilter('page', 1);
                }}
              />
            </div>
          )}

          {/* Filters */}
          <AdminFeaturedFilters
            search={localSearch}
            onSearchChange={setLocalSearch}
            status={filters.status}
            onStatusChange={(s) => {
              setFilter('status', s);
              setFilter('page', 1);
            }}
            paymentMethod={filters.payment_method}
            onPaymentMethodChange={(p) => {
              setFilter('payment_method', p);
              setFilter('page', 1);
            }}
            sort={filters.sort}
            onSortChange={(s) => {
              setFilter('sort', s);
              setFilter('page', 1);
            }}
            onClear={handleClearFilters}
            isSearching={isSearching}
            resultsCount={meta?.total}
          />

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
              currentPage={filters.page}
              lastPage={meta.last_page}
              total={meta.total}
              perPage={filters.per_page}
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