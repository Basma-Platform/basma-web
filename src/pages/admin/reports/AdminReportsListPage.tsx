import { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaFlag, FaInbox, FaTimes } from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAdminReports } from '../../../hooks/useAdminReports';
import Pagination from '../../../components/shared/Pagination';
import {
  AdminReportsStatsCards,
  AdminReportsFilters,
  AdminReportCard,
  AdminReportsSkeleton,
} from '../../../components/admin/reports';
import type {
  AdminReportsStatusFilter,
  AdminReportsTargetFilter,
  AdminReportsPriorityFilter,
  AdminReportsSort,
} from '../../../components/admin/reports';
import {
  REPORT_PER_PAGE_OPTIONS,
  REPORT_DEFAULT_PER_PAGE,
} from '../../../utils/reportHelpers';

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
const AdminReportsListPage = () => {
  const { reports, meta, stats, loading, fetchReports, fetchStats } =
    useAdminReports();

  // Filter state
  const [status, setStatus] = useState<AdminReportsStatusFilter>(
    () => readUrlParam('status', 'all') as AdminReportsStatusFilter
  );
  const [targetType, setTargetType] = useState<AdminReportsTargetFilter>(
    () => readUrlParam('target_type', 'all') as AdminReportsTargetFilter
  );
  const [priority, setPriority] = useState<AdminReportsPriorityFilter>(
    () => readUrlParam('priority', 'all') as AdminReportsPriorityFilter
  );
  const [sort, setSort] = useState<AdminReportsSort>(
    () => readUrlParam('sort', 'newest') as AdminReportsSort
  );
  const [search, setSearch] = useState(() => readUrlParam('search', ''));
  const [page, setPage] = useState(() => readUrlNumber('page', 1));
  const [perPage, setPerPage] = useState(() =>
    readUrlNumber('per_page', REPORT_DEFAULT_PER_PAGE)
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

  // Sync URL
  useEffect(() => {
    writeUrlParams({
      status: status === 'all' ? null : status,
      target_type: targetType === 'all' ? null : targetType,
      priority: priority === 'all' ? null : priority,
      sort: sort === 'newest' ? null : sort,
      search: search || null,
      page: page > 1 ? page : null,
      per_page: perPage !== REPORT_DEFAULT_PER_PAGE ? perPage : null,
    });
  }, [status, targetType, priority, sort, search, page, perPage]);

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

  // Fetch reports
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!isMountedRef.current) return;
      try {
        setIsSearching(true);
        await fetchReports({
          status,
          target_type: targetType,
          priority,
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
  }, [status, targetType, priority, sort, search, page, perPage]);

  // Handlers
  const handleClearFilters = useCallback(() => {
    setStatus('all');
    setTargetType('all');
    setPriority('all');
    setSort('newest');
    setSearch('');
    setLocalSearch('');
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((v: AdminReportsStatusFilter) => {
    setStatus(v);
    setPage(1);
  }, []);

  const handleTargetTypeChange = useCallback(
    (v: AdminReportsTargetFilter) => {
      setTargetType(v);
      setPage(1);
    },
    []
  );

  const handlePriorityChange = useCallback(
    (v: AdminReportsPriorityFilter) => {
      setPriority(v);
      setPage(1);
    },
    []
  );

  const handleSortChange = useCallback((v: AdminReportsSort) => {
    setSort(v);
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

  const hasActiveFilters =
    status !== 'all' ||
    targetType !== 'all' ||
    priority !== 'all' ||
    sort !== 'newest' ||
    search.trim() !== '';

  // Initial loading
  if (initialLoading && !stats && reports.length === 0) {
    return (
      <>
        <SEO title="البلاغات" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '1rem',
            paddingBottom: '3rem',
          }}
        >
          <Container fluid="xl" className="px-3 px-md-4">
            <AdminReportsSkeleton variant="stats" />
            <div style={{ marginTop: '1.25rem' }}>
              <AdminReportsSkeleton variant="list" count={6} />
            </div>
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="البلاغات"
        description="إدارة ومراجعة البلاغات على منصة بصمة"
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
              <span style={{ opacity: 0.7 }}>البلاغات</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                }}
              >
                <FaFlag size={22} color="#FFFFFF" />
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
                  البلاغات
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  مراجعة ومعالجة بلاغات المستخدمين
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          {stats && (
            <div style={{ marginBottom: '1.25rem' }}>
              <AdminReportsStatsCards
                stats={stats}
                activeStatus={status}
                onStatusClick={handleStatusChange}
              />
            </div>
          )}

          {/* Filters */}
          <AdminReportsFilters
            search={localSearch}
            onSearchChange={setLocalSearch}
            status={status}
            onStatusChange={handleStatusChange}
            targetType={targetType}
            onTargetTypeChange={handleTargetTypeChange}
            priority={priority}
            onPriorityChange={handlePriorityChange}
            sort={sort}
            onSortChange={handleSortChange}
            isSearching={isSearching}
          />

          {/* ============================================ */}
          {/* Results Count + Clear — Below Filters */}
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
                  عرض {reports.length} من {meta.total} بلاغ
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
          {loading && reports.length === 0 ? (
            <AdminReportsSkeleton variant="list" count={6} />
          ) : reports.length === 0 ? (
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
                  background: 'rgba(232,122,32,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E87A20',
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
                {hasActiveFilters ? 'لا توجد نتائج مطابقة' : 'لا توجد بلاغات'}
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
                  : 'لم يقدم أي مستخدم بلاغاً بعد'}
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
            <>
              <div className="admin-reports-grid">
                {reports.map((report, idx) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(idx * 0.04, 0.4),
                    }}
                  >
                    <AdminReportCard report={report} />
                  </motion.div>
                ))}
              </div>

              <style>{`
                .admin-reports-grid {
                  display: grid;
                  gap: 16px;
                  grid-template-columns: minmax(0, 1fr);
                }
                @media (min-width: 576px) {
                  .admin-reports-grid {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                  }
                }
                @media (min-width: 992px) {
                  .admin-reports-grid {
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                  }
                }
              `}</style>
            </>
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
              perPageOptions={[...REPORT_PER_PAGE_OPTIONS]}
              isLoading={loading}
              itemLabel="بلاغ"
            />
          )}
        </Container>
      </div>
    </>
  );
};

export default AdminReportsListPage;