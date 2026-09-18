import { useState, useEffect, useCallback, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlusCircle,
  FaChevronLeft,
  FaBullhorn,
  FaBoxOpen,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useUserAnnouncements } from '../../../hooks/useUserAnnouncements';
import {
  MyAnnouncementCard,
  MyAnnouncementStats,
  MyAnnouncementFilters,
  DeleteConfirmModal,
  DisableConfirmModal,
  MyAnnouncementsSkeleton,
  type AnnouncementStatusFilter,
  type AnnouncementSortOption,
} from '../../../components/user/announcements';
import Pagination from '../../../components/shared/Pagination';
import type { Announcement } from '../../../types';

const DEFAULT_PER_PAGE = 12;

const MyAnnouncementsPage = () => {
  const {
    data,
    meta,
    stats,
    loading,
    fetchMyAnnouncements,
    deleteAnnouncement,
    disableAnnouncement,
    enableAnnouncement,
  } = useUserAnnouncements();

  // ============================================
  // Local State
  // ============================================
  const [statusFilter, setStatusFilter] =
    useState<AnnouncementStatusFilter>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<AnnouncementSortOption>('newest');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

  const gridRef = useRef<HTMLDivElement | null>(null);

  // Modals
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number | null;
    title: string;
  }>({ open: false, id: null, title: '' });

  const [disableModal, setDisableModal] = useState<{
    open: boolean;
    id: number | null;
    title: string;
    mode: 'disable' | 'enable';
  }>({ open: false, id: null, title: '', mode: 'disable' });

  const [modalLoading, setModalLoading] = useState(false);

  // ============================================
  // Fetch Wrapper (with page + perPage)
  // ============================================
  const loadAnnouncements = useCallback(
    async (
      page: number = 1,
      perPageOverride?: number
    ) => {
      const pp = perPageOverride ?? perPage;
      await fetchMyAnnouncements({
        status: statusFilter,
        search: search || undefined,
        sort,
        page,
        per_page: pp,
      });
    },
    [fetchMyAnnouncements, statusFilter, search, sort, perPage]
  );

  // ============================================
  // Initial + Filter Changes → Reset to page 1
  // ============================================
  useEffect(() => {
    setCurrentPage(1);
    loadAnnouncements(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sort]);

  // ============================================
  // Debounced Search
  // ============================================
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchMyAnnouncements({
        status: statusFilter,
        search: search || undefined,
        sort,
        page: 1,
        per_page: perPage,
      }).finally(() => setIsSearching(false));
    }, 450);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ============================================
  // Page Change Handler
  // ============================================
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await loadAnnouncements(page);

    if (gridRef.current) {
      gridRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ============================================
  // ✅ NEW: Per-Page Change Handler
  // ============================================
  const handlePerPageChange = async (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    await loadAnnouncements(1, newPerPage);
  };

  // ============================================
  // Actions
  // ============================================
  const handleDeleteClick = (announcement: Announcement) => {
    setDeleteModal({
      open: true,
      id: announcement.id,
      title: announcement.title,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.id) return;
    try {
      setModalLoading(true);
      await deleteAnnouncement(deleteModal.id);
      setDeleteModal({ open: false, id: null, title: '' });

      const targetPage =
        data.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(targetPage);
      await loadAnnouncements(targetPage);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDisableClick = (announcement: Announcement) => {
    setDisableModal({
      open: true,
      id: announcement.id,
      title: announcement.title,
      mode: 'disable',
    });
  };

  const handleEnableClick = (announcement: Announcement) => {
    setDisableModal({
      open: true,
      id: announcement.id,
      title: announcement.title,
      mode: 'enable',
    });
  };

  const handleDisableConfirm = async (reason?: string) => {
    if (!disableModal.id) return;
    try {
      setModalLoading(true);
      if (disableModal.mode === 'disable') {
        await disableAnnouncement(disableModal.id, reason);
      } else {
        await enableAnnouncement(disableModal.id);
      }
      setDisableModal({ open: false, id: null, title: '', mode: 'disable' });

      await loadAnnouncements(currentPage);
    } finally {
      setModalLoading(false);
    }
  };

  const handleFeatureClick = (id: number) => {
    window.location.href = `/user/announcements/${id}/feature`;
  };

  const handleClearFilters = useCallback(() => {
    setStatusFilter('all');
    setSearch('');
    setSort('newest');
    setCurrentPage(1);
  }, []);

  // ============================================
  // Initial Loading Skeleton
  // ============================================
  const showInitialSkeleton = loading && !stats && data.length === 0;

  if (showInitialSkeleton) {
    return (
      <>
        <SEO title="إعلاناتي" description="إدارة جميع إعلاناتك في منصة بصمة" />
        <MyAnnouncementsSkeleton variant="page" count={6} />
      </>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO title="إعلاناتي" description="إدارة جميع إعلاناتك في منصة بصمة" />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '1rem',
          paddingBottom: '3rem',
        }}
      >
        <Container fluid="xl" className="px-3 px-md-4">
          {/* ============================================ */}
          {/* Page Header */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '1.5rem' }}
          >
            {/* Breadcrumb */}
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
                to="/user/dashboard"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                لوحة التحكم
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                إعلاناتي
              </span>
            </div>

            {/* Title + CTA */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                  }}
                >
                  <FaBullhorn size={22} />
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
                    إعلاناتي
                  </h1>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontFamily: 'Cairo, sans-serif',
                      margin: 0,
                    }}
                  >
                    إدارة جميع إعلاناتك من مكان واحد
                  </p>
                </div>
              </div>

              {/* Create Button */}
              {stats?.can_create_more !== false && (
                <Link
                  to="/user/announcements/create"
                  style={{ textDecoration: 'none' }}
                >
                  <motion.button
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: '11px 20px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                      color: '#FFFFFF',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(232,122,32,0.35)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <FaPlusCircle size={14} />
                    نشر إعلان جديد
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          {stats && (
            <MyAnnouncementStats
              stats={stats}
              activeFilter={statusFilter}
              onFilterClick={setStatusFilter}
            />
          )}

          {/* Filters */}
          <MyAnnouncementFilters
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            sort={sort}
            onSortChange={setSort}
            onClear={handleClearFilters}
            isSearching={isSearching}
            resultsCount={data.length}
          />

          {/* Announcements Grid */}
          <div ref={gridRef}>
            <AnimatePresence mode="wait">
              {loading && data.length === 0 ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <MyAnnouncementsSkeleton variant="grid" count={6} />
                </motion.div>
              ) : data.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
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
                    }}
                  >
                    <FaBoxOpen
                      size={36}
                      color="var(--primary-orange)"
                      opacity={0.6}
                    />
                  </div>
                  <h3
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      margin: '0 0 8px',
                    }}
                  >
                    {search || statusFilter !== 'all'
                      ? 'لا توجد نتائج مطابقة'
                      : 'لا توجد إعلانات بعد'}
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      margin: '0 0 1.25rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {search || statusFilter !== 'all'
                      ? 'حاول تغيير الفلاتر أو كلمات البحث'
                      : 'ابدأ بنشر إعلانك الأول وشارك مجتمعك'}
                  </p>

                  {search || statusFilter !== 'all' ? (
                    <button
                      onClick={handleClearFilters}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: '1.5px solid var(--primary-orange)',
                        backgroundColor: 'transparent',
                        color: 'var(--primary-orange)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      مسح الفلاتر
                    </button>
                  ) : (
                    <Link
                      to="/user/announcements/create"
                      style={{ textDecoration: 'none' }}
                    >
                      <button
                        style={{
                          padding: '11px 24px',
                          borderRadius: '11px',
                          border: 'none',
                          background:
                            'linear-gradient(135deg, #E87A20, #F5A623)',
                          color: '#FFFFFF',
                          fontFamily: 'Cairo, sans-serif',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 16px rgba(232,122,32,0.35)',
                        }}
                      >
                        <FaPlusCircle size={13} />
                        انشر إعلانك الأول
                      </button>
                    </Link>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '16px',
                      opacity: loading ? 0.5 : 1,
                      pointerEvents: loading ? 'none' : 'auto',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {data.map((announcement, index) => (
                      <motion.div
                        key={announcement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: Math.min(index * 0.05, 0.4),
                        }}
                      >
                        <MyAnnouncementCard
                          announcement={announcement}
                          onDelete={() => handleDeleteClick(announcement)}
                          onDisable={() => handleDisableClick(announcement)}
                          onEnable={() => handleEnableClick(announcement)}
                          onFeature={handleFeatureClick}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* ============================================ */}
                  {/* ✅ NEW: Shared Pagination */}
                  {/* ============================================ */}
                  {meta && (
                    <Pagination
                      currentPage={meta.current_page}
                      lastPage={meta.last_page}
                      total={meta.total}
                      perPage={perPage}
                      onPageChange={handlePageChange}
                      onPerPageChange={handlePerPageChange}
                      isLoading={loading}
                      perPageOptions={[6, 12, 24, 48]}
                      itemLabel="إعلان"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Container>
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={deleteModal.open}
        announcementTitle={deleteModal.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
        isLoading={modalLoading}
      />

      <DisableConfirmModal
        isOpen={disableModal.open}
        announcementTitle={disableModal.title}
        mode={disableModal.mode}
        onConfirm={handleDisableConfirm}
        onCancel={() =>
          setDisableModal({
            open: false,
            id: null,
            title: '',
            mode: 'disable',
          })
        }
        isLoading={modalLoading}
      />
    </>
  );
};

export default MyAnnouncementsPage;