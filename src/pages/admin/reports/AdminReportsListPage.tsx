import { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaFlag, FaInbox } from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAdminReports } from '../../../hooks/useAdminReports';
import { useUrlFilters } from '../../../hooks/useUrlFilters';
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

const AdminReportsListPage = () => {
  const {
    reports,
    meta,
    stats,
    loading,
    fetchReports,
    fetchStats,
  } = useAdminReports();

  // ============================================
  // URL-driven filters ✅
  // Reads from ?status=pending&priority=high&...
  // ============================================
  const { filters, setFilter, clearFilters, hasActiveFilters } = useUrlFilters({
    status: 'all' as AdminReportsStatusFilter,
    target_type: 'all' as AdminReportsTargetFilter,
    priority: 'all' as AdminReportsPriorityFilter,
    sort: 'newest' as AdminReportsSort,
    search: '' as string,
    page: 1 as number,
    per_page: REPORT_DEFAULT_PER_PAGE as number,
  });

  // Local search state (debounced)
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const isFirstFetch = useRef(true);

  // ============================================
  // Fetch stats once on mount
  // ============================================
  useEffect(() => {
    fetchStats().catch(() => {
      // toast handled in hook
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // Debounce search → push to URL
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

  // Sync local search when URL changes externally
  useEffect(() => {
    setLocalSearch(filters.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  // ============================================
  // Fetch reports whenever URL filters change ✅
  // ============================================
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsSearching(true);
        await fetchReports({
          status: filters.status,
          target_type: filters.target_type,
          priority: filters.priority,
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
    filters.target_type,
    filters.priority,
    filters.search,
    filters.sort,
    filters.page,
    filters.per_page,
  ]);

  // ============================================
  // Handlers — all update URL ✅
  // ============================================
  const handleClearFilters = useCallback(() => {
    clearFilters();
    setLocalSearch('');
  }, [clearFilters]);

  const handleStatusChange = useCallback(
    (v: AdminReportsStatusFilter) => {
      setFilter('status', v);
      setFilter('page', 1);
    },
    [setFilter]
  );

  const handleTargetTypeChange = useCallback(
    (v: AdminReportsTargetFilter) => {
      setFilter('target_type', v);
      setFilter('page', 1);
    },
    [setFilter]
  );

  const handlePriorityChange = useCallback(
    (v: AdminReportsPriorityFilter) => {
      setFilter('priority', v);
      setFilter('page', 1);
    },
    [setFilter]
  );

  const handleSortChange = useCallback(
    (v: AdminReportsSort) => {
      setFilter('sort', v);
      setFilter('page', 1);
    },
    [setFilter]
  );

  const handlePageChange = (p: number) => {
    setFilter('page', p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = (pp: number) => {
    setFilter('per_page', pp);
    setFilter('page', 1);
  };

  // ============================================
  // Initial loading
  // ============================================
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

  // ============================================
  // Render
  // ============================================
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

          {/* Stats Cards */}
          {stats && (
            <div style={{ marginBottom: '1.25rem' }}>
              <AdminReportsStatsCards
                stats={stats}
                activeStatus={filters.status}
                onStatusClick={handleStatusChange}
              />
            </div>
          )}

          {/* Filters */}
          <AdminReportsFilters
            search={localSearch}
            onSearchChange={setLocalSearch}
            status={filters.status}
            onStatusChange={handleStatusChange}
            targetType={filters.target_type}
            onTargetTypeChange={handleTargetTypeChange}
            priority={filters.priority}
            onPriorityChange={handlePriorityChange}
            sort={filters.sort}
            onSortChange={handleSortChange}
            onClear={handleClearFilters}
            isSearching={isSearching}
            resultsCount={meta?.total}
          />

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
              currentPage={filters.page}
              lastPage={meta.last_page}
              total={meta.total}
              perPage={filters.per_page}
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