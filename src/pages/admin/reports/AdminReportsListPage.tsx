import { useState, useEffect, useCallback } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaFlag, FaInbox } from 'react-icons/fa';
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

const AdminReportsListPage = () => {
  const {
    reports,
    meta,
    stats,
    loading,
    fetchReports,
    fetchStats,
  } = useAdminReports();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<AdminReportsStatusFilter>('all');
  const [targetTypeFilter, setTargetTypeFilter] =
    useState<AdminReportsTargetFilter>('all');
  const [priorityFilter, setPriorityFilter] =
    useState<AdminReportsPriorityFilter>('all');
  const [sort, setSort] = useState<AdminReportsSort>('newest');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(REPORT_DEFAULT_PER_PAGE);

  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // ============================================
  // Fetch stats once on mount
  // ============================================
  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        await fetchStats();
      } catch {
        // toast handled in hook
      }
    };

    if (!cancelled) loadStats();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // Fetch reports on filter / page change
  // ============================================
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsSearching(true);
        await fetchReports({
          status: statusFilter,
          target_type: targetTypeFilter,
          priority: priorityFilter,
          search: search || undefined,
          sort,
          page,
          per_page: perPage,
        });
      } catch {
        // toast handled in hook
      } finally {
        if (!cancelled) {
          setIsSearching(false);
          setInitialLoading(false);
        }
      }
    };

    const timer = setTimeout(load, search ? 450 : 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    statusFilter,
    targetTypeFilter,
    priorityFilter,
    search,
    sort,
    page,
    perPage,
  ]);

  // ============================================
  // Handlers
  // ============================================
  const handleClearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('all');
    setTargetTypeFilter('all');
    setPriorityFilter('all');
    setSort('newest');
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((v: AdminReportsStatusFilter) => {
    setStatusFilter(v);
    setPage(1);
  }, []);

  const handleTargetTypeChange = useCallback(
    (v: AdminReportsTargetFilter) => {
      setTargetTypeFilter(v);
      setPage(1);
    },
    []
  );

  const handlePriorityChange = useCallback(
    (v: AdminReportsPriorityFilter) => {
      setPriorityFilter(v);
      setPage(1);
    },
    []
  );

  const handleSortChange = useCallback((v: AdminReportsSort) => {
    setSort(v);
    setPage(1);
  }, []);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = (pp: number) => {
    setPerPage(pp);
    setPage(1);
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
          {/* ============================================
              Breadcrumb + Title
              ============================================ */}
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

          {/* ============================================
              Stats Cards
              ============================================ */}
          {stats && (
            <div style={{ marginBottom: '1.25rem' }}>
              <AdminReportsStatsCards
                stats={stats}
                activeStatus={statusFilter}
                onStatusClick={handleStatusChange}
              />
            </div>
          )}

          {/* ============================================
              Filters
              ============================================ */}
          <AdminReportsFilters
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={handleStatusChange}
            targetType={targetTypeFilter}
            onTargetTypeChange={handleTargetTypeChange}
            priority={priorityFilter}
            onPriorityChange={handlePriorityChange}
            sort={sort}
            onSortChange={handleSortChange}
            onClear={handleClearFilters}
            isSearching={isSearching}
            resultsCount={meta?.total}
          />

          {/* ============================================
              Grid
              ============================================ */}
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
                {search ||
                statusFilter !== 'all' ||
                targetTypeFilter !== 'all' ||
                priorityFilter !== 'all'
                  ? 'لا توجد نتائج مطابقة'
                  : 'لا توجد بلاغات'}
              </h3>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  margin: 0,
                }}
              >
                {search ||
                statusFilter !== 'all' ||
                targetTypeFilter !== 'all' ||
                priorityFilter !== 'all'
                  ? 'حاول تغيير الفلاتر أو كلمات البحث'
                  : 'لم يقدم أي مستخدم بلاغاً بعد'}
              </p>
              {(search ||
                statusFilter !== 'all' ||
                targetTypeFilter !== 'all' ||
                priorityFilter !== 'all') && (
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

              {/* Responsive 3-column grid */}
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

          {/* ============================================
              Pagination
              ============================================ */}
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