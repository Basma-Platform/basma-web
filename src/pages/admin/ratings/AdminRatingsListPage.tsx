import { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaStar, FaInbox, FaTimes } from 'react-icons/fa';
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

// ============================================
// URL helpers
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

  // Filter state
  const [rating, setRating] = useState<AdminRatingValueFilter>(
    () => readUrlParam('rating', 'all') as AdminRatingValueFilter
  );
  const [sort, setSort] = useState<AdminRatingSort>(
    () => readUrlParam('sort', 'newest') as AdminRatingSort
  );
  const [search, setSearch] = useState(() => readUrlParam('search', ''));
  const [page, setPage] = useState(() => readUrlNumber('page', 1));
  const [perPage, setPerPage] = useState(() =>
    readUrlNumber('per_page', DEFAULT_PER_PAGE)
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

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    rating: Rating | null;
  }>({ open: false, rating: null });

  // Sync URL
  useEffect(() => {
    writeUrlParams({
      rating: rating === 'all' ? null : rating,
      sort: sort === 'newest' ? null : sort,
      search: search || null,
      page: page > 1 ? page : null,
      per_page: perPage !== DEFAULT_PER_PAGE ? perPage : null,
    });
  }, [rating, sort, search, page, perPage]);

  // Fetch stats (once)
  useEffect(() => {
    fetchStats().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search
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

  // Fetch ratings
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!isMountedRef.current) return;
      try {
        setIsSearching(true);
        await fetchRatings({
          search: search || undefined,
          rating:
            rating === 'all'
              ? undefined
              : (Number(rating) as 1 | 2 | 3 | 4 | 5),
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
  }, [rating, sort, search, page, perPage]);

  // Handlers
  const handleClearFilters = useCallback(() => {
    setRating('all');
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

  const handleRatingFilterChange = useCallback(
    (v: AdminRatingValueFilter) => {
      setRating(v);
      setPage(1);
    },
    []
  );

  const handleSortChange = useCallback((s: AdminRatingSort) => {
    setSort(s);
    setPage(1);
  }, []);

  const handleDeleteClick = useCallback((r: Rating) => {
    setDeleteModal({ open: true, rating: r });
  }, []);

  const handleDeleteConfirm = useCallback(
    async (reason?: string) => {
      if (!deleteModal.rating) return;
      try {
        await deleteRating(deleteModal.rating.id, reason);
        setDeleteModal({ open: false, rating: null });
      } catch {
        // toast handled in hook
      }
    },
    [deleteModal.rating, deleteRating]
  );

  const hasActiveFilters =
    rating !== 'all' || sort !== 'newest' || search.trim() !== '';

  // Initial loading
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
            search={localSearch}
            onSearchChange={setLocalSearch}
            ratingFilter={rating}
            onRatingFilterChange={handleRatingFilterChange}
            sort={sort}
            onSortChange={handleSortChange}
            isSearching={isSearching}
          />

          {/* Results Count + Clear — Below Filters */}
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
                  عرض {ratings.length} من {meta.total} تقييم
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
                {hasActiveFilters ? 'لا توجد نتائج مطابقة' : 'لا توجد تقييمات'}
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
                  : 'لم يقم أي مستخدم بتقييم آخر بعد'}
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
            <div className="admin-ratings-grid" key={sort}>
              {ratings.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ height: '100%', minWidth: 0 }}
                >
                  <AdminRatingCard rating={r} onDelete={handleDeleteClick} />
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