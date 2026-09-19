import { useState, useEffect, useRef } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaStar, FaInbox } from 'react-icons/fa';
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

const AdminFeaturedRequestsPage = () => {
  const navigate = useNavigate();
  const { requests, meta, stats, loading, fetchRequests } =
    useAdminFeaturedRequests();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AdminFeaturedStatusFilter>('all');
  const [paymentMethod, setPaymentMethod] =
    useState<AdminFeaturedPaymentFilter>('all');
  const [sort, setSort] = useState<AdminFeaturedSort>('newest');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(FEATURED_DEFAULT_PER_PAGE);

  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // ✅ Skip the FIRST run of the filter effect (initial load handles it)
  const isFirstRender = useRef(true);

  // ============================================
  // Initial load
  // ============================================
  useEffect(() => {
    const init = async () => {
      try {
        await fetchRequests({
          status: 'all',
          sort: 'newest',
          page: 1,
          per_page: FEATURED_DEFAULT_PER_PAGE,
        });
      } finally {
        setInitialLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // Refetch on any filter change
  // ✅ Guarded only against the very first render
  // ✅ `sort` is now included and always honored
  // ============================================
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(
      () => {
        setIsSearching(true);
        fetchRequests({
          status,
          payment_method:
            paymentMethod === 'all' ? undefined : paymentMethod,
          search: search || undefined,
          sort, // ✅ always sent
          page,
          per_page: perPage,
        }).finally(() => setIsSearching(false));
      },
      search ? 450 : 0
    );

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, paymentMethod, sort, page, perPage]);

  // ============================================
  // Handlers
  // ============================================
  const handleClearFilters = () => {
    setSearch('');
    setStatus('all');
    setPaymentMethod('all');
    setSort('newest');
    setPage(1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = (pp: number) => {
    setPerPage(pp);
    setPage(1);
  };

  const handleCardClick = (request: AdminFeaturedRequestListItem) => {
    navigate(`/admin/featured-requests/${request.id}`);
  };

  const hasFilters =
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

  // ============================================
  // Render
  // ============================================
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
                onFilterClick={(f) => {
                  setStatus(f);
                  setPage(1);
                }}
              />
            </div>
          )}

          {/* Filters */}
          <AdminFeaturedFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={(s) => {
              setStatus(s);
              setPage(1);
            }}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={(p) => {
              setPaymentMethod(p);
              setPage(1);
            }}
            sort={sort}
            onSortChange={(s) => {
              setSort(s);
              setPage(1);
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
                  : 'لم يقدّم أي مستخدم طلب تمييز بعد'}
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

      {/* Page-scoped styles */}
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