import { useEffect, useState, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronRight,
  FaHandHoldingHeart,
  FaPlusCircle,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import Pagination from '../../../components/shared/Pagination';

import { MyHelpRequestFilters } from '../../../components/user/basma-fund/help-requests';
import type {
  MyHelpRequestStatusFilter,
  MyHelpRequestSort,
} from '../../../components/user/basma-fund/help-requests';
import { MyHelpRequestCard } from '../../../components/user/basma-fund/cards';
import { DeleteHelpRequestModal } from '../../../components/user/basma-fund/modals';
import { MyHelpRequestsSkeleton } from '../../../components/user/basma-fund/skeletons';
import {
  HelpRequestStatsCards,
  HelpRequestLimitsIndicator,
} from '../../../components/user/basma-fund/stats';

import { useMyHelpRequests } from '../../../hooks/useHelpRequests';
import { useHelpRequestForm } from '../../../hooks/useHelpRequestForm';
import { FUND_THEME } from '../../../utils/helpRequestHelpers';
import type { HelpRequestUser } from '../../../types';

const PER_PAGE = 9;

const MyHelpRequestsPage = () => {
  // ============================================
  // Data
  // ============================================
  const { requests, meta, limits, loading, fetchMyList } = useMyHelpRequests();
  const { loading: deleting, deleteRequest } = useHelpRequestForm();

  // ============================================
  // Filters
  // ============================================
  const [status, setStatus] = useState<MyHelpRequestStatusFilter>('all');
  const [sort, setSort] = useState<MyHelpRequestSort>('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_PAGE);
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // ============================================
  // Delete modal
  // ============================================
  const [deleteTarget, setDeleteTarget] = useState<HelpRequestUser | null>(null);

  // ============================================
  // Fetch on filter change
  // ============================================
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (search.trim() !== '') {
        setIsSearching(true);
      }

      try {
        await fetchMyList({
          status,
          sort,
          search: search.trim() || undefined,
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

    load();

    return () => {
      cancelled = true;
    };
  }, [status, sort, search, page, perPage, fetchMyList]);

  // ============================================
  // Handlers
  // ============================================
  const handleStatusChange = useCallback((next: MyHelpRequestStatusFilter) => {
    setStatus(next);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((next: MyHelpRequestSort) => {
    setSort(next);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setStatus('all');
    setSort('newest');
    setSearch('');
    setPage(1);
  }, []);

  const handlePageChange = useCallback((next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePerPageChange = useCallback((next: number) => {
    setPerPage(next);
    setPage(1);
  }, []);

  const handleDeleteClick = useCallback((request: HelpRequestUser) => {
    setDeleteTarget(request);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteRequest(deleteTarget.id);
      setDeleteTarget(null);
      await fetchMyList({
        status,
        sort,
        search: search.trim() || undefined,
        page,
        per_page: perPage,
      });
    } catch {
      // toast handled in hook
    }
  }, [
    deleteTarget,
    deleteRequest,
    fetchMyList,
    status,
    sort,
    search,
    page,
    perPage,
  ]);

  // ============================================
  // Empty states
  // ============================================
  const isEmpty = !loading && requests.length === 0 && status === 'all';
  const isFilteredEmpty =
    !loading && requests.length === 0 && status !== 'all';
  const canSubmit = limits?.can_submit ?? true;

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO
        title="طلبات المساعدة | صندوق بصمة"
        description="إدارة طلبات المساعدة الخاصة بك على منصة بصمة"
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '2rem',
          paddingBottom: '3rem',
        }}
        dir="rtl"
      >
        <Container className="px-3 px-md-4" style={{ maxWidth: '1100px' }}>
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
              fontFamily: 'Cairo, sans-serif',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/user/dashboard"
              style={{
                color: FUND_THEME.accent,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              لوحة التحكم
            </Link>
            <FaChevronRight
              size={9}
              style={{ opacity: 0.4, transform: 'rotate(180deg)' }}
            />
            <Link
              to="/basma-fund"
              style={{
                color: FUND_THEME.accent,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              صندوق بصمة
            </Link>
            <FaChevronRight
              size={9}
              style={{ opacity: 0.4, transform: 'rotate(180deg)' }}
            />
            <span style={{ opacity: 0.75 }}>طلباتي</span>
          </motion.nav>

          {/* ============================================ */}
          {/* Header with CTA */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="my-hr-header"
          >
            <div className="my-hr-header__left">
              <div className="my-hr-header__icon">
                <FaHandHoldingHeart size={22} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h1 className="my-hr-header__title">طلبات المساعدة</h1>
                <p className="my-hr-header__subtitle">
                  إدارة طلباتك ومراقبة حالتها
                </p>
              </div>
            </div>

            <Link
              to="/user/basma-fund/help-requests/create"
              className={`my-hr-header__cta ${
                !canSubmit ? 'is-disabled' : ''
              }`}
              aria-disabled={!canSubmit}
              onClick={(e) => {
                if (!canSubmit) e.preventDefault();
              }}
            >
              <FaPlusCircle size={14} />
              طلب جديد
            </Link>
          </motion.div>

          {/* ============================================ */}
          {/* Initial loading */}
          {/* ============================================ */}
          {initialLoading && requests.length === 0 ? (
            <>
              <div
                className="my-hr-page-skel"
                style={{
                  height: '96px',
                  borderRadius: '14px',
                  marginBottom: '1rem',
                }}
              />
              <div
                className="my-hr-page-skel"
                style={{
                  height: '140px',
                  borderRadius: '16px',
                  marginBottom: '1rem',
                }}
              />
              <MyHelpRequestsSkeleton count={6} />
              <style>{`
                .my-hr-page-skel {
                  background-color: var(--border-color);
                  animation: myHrPagePulse 1.5s ease-in-out infinite;
                }
                @keyframes myHrPagePulse {
                  0%, 100% { opacity: 0.4; }
                  50% { opacity: 0.85; }
                }
              `}</style>
            </>
          ) : (
            <>
              <HelpRequestStatsCards
                limits={limits}
                activeFilter={status}
                onFilterClick={handleStatusChange}
                loading={initialLoading && !limits}
              />

              {limits && (
                <div style={{ marginBottom: '1rem' }}>
                  <HelpRequestLimitsIndicator limits={limits} />
                </div>
              )}

              <MyHelpRequestFilters
                search={search}
                onSearchChange={handleSearchChange}
                status={status}
                onStatusChange={handleStatusChange}
                sort={sort}
                onSortChange={handleSortChange}
                onClear={handleClearFilters}
                isSearching={isSearching}
                resultsCount={requests.length}
              />

              {loading && requests.length === 0 ? (
                <MyHelpRequestsSkeleton count={6} />
              ) : isEmpty ? (
                <EmptyState
                  title="لا توجد طلبات مساعدة بعد"
                  description="ابدأ بتقديم طلبك الأول وسيظهر هنا مباشرة بعد النشر."
                  showCreate
                />
              ) : isFilteredEmpty ? (
                <EmptyState
                  title="لا توجد نتائج مطابقة"
                  description="جرّب تصفية أخرى أو اعرض الكل."
                  actionLabel="عرض الكل"
                  onAction={() => handleStatusChange('all')}
                />
              ) : (
                <div className="my-hr-grid">
                  {requests.map((request, idx) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(idx * 0.04, 0.35),
                      }}
                      style={{ minWidth: 0 }}
                    >
                      <MyHelpRequestCard
                        request={request}
                        onDelete={handleDeleteClick}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {meta && meta.last_page > 1 && (
                <Pagination
                  currentPage={page}
                  lastPage={meta.last_page}
                  total={meta.total}
                  perPage={perPage}
                  onPageChange={handlePageChange}
                  onPerPageChange={handlePerPageChange}
                  perPageOptions={[9, 18, 27, 45]}
                  isLoading={loading}
                  itemLabel="طلب"
                />
              )}
            </>
          )}
        </Container>
      </div>

      {/* ============================================ */}
      {/* Delete modal */}
      {/* ============================================ */}
      <DeleteHelpRequestModal
        isOpen={!!deleteTarget}
        requestTitle={deleteTarget?.public_title}
        deleteDeadline={deleteTarget?.delete_deadline ?? null}
        secondsRemaining={deleteTarget?.delete_seconds_remaining ?? null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />

      {/* ============================================ */}
      {/* Scoped styles */}
      {/* ============================================ */}
      <style>{`
        .my-hr-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .my-hr-header__left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          flex: 1 1 auto;
        }

        .my-hr-header__icon {
          width: 52px;
          height: 52px;
          border-radius: 15px;
          background: ${FUND_THEME.gradient};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 8px 22px ${FUND_THEME.shadow};
          flex-shrink: 0;
        }

        .my-hr-header__title {
          color: var(--text-secondary);
          font-size: clamp(1.3rem, 4vw, 1.7rem);
          font-weight: 900;
          font-family: 'Cairo', sans-serif;
          margin: 0;
          line-height: 1.2;
        }

        .my-hr-header__subtitle {
          color: var(--text-muted);
          font-size: 0.85rem;
          font-family: 'Cairo', sans-serif;
          margin: 4px 0 0;
          line-height: 1.5;
        }

        .my-hr-header__cta,
        .my-hr-header__cta:link,
        .my-hr-header__cta:visited {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: 12px;
          background: ${FUND_THEME.gradient};
          color: #FFFFFF !important;
          font-family: 'Cairo', sans-serif;
          font-size: 0.85rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 6px 18px ${FUND_THEME.shadow};
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          flex-shrink: 0;
          white-space: nowrap;
          border: none;
        }

        .my-hr-header__cta:hover,
        .my-hr-header__cta:focus,
        .my-hr-header__cta:focus-visible,
        .my-hr-header__cta:active {
          color: #FFFFFF !important;
          background: ${FUND_THEME.gradient};
          text-decoration: none;
          outline: none;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px ${FUND_THEME.shadow};
        }

        .my-hr-header__cta.is-disabled,
        .my-hr-header__cta.is-disabled:link,
        .my-hr-header__cta.is-disabled:visited {
          background: var(--btn-disabled-bg);
          color: var(--btn-disabled-text) !important;
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.75;
        }

        .my-hr-header__cta.is-disabled:hover,
        .my-hr-header__cta.is-disabled:focus,
        .my-hr-header__cta.is-disabled:active {
          background: var(--btn-disabled-bg);
          color: var(--btn-disabled-text) !important;
          transform: none;
          box-shadow: none;
        }

        @media (max-width: 640px) {
          .my-hr-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .my-hr-header__cta {
            justify-content: center;
            width: 100%;
          }
        }

        .my-hr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          width: 100%;
        }
        @media (max-width: 380px) {
          .my-hr-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
};

// ============================================
// Empty state
// ============================================
interface EmptyStateProps {
  title: string;
  description: string;
  showCreate?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title,
  description,
  showCreate = false,
  actionLabel,
  onAction,
}: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      padding: 'clamp(2.5rem, 8vw, 4rem) 1.5rem',
      textAlign: 'center',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '20px',
      border: '1px dashed var(--border-color)',
      fontFamily: 'Cairo, sans-serif',
    }}
  >
    <div
      style={{
        width: '84px',
        height: '84px',
        margin: '0 auto 1rem',
        borderRadius: '50%',
        background: `${FUND_THEME.accent}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: FUND_THEME.accent,
      }}
    >
      <FaHandHoldingHeart size={36} opacity={0.6} />
    </div>
    <h3
      style={{
        color: 'var(--text-secondary)',
        fontSize: '1.1rem',
        fontWeight: 800,
        margin: '0 0 8px',
      }}
    >
      {title}
    </h3>
    <p
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        margin: 0,
        lineHeight: 1.6,
      }}
    >
      {description}
    </p>

    {showCreate && (
      <Link
        to="/user/basma-fund/help-requests/create"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '1.25rem',
          padding: '11px 22px',
          borderRadius: '11px',
          background: FUND_THEME.gradient,
          color: '#FFFFFF',
          textDecoration: 'none',
          fontSize: '0.85rem',
          fontWeight: 800,
          boxShadow: `0 6px 18px ${FUND_THEME.shadow}`,
        }}
      >
        <FaHandHoldingHeart size={13} />
        قدّم طلبك الأول
      </Link>
    )}

    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        style={{
          marginTop: '1.25rem',
          padding: '10px 20px',
          borderRadius: '10px',
          border: `1px solid ${FUND_THEME.accent}`,
          backgroundColor: 'transparent',
          color: FUND_THEME.accent,
          fontFamily: 'Cairo, sans-serif',
          fontSize: '0.85rem',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {actionLabel}
      </button>
    )}
  </motion.div>
);

export default MyHelpRequestsPage;