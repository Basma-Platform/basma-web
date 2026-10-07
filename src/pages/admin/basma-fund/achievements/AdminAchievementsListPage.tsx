import { useEffect, useState, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronRight, FaPlus, FaAward } from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import Pagination from '../../../../components/shared/Pagination';

import {
  AdminAchievementCard,
  AdminAchievementFilters,
  AdminAchievementStatsCards,
  AdminAchievementFormModal,
  AdminDeleteAchievementModal,
} from '../../../../components/admin/basma-fund/achievements';
import type {
  AdminAchievementSort,
  AdminAchievementStatusFilter,
  AdminAchievementFeaturedFilter,
} from '../../../../components/admin/basma-fund/achievements';

import { useAdminDonationAchievements } from '../../../../hooks/useAdminDonationAchievements';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';
import type {
  DonationAchievement,
  AdminDonationAchievementPayload,
} from '../../../../types';

const PER_PAGE = 12;

const AdminAchievementsListPage = () => {
  // ============================================
  // Data
  // ============================================
  const {
    achievements,
    meta,
    stats,
    loading,
    statsLoading,
    actionLoading,
    fetchList,
    fetchStats,
    create,
    update,
    deleteAchievement,
    toggleFeatured,
    toggleActive,
  } = useAdminDonationAchievements();

  // ============================================
  // Filters
  // ============================================
  const [status, setStatus] = useState<AdminAchievementStatusFilter>('all');
  const [featured, setFeatured] =
    useState<AdminAchievementFeaturedFilter>('all');
  const [sort, setSort] = useState<AdminAchievementSort>('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_PAGE);
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // ============================================
  // Modals
  // ============================================
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DonationAchievement | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] =
    useState<DonationAchievement | null>(null);

  // ============================================
  // Fetch list
  // ============================================
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsSearching(true);

      const statusParam =
        status === 'active' ? true : status === 'inactive' ? false : undefined;
      const featuredParam =
        featured === 'featured'
          ? true
          : featured === 'normal'
          ? false
          : undefined;

      try {
        await fetchList({
          is_active: statusParam,
          is_featured: featuredParam,
          search: search.trim() || undefined,
          sort,
          page,
          per_page: perPage,
        });
      } catch {
        // handled in hook
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
  }, [status, featured, sort, search, page, perPage, fetchList]);

  // ============================================
  // Fetch stats on mount
  // ============================================
  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // Handlers
  // ============================================
  const handleStatusChange = useCallback(
    (next: AdminAchievementStatusFilter) => {
      setStatus(next);
      setPage(1);
    },
    []
  );

  const handleFeaturedChange = useCallback(
    (next: AdminAchievementFeaturedFilter) => {
      setFeatured(next);
      setPage(1);
    },
    []
  );

  const handleSortChange = useCallback((next: AdminAchievementSort) => {
    setSort(next);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setStatus('all');
    setFeatured('all');
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

  // --------------------------------------------
  // Add / Edit
  // --------------------------------------------
  const handleAddClick = useCallback(() => {
    setEditTarget(null);
    setFormOpen(true);
  }, []);

  const handleEditClick = useCallback((achievement: DonationAchievement) => {
    setEditTarget(achievement);
    setFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (payload: AdminDonationAchievementPayload) => {
      if (editTarget) {
        await update(editTarget.id, payload);
      } else {
        await create(payload);
      }
      setFormOpen(false);
      setEditTarget(null);
      // ✅ Refresh stats after mutation
      fetchStats();
    },
    [editTarget, update, create, fetchStats]
  );

  const handleFormCancel = useCallback(() => {
    setFormOpen(false);
    setEditTarget(null);
  }, []);

  // --------------------------------------------
  // Delete
  // --------------------------------------------
  const handleDeleteClick = useCallback((achievement: DonationAchievement) => {
    setDeleteTarget(achievement);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (reason?: string) => {
      if (!deleteTarget) return;
      await deleteAchievement(deleteTarget.id, reason);
      setDeleteTarget(null);
      fetchStats();
      await fetchList({
        is_active:
          status === 'active' ? true : status === 'inactive' ? false : undefined,
        is_featured:
          featured === 'featured'
            ? true
            : featured === 'normal'
            ? false
            : undefined,
        search: search.trim() || undefined,
        sort,
        page,
        per_page: perPage,
      });
    },
    [
      deleteTarget,
      deleteAchievement,
      fetchList,
      fetchStats,
      status,
      featured,
      search,
      sort,
      page,
      perPage,
    ]
  );

  const handleDeleteCancel = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  // --------------------------------------------
  // Toggles
  // --------------------------------------------
  const handleToggleFeatured = useCallback(
    async (achievement: DonationAchievement) => {
      await toggleFeatured(achievement.id);
    },
    [toggleFeatured]
  );

  const handleToggleActive = useCallback(
    async (achievement: DonationAchievement) => {
      await toggleActive(achievement.id);
    },
    [toggleActive]
  );

  // ============================================
  // Empty states
  // ============================================
  const isEmpty = !loading && achievements.length === 0;
  const isFilteredEmpty =
    isEmpty &&
    (status !== 'all' || featured !== 'all' || search.trim() !== '');

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO
        title="إنجازات التبرعات | لوحة الإدارة"
        description="إدارة إنجازات التبرعات"
      />

      <div className="admin-ach-page" dir="rtl">
        <Container fluid="xl" className="admin-ach-page__container">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="admin-ach-page__breadcrumb"
          >
            <Link to="/admin/dashboard" className="admin-ach-page__crumb-link">
              لوحة الإدارة
            </Link>
            <FaChevronRight
              size={9}
              style={{ opacity: 0.4, transform: 'rotate(180deg)' }}
            />
            <span style={{ opacity: 0.75 }}>إنجازات التبرعات</span>
          </motion.nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="admin-ach-page__header"
          >
            <div className="admin-ach-page__icon">
              <FaAward size={22} />
            </div>
            <div className="admin-ach-page__title-block">
              <h1 className="admin-ach-page__title">إنجازات التبرعات</h1>
              <p className="admin-ach-page__subtitle">
                إنشاء وتعديل وإدارة إنجازات الصندوق
              </p>
            </div>
          </motion.div>

          {/* Initial loading */}
          {initialLoading && achievements.length === 0 ? (
            <div className="admin-ach-page__skeleton" />
          ) : (
            <>
              {/* Stats — ✅ Now uses backend stats directly */}
              <AdminAchievementStatsCards
                stats={stats}
                activeFilter={
                  status === 'inactive'
                    ? 'inactive'
                    : status === 'active'
                    ? 'active'
                    : featured === 'featured'
                    ? 'featured'
                    : 'all'
                }
                onFilterClick={(filter) => {
                  if (filter === 'all') {
                    setStatus('all');
                    setFeatured('all');
                  } else if (filter === 'active') {
                    setStatus('active');
                    setFeatured('all');
                  } else if (filter === 'inactive') {
                    setStatus('inactive');
                    setFeatured('all');
                  } else if (filter === 'featured') {
                    setStatus('all');
                    setFeatured('featured');
                  }
                  setPage(1);
                }}
                loading={statsLoading}
              />

              <AdminAchievementFilters
                search={search}
                onSearchChange={handleSearchChange}
                status={status}
                onStatusChange={handleStatusChange}
                featured={featured}
                onFeaturedChange={handleFeaturedChange}
                sort={sort}
                onSortChange={handleSortChange}
                onClear={handleClearFilters}
                onAddClick={handleAddClick}
                isSearching={isSearching}
                resultsCount={achievements.length}
              />

              {/* Content */}
              {loading && achievements.length === 0 ? (
                <div className="admin-ach-page__skeleton" />
              ) : isEmpty ? (
                <EmptyState
                  isFiltered={isFilteredEmpty}
                  onClear={handleClearFilters}
                  onAdd={handleAddClick}
                />
              ) : (
                <div className="admin-achievements-grid">
                  {achievements.map((achievement, idx) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(idx * 0.04, 0.35),
                      }}
                      style={{ minWidth: 0 }}
                    >
                      <AdminAchievementCard
                        achievement={achievement}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        onToggleFeatured={handleToggleFeatured}
                        onToggleActive={handleToggleActive}
                        isActionLoading={actionLoading}
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
                  perPageOptions={[12, 24, 48, 96]}
                  isLoading={loading}
                  itemLabel="إنجاز"
                />
              )}
            </>
          )}
        </Container>
      </div>

      {/* Form Modal */}
      <AdminAchievementFormModal
        isOpen={formOpen}
        achievement={editTarget}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isLoading={actionLoading}
      />

      {/* Delete Modal */}
      <AdminDeleteAchievementModal
        isOpen={!!deleteTarget}
        achievementTitle={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={actionLoading}
      />

      <style>{`
        .admin-ach-page {
          background-color: var(--bg-body);
          min-height: 100vh;
          padding-top: 2rem;
          padding-bottom: 3rem;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .admin-ach-page__container {
          max-width: 1200px;
          padding-left: 12px !important;
          padding-right: 12px !important;
          box-sizing: border-box;
        }

        @media (min-width: 576px) {
          .admin-ach-page__container {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }

        .admin-ach-page__breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
          font-family: 'Cairo', sans-serif;
          flex-wrap: wrap;
        }

        .admin-ach-page__crumb-link {
          color: ${FUND_THEME.accent};
          text-decoration: none;
          font-weight: 600;
        }

        .admin-ach-page__header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .admin-ach-page__icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #FFD700 0%, #E87A20 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 6px 18px rgba(232,122,32,0.35);
          flex-shrink: 0;
        }

        .admin-ach-page__title-block {
          min-width: 0;
          flex: 1;
        }

        .admin-ach-page__title {
          color: var(--text-secondary);
          font-size: clamp(1.15rem, 4vw, 1.6rem);
          font-weight: 900;
          font-family: 'Cairo', sans-serif;
          margin: 0;
          line-height: 1.25;
        }

        .admin-ach-page__subtitle {
          color: var(--text-muted);
          font-size: clamp(0.72rem, 2.5vw, 0.85rem);
          font-family: 'Cairo', sans-serif;
          margin: 4px 0 0;
          line-height: 1.5;
        }

        .admin-achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 480px) {
          .admin-achievements-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        @media (max-width: 360px) {
          .admin-ach-page {
            padding-top: 1.25rem;
            padding-bottom: 2rem;
          }
          .admin-ach-page__icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
          }
          .admin-ach-page__icon svg {
            width: 18px;
            height: 18px;
          }
          .admin-achievements-grid {
            gap: 10px;
          }
        }

        .admin-ach-page__skeleton {
          height: 280px;
          border-radius: 16px;
          background-color: var(--border-color);
          animation: achPagePulse 1.5s ease-in-out infinite;
        }

        @keyframes achPagePulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </>
  );
};

// ============================================
// Empty State
// ============================================
const EmptyState = ({
  isFiltered,
  onClear,
  onAdd,
}: {
  isFiltered: boolean;
  onClear: () => void;
  onAdd: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      padding: 'clamp(2rem, 8vw, 4rem) clamp(1rem, 4vw, 1.5rem)',
      textAlign: 'center',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '20px',
      border: '1px dashed var(--border-color)',
      fontFamily: 'Cairo, sans-serif',
    }}
  >
    <div
      style={{
        width: '76px',
        height: '76px',
        margin: '0 auto 1rem',
        borderRadius: '50%',
        background: 'rgba(255,193,7,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFC107',
      }}
    >
      <FaAward size={30} opacity={0.7} />
    </div>
    <h3
      style={{
        color: 'var(--text-secondary)',
        fontSize: 'clamp(1rem, 3.5vw, 1.1rem)',
        fontWeight: 800,
        margin: '0 0 8px',
      }}
    >
      {isFiltered ? 'لا توجد نتائج مطابقة' : 'لا توجد إنجازات بعد'}
    </h3>
    <p
      style={{
        color: 'var(--text-muted)',
        fontSize: 'clamp(0.78rem, 2.8vw, 0.85rem)',
        margin: '0 0 1.25rem',
        lineHeight: 1.6,
        maxWidth: '380px',
        marginInline: 'auto',
      }}
    >
      {isFiltered
        ? 'حاول تغيير الفلاتر أو كلمات البحث'
        : 'ابدأ بإنشاء أول إنجاز لعرضه للجمهور'}
    </p>
    {isFiltered ? (
      <button
        type="button"
        onClick={onClear}
        style={{
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
        مسح الفلاتر
      </button>
    ) : (
      <button
        type="button"
        onClick={onAdd}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '11px 22px',
          borderRadius: '11px',
          border: 'none',
          background: FUND_THEME.gradient,
          color: '#FFFFFF',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '0.85rem',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: `0 6px 18px ${FUND_THEME.shadow}`,
        }}
      >
        <FaPlus size={13} />
        إنجاز جديد
      </button>
    )}
  </motion.div>
);

export default AdminAchievementsListPage;