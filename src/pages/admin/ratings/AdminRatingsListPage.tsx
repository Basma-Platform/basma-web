import { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaStar, FaInbox } from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAdminRatings } from '../../../hooks/useAdminRatings';
import Pagination from '../../../components/shared/Pagination';
import {
  AdminRatingStatsCards,
  AdminRatingsFilters,
  AdminRatingCard,
  AdminDeleteRatingModal,
  AdminRatingsSkeleton,
} from '../../../components/admin/ratings';
import type {
  AdminRatingSort,
  AdminRatingValueFilter,
} from '../../../components/admin/ratings';
import type { Rating } from '../../../types';

const PER_PAGE_OPTIONS = [12, 24, 48, 96];
const DEFAULT_PER_PAGE = 12;

const AdminRatingsListPage = () => {
  const {
    ratings,
    meta,
    stats,
    loading,
    actionLoading,
    fetchRatings,
    fetchStats,
    deleteRating,
  } = useAdminRatings();

  // Filters
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] =
    useState<AdminRatingValueFilter>('all');
  const [sort, setSort] = useState<AdminRatingSort>('newest');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    rating: Rating | null;
  }>({ open: false, rating: null });

  // ============================================
  // Initial: stats + first page
  // ============================================
  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          fetchStats(),
          fetchRatings({ page: 1, per_page: DEFAULT_PER_PAGE, sort: 'newest' }),
        ]);
      } finally {
        setInitialLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // Refetch on filter / page / perPage changes
  // ============================================
  useEffect(() => {
    if (initialLoading) return;
    setIsSearching(true);
    const timer = setTimeout(
      () => {
        fetchRatings({
          search: search || undefined,
          rating:
            ratingFilter === 'all'
              ? undefined
              : (ratingFilter as 1 | 2 | 3 | 4 | 5),
          sort,
          page,
          per_page: perPage,
        }).finally(() => setIsSearching(false));
      },
      search ? 450 : 0
    );

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, ratingFilter, sort, page, perPage]);

  // ============================================
  // Handlers
  // ============================================
  const handleClearFilters = () => {
    setSearch('');
    setRatingFilter('all');
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

  const handleDeleteClick = (rating: Rating) => {
    setDeleteModal({ open: true, rating });
  };

  const handleDeleteConfirm = async (reason?: string) => {
    if (!deleteModal.rating) return;
    try {
      await deleteRating(deleteModal.rating.id, reason);
      setDeleteModal({ open: false, rating: null });
    } catch {
      // toast handled in hook
    }
  };

  // ============================================
  // Initial loading
  // ============================================
  if (initialLoading && !stats) {
    return (
      <>
        <SEO title="التقييمات" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '1rem',
            paddingBottom: '3rem',
          }}
        >
          <Container fluid="xl" className="px-3 px-md-4">
            <AdminRatingsSkeleton count={6} />
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
        title="التقييمات"
        description="إدارة ومراجعة التقييمات على منصة بصمة"
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
              <span style={{ opacity: 0.7 }}>التقييمات</span>
            </div>

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
                  التقييمات
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  مراجعة وإدارة جميع التقييمات
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          {stats && (
            <div style={{ marginBottom: '1.25rem' }}>
              <AdminRatingStatsCards stats={stats} />
            </div>
          )}

          {/* Filters */}
          <AdminRatingsFilters
            search={search}
            onSearchChange={setSearch}
            ratingFilter={ratingFilter}
            onRatingFilterChange={(v) => {
              setRatingFilter(v);
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
          {loading && ratings.length === 0 ? (
            <AdminRatingsSkeleton count={6} />
          ) : ratings.length === 0 ? (
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
                {search || ratingFilter !== 'all'
                  ? 'لا توجد نتائج مطابقة'
                  : 'لا توجد تقييمات'}
              </h3>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  margin: 0,
                }}
              >
                {search || ratingFilter !== 'all'
                  ? 'حاول تغيير الفلاتر أو كلمات البحث'
                  : 'لم يقم أي مستخدم بتقييم آخر بعد'}
              </p>
              {(search || ratingFilter !== 'all') && (
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
            // FIX: key={sort} here already forces React to unmount and
            // rebuild this whole grid from scratch whenever sort changes —
            // that alone guarantees correct order with zero animation
            // needed. The `layout` prop below used to be added on top of
            // that, telling Framer Motion to FLIP-animate elements between
            // their old and new position. The two don't cooperate well:
            // `layout` expects elements to persist across a render and
            // measures their rect before/after, but CSS Grid reflows (row
            // count changing, columns shifting) are a known rough edge for
            // that measurement, and combined with the forced remount it
            // produced a stale transform on whichever cards landed in an
            // early grid cell — exactly the "first row frozen" symptom.
            // Removed `layout`; the key-based remount plus the existing
            // initial/animate fade+scale already gives a clean, correct
            // reorder.
            <div className="admin-ratings-grid" key={sort}>
              {ratings.map((rating) => (
                <motion.div
                  key={rating.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ height: '100%', minWidth: 0 }}
                >
                  <AdminRatingCard
                    rating={rating}
                    onDelete={handleDeleteClick}
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
              perPageOptions={PER_PAGE_OPTIONS}
              isLoading={loading}
              itemLabel="تقييم"
            />
          )}
        </Container>
      </div>

      {/* Delete Modal */}
      <AdminDeleteRatingModal
        isOpen={deleteModal.open}
        rating={deleteModal.rating}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, rating: null })}
        isLoading={actionLoading}
      />
    </>
  );
};

export default AdminRatingsListPage;