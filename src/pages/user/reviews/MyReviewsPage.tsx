import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronLeft,
  FaStar,
  FaInbox,
  FaPaperPlane,
  FaTrash,
  FaTimes,
  FaInfoCircle,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useMyReviews } from '../../../hooks/useMyReviews';
import Pagination from '../../../components/shared/Pagination';
import {
  RatingStatsCards,
  RatingDistribution,
  RatingModal,
} from '../../../components/ratings';
import {
  MyReviewsTabs,
  MyReviewsFilters,
  MyReviewCard,
  MyReviewsSkeleton,
  RatingInsightsCard,
} from '../../../components/user/reviews';
import type { MyReviewsTab } from '../../../components/user/reviews';
import type { RatingFilter } from '../../../components/user/reviews';
import type { Rating } from '../../../types';

const PER_PAGE_OPTIONS = [6, 12, 24, 48];
const DEFAULT_PER_PAGE = 12;

const MyReviewsPage = () => {
  const {
    received,
    receivedMeta,
    receivedLoading,
    fetchReceived,
    given,
    givenMeta,
    givenLoading,
    fetchGiven,
    stats,
    statsLoading,
    fetchStats,
    deleteGivenRating,
  } = useMyReviews();

  // Tabs
  const [activeTab, setActiveTab] = useState<MyReviewsTab>('received');

  // Received filters
  const [receivedFilter, setReceivedFilter] = useState<RatingFilter>('all');
  const [receivedPage, setReceivedPage] = useState(1);
  const [receivedPerPage, setReceivedPerPage] = useState(DEFAULT_PER_PAGE);

  // Given pagination
  const [givenPage, setGivenPage] = useState(1);
  const [givenPerPage, setGivenPerPage] = useState(DEFAULT_PER_PAGE);

  // Edit modal
  const [editModal, setEditModal] = useState<{
    open: boolean;
    rating: Rating | null;
  }>({ open: false, rating: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    rating: Rating | null;
  }>({ open: false, rating: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Initial loading
  const [initialLoading, setInitialLoading] = useState(true);

  // ============================================
  // Initial Load (stats + active tab data)
  // ============================================
  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          fetchStats(),
          fetchReceived({ page: 1, per_page: DEFAULT_PER_PAGE }),
          fetchGiven({ page: 1, per_page: DEFAULT_PER_PAGE }),
        ]);
      } finally {
        setInitialLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // Received: refetch on filter / page / perPage
  // ============================================
  useEffect(() => {
    if (initialLoading) return;
    fetchReceived({
      rating:
        receivedFilter === 'all'
          ? undefined
          : (receivedFilter as 1 | 2 | 3 | 4 | 5),
      page: receivedPage,
      per_page: receivedPerPage,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedFilter, receivedPage, receivedPerPage]);

  // ============================================
  // Given: refetch on page / perPage
  // ============================================
  useEffect(() => {
    if (initialLoading) return;
    fetchGiven({ page: givenPage, per_page: givenPerPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [givenPage, givenPerPage]);

  // ============================================
  // Tab change handler
  // ============================================
  const handleTabChange = (tab: MyReviewsTab) => {
    setActiveTab(tab);
  };

  // ============================================
  // Filter change → reset page
  // ============================================
  const handleFilterChange = (filter: RatingFilter) => {
    setReceivedFilter(filter);
    setReceivedPage(1);
  };

  // ============================================
  // Edit / Delete handlers
  // ============================================
  const handleEdit = (rating: Rating) => {
    setEditModal({ open: true, rating });
  };

  const handleDelete = (rating: Rating) => {
    setDeleteModal({ open: true, rating });
  };

  const handleEditSubmit = async (data: {
    rating: number;
    comment?: string;
  }) => {
    if (!editModal.rating) return;
    setIsSubmitting(true);
    try {
      const { ratingService } = await import('../../../services/ratingService');
      await ratingService.updateRating(editModal.rating.id, {
        rating: data.rating,
        comment: data.comment,
      });
      await Promise.all([
        fetchGiven({ page: givenPage, per_page: givenPerPage }),
        fetchStats(),
      ]);
      setEditModal({ open: false, rating: null });
    } catch {
      // Toast handled inside the service
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.rating) return;
    setIsDeleting(true);
    try {
      await deleteGivenRating(deleteModal.rating.id);
      setDeleteModal({ open: false, rating: null });
    } catch {
      // Toast handled in hook
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================================
  // Initial loading
  // ============================================
  if (initialLoading && !stats) {
    return (
      <>
        <SEO title="تقييماتي" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '1rem',
            paddingBottom: '3rem',
          }}
        >
          <Container fluid="xl" className="px-2 px-md-4">
            <MyReviewsSkeleton variant="stats" />
            <div style={{ marginTop: '1.5rem' }}>
              <MyReviewsSkeleton variant="list" count={4} />
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
        title="تقييماتي"
        description="إدارة التقييمات المستلمة والمعطاة على منصة بصمة"
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '0.75rem',
          paddingBottom: '3rem',
          overflowX: 'hidden',
        }}
        dir="rtl"
      >
        <Container fluid="xl" className="px-2 px-md-4" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          {/* ============================================ */}
          {/* Breadcrumb + Title */}
          {/* ============================================ */}
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
                marginBottom: '0.5rem',
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
              <FaChevronLeft size={9} style={{ opacity: 0.4 }} />
              <span style={{ opacity: 0.7 }}>تقييماتي</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FFC107, #F5A623)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(255,193,7,0.3)',
                  flexShrink: 0,
                }}
              >
                <FaStar size={18} color="#FFFFFF" />
              </div>
              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.25rem, 5vw, 1.6rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  تقييماتي
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
                  عرض وإدارة التقييمات المستلمة والمعطاة
                </p>
              </div>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* Tabs */}
          {/* ============================================ */}
          <MyReviewsTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            counts={{
              received: stats?.total_received || 0,
              given: stats?.total_given || 0,
            }}
          />

          {/* ============================================ */}
          {/* Tab Content */}
          {/* ============================================ */}
          <AnimatePresence mode="wait">
            {/* =================== RECEIVED =================== */}
            {activeTab === 'received' && (
              <motion.div
                key="received"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <MyReviewsFilters
                  activeFilter={receivedFilter}
                  onFilterChange={handleFilterChange}
                />

                {receivedLoading && received.length === 0 ? (
                  <MyReviewsSkeleton variant="list" count={4} />
                ) : received.length === 0 ? (
                  <EmptyState
                    icon={<FaInbox size={32} />}
                    title={
                      receivedFilter === 'all'
                        ? 'لا توجد تقييمات مستلمة'
                        : 'لا توجد تقييمات بهذه الفلترة'
                    }
                    description={
                      receivedFilter === 'all'
                        ? 'عندما يقوم الآخرون بتقييمك، ستظهر تقييماتهم هنا.'
                        : 'جرّب تغيير الفلتر لعرض نتائج أخرى.'
                    }
                  />
                ) : (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        opacity: receivedLoading ? 0.5 : 1,
                        pointerEvents: receivedLoading ? 'none' : 'auto',
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      {received.map((rating, index) => (
                        <motion.div
                          key={rating.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: Math.min(index * 0.04, 0.3),
                          }}
                        >
                          <MyReviewCard
                            rating={rating}
                            variant="received"
                          />
                        </motion.div>
                      ))}
                    </div>

                    {receivedMeta && receivedMeta.last_page > 1 && (
                      <Pagination
                        currentPage={receivedPage}
                        lastPage={receivedMeta.last_page}
                        total={receivedMeta.total}
                        perPage={receivedPerPage}
                        onPageChange={setReceivedPage}
                        onPerPageChange={(pp) => {
                          setReceivedPerPage(pp);
                          setReceivedPage(1);
                        }}
                        perPageOptions={PER_PAGE_OPTIONS}
                        isLoading={receivedLoading}
                        itemLabel="تقييم"
                      />
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* =================== GIVEN =================== */}
            {activeTab === 'given' && (
              <motion.div
                key="given"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {givenLoading && given.length === 0 ? (
                  <MyReviewsSkeleton variant="list" count={4} />
                ) : given.length === 0 ? (
                  <EmptyState
                    icon={<FaPaperPlane size={32} />}
                    title="لم تقم بأي تقييمات بعد"
                    description="بعد إتمام أي تعامل، يمكنك تقييم الطرف الآخر من صفحة الإعلان."
                  />
                ) : (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        opacity: givenLoading ? 0.5 : 1,
                        pointerEvents: givenLoading ? 'none' : 'auto',
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      {given.map((rating, index) => (
                        <motion.div
                          key={rating.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: Math.min(index * 0.04, 0.3),
                          }}
                        >
                          <MyReviewCard
                            rating={rating}
                            variant="given"
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {givenMeta && givenMeta.last_page > 1 && (
                      <Pagination
                        currentPage={givenPage}
                        lastPage={givenMeta.last_page}
                        total={givenMeta.total}
                        perPage={givenPerPage}
                        onPageChange={setGivenPage}
                        onPerPageChange={(pp) => {
                          setGivenPerPage(pp);
                          setGivenPage(1);
                        }}
                        perPageOptions={PER_PAGE_OPTIONS}
                        isLoading={givenLoading}
                        itemLabel="تقييم"
                      />
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* =================== STATS =================== */}
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {statsLoading && !stats ? (
                  <MyReviewsSkeleton variant="stats" />
                ) : stats ? (
                  <>
                    {/* Stat cards */}
                    <RatingStatsCards stats={stats} />

                    {/* Distribution (left) + Insights (right) */}
                    <Row className="g-3 mt-1">
                      <Col xs={12} lg={7}>
                        <RatingDistribution
                          distribution={stats.rating_distribution}
                        />
                      </Col>
                      <Col xs={12} lg={5}>
                        <RatingInsightsCard stats={stats} />
                      </Col>
                    </Row>
                  </>
                ) : (
                  <EmptyState
                    icon={<FaStar size={32} />}
                    title="لا توجد إحصائيات بعد"
                    description="ابدأ بالتقييم واستلم تقييمات لعرض إحصائياتك."
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </div>

      {/* ============================================ */}
      {/* Edit Modal */}
      {/* ============================================ */}
      <RatingModal
        isOpen={editModal.open}
        mode="edit"
        existingRating={editModal.rating}
        ownerName={editModal.rating?.rated?.name}
        announcementTitle={editModal.rating?.announcement?.title}
        onSubmit={handleEditSubmit}
        onCancel={() => setEditModal({ open: false, rating: null })}
        isLoading={isSubmitting}
      />

      {/* ============================================ */}
      {/* Delete Modal */}
      {/* ============================================ */}
      <SimpleDeleteModal
        isOpen={deleteModal.open}
        ratingValue={deleteModal.rating?.rating}
        ratedName={deleteModal.rating?.rated?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, rating: null })}
        isLoading={isDeleting}
      />
    </>
  );
};

// ============================================
// Helpers
// ============================================

const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    style={{
      padding: '2.5rem 1rem',
      textAlign: 'center',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px dashed var(--border-color)',
      fontFamily: 'Cairo, sans-serif',
      width: '100%',
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        width: '64px',
        height: '64px',
        margin: '0 auto 0.75rem',
        borderRadius: '50%',
        background: 'rgba(255,193,7,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFC107',
      }}
    >
      {icon}
    </div>
    <h3
      style={{
        color: 'var(--text-secondary)',
        fontSize: '1.05rem',
        fontWeight: 800,
        margin: '0 0 6px',
      }}
    >
      {title}
    </h3>
    <p
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.78rem',
        margin: 0,
        lineHeight: 1.5,
        maxWidth: '360px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      {description}
    </p>
  </motion.div>
);

// ============================================
// Simple Delete Confirmation Modal (inline)
// ============================================
const SimpleDeleteModal = ({
  isOpen,
  ratingValue,
  ratedName,
  onConfirm,
  onCancel,
  isLoading,
}: {
  isOpen: boolean;
  ratingValue?: number;
  ratedName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !isLoading && onCancel()}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 1060,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          boxSizing: 'border-box',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '380px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            padding: '1.25rem 1rem 1rem',
            fontFamily: 'Cairo, sans-serif',
            direction: 'rtl',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          <button
            type="button"
            onClick={() => !isLoading && onCancel()}
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(0,0,0,0.04)',
              color: 'var(--text-muted)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isLoading ? 0.5 : 1,
            }}
            aria-label="إغلاق"
          >
            <FaTimes size={10} />
          </button>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                margin: '0 auto 0.75rem',
                borderRadius: '50%',
                background: 'rgba(220,53,69,0.12)',
                border: '2px solid rgba(220,53,69,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DC3545',
              }}
            >
              <FaTrash size={20} />
            </div>

            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 900,
                color: 'var(--text-secondary)',
                margin: '0 0 6px',
              }}
            >
              تأكيد حذف التقييم
            </h3>

            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                margin: '0 0 1rem',
              }}
            >
              هل أنت متأكد من حذف تقييمك
              {ratingValue && (
                <>
                  {' '}
                  (
                  <strong style={{ color: '#FFC107' }}>
                    {ratingValue} نجوم
                  </strong>
                  )
                </>
              )}
              {ratedName && (
                <>
                  {' '}
                  لـ{' '}
                  <strong style={{ color: 'var(--text-secondary)' }}>
                    {ratedName}
                  </strong>
                </>
              )}
              ؟ لا يمكن التراجع.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '6px',
                padding: '8px 10px',
                backgroundColor: 'rgba(255,193,7,0.08)',
                border: '1px solid rgba(255,193,7,0.25)',
                borderRadius: '8px',
                marginBottom: '1rem',
                textAlign: 'right',
              }}
            >
              <FaInfoCircle
                size={10}
                color="#856404"
                style={{ flexShrink: 0, marginTop: '2px' }}
              />
              <span
                style={{
                  fontSize: '0.68rem',
                  color: '#856404',
                  lineHeight: 1.4,
                }}
              >
                الحذف متاح فقط خلال 24 ساعة من إضافة التقييم.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1.5px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              إلغاء
            </Button>

            <Button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #DC3545, #B02A37)',
                color: '#FFFFFF',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                boxShadow: '0 4px 14px rgba(220,53,69,0.3)',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    style={{ width: '12px', height: '12px' }}
                  />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <FaTrash size={10} />
                  نعم، احذف
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default MyReviewsPage;