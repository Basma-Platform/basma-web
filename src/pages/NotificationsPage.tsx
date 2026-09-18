import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBell, FaCheck, FaTrash, FaChevronLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import NotificationItem from '../components/shared/NotificationItem';
import NotificationsFilters, {
  type NotificationFilter,
} from '../components/notifications/NotificationsFilters';
import NotificationsSkeleton from '../components/notifications/NotificationsSkeleton';
import DeleteNotificationModal from '../components/notifications/DeleteNotificationModal';
import Pagination from '../components/shared/Pagination';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
import type { Notification } from '../types';

const DEFAULT_PER_PAGE = 20;

const NotificationsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const {
    notifications,
    unreadCount,
    loading,
    meta,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications();

  // ============================================
  // Local State
  // ============================================
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [counts, setCounts] = useState({
    all: 0,
    unread: 0,
    read: 0,
  });

  // ✅ Prevent double-fetching on mount + StrictMode
  const hasFetchedOnce = useRef(false);

  // Modal
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    id: string | null;
    isBulk: boolean;
  }>({
    isOpen: false,
    id: null,
    isBulk: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // ============================================
  // ✅ THE FIX: Single useEffect handles ALL fetches
  //    No separate loadNotifications callback, no dependency chain.
  // ============================================
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetchNotifications({
          filter: activeFilter,
          page: currentPage,
          per_page: perPage,
        });
        if (!cancelled) {
          setCounts((prev) => ({
            ...prev,
            [activeFilter]: response.meta.total,
          }));
        }
      } catch {
        // Toast handled in hook
      }
    };

    load();
    hasFetchedOnce.current = true;

    return () => {
      cancelled = true;
    };
    // ⚠️ DO NOT include `fetchNotifications` here — it re-creates every render
    //    in the current useNotifications hook and will cause infinite loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, currentPage, perPage]);

  // ============================================
  // Handlers
  // ============================================
  const handleFilterChange = (filter: NotificationFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // reset to page 1 on filter change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Per-page change → reset to page 1
  //    The useEffect above will auto-fire because `perPage` changed.
  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleMarkAsRead = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
  };

  const handleDeletePrompt = (id: string) => {
    setDeleteModalState({ isOpen: true, id, isBulk: false });
  };

  const handleDeleteAllPrompt = () => {
    setDeleteModalState({ isOpen: true, id: null, isBulk: true });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteModalState.isBulk) {
        await deleteAllNotifications();
        setCurrentPage(1);
        // If already on page 1, force a manual refetch
        if (currentPage === 1) {
          const response = await fetchNotifications({
            filter: activeFilter,
            page: 1,
            per_page: perPage,
          });
          setCounts((prev) => ({ ...prev, [activeFilter]: response.meta.total }));
        }
      } else if (deleteModalState.id) {
        await deleteNotification(deleteModalState.id);
        // Refetch current page to reflect the removal
        const response = await fetchNotifications({
          filter: activeFilter,
          page: currentPage,
          per_page: perPage,
        });
        setCounts((prev) => ({ ...prev, [activeFilter]: response.meta.total }));
      }
      setDeleteModalState({ isOpen: false, id: null, isBulk: false });
    } catch {
      // Toast handled in hook
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // Refetch current view to update all items' read state
      const response = await fetchNotifications({
        filter: activeFilter,
        page: currentPage,
        per_page: perPage,
      });
      setCounts((prev) => ({ ...prev, [activeFilter]: response.meta.total }));
    } catch {
      // Toast handled in hook
    }
  };

  const backLink = isAdmin ? '/admin/dashboard' : '/user/dashboard';
  const backLabel = isAdmin ? 'لوحة الإدارة' : 'لوحة التحكم';

  return (
    <>
      <SEO title="الإشعارات" description="جميع إشعاراتك على منصة بصمة" />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '1rem',
          paddingBottom: '3rem',
        }}
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
                to={backLink}
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                {backLabel}
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                الإشعارات
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
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
                    boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                    position: 'relative',
                  }}
                >
                  <FaBell size={22} color="#FFFFFF" />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        minWidth: '22px',
                        height: '22px',
                        padding: '0 6px',
                        borderRadius: '50%',
                        backgroundColor: '#DC3545',
                        color: '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--bg-body)',
                      }}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
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
                    الإشعارات
                  </h1>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontFamily: 'Cairo, sans-serif',
                      margin: 0,
                    }}
                  >
                    جميع إشعاراتك وتحديثات حسابك
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {unreadCount > 0 && (
                  <Button
                    onClick={handleMarkAllAsRead}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1.5px solid var(--primary-orange)',
                      color: 'var(--primary-orange)',
                      borderRadius: '10px',
                      padding: '8px 16px',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <FaCheck size={12} />
                    تحديد الكل كمقروء
                  </Button>
                )}

                {notifications.length > 0 && (
                  <Button
                    onClick={handleDeleteAllPrompt}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1.5px solid var(--border-color)',
                      color: '#DC3545',
                      borderRadius: '10px',
                      padding: '8px 16px',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <FaTrash size={12} />
                    حذف الكل
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          <NotificationsFilters
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            counts={counts}
          />

          <Row className="justify-content-center">
            <Col xs={12} lg={10} xl={9}>
              {loading && notifications.length === 0 ? (
                <NotificationsSkeleton count={6} />
              ) : notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '4rem 2rem',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '16px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-input)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                      }}
                    >
                      <FaBell size={32} style={{ opacity: 0.4 }} />
                    </div>
                    <h3
                      style={{
                        color: 'var(--text-secondary)',
                        fontFamily: 'Cairo, sans-serif',
                        marginBottom: '0.5rem',
                        fontSize: '1.2rem',
                      }}
                    >
                      لا توجد إشعارات
                    </h3>
                    <p
                      style={{
                        color: 'var(--text-muted)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.9rem',
                        margin: 0,
                      }}
                    >
                      {activeFilter === 'unread'
                        ? 'لا توجد إشعارات غير مقروءة'
                        : activeFilter === 'read'
                        ? 'لا توجد إشعارات مقروءة'
                        : 'لم تستقبل أي إشعارات بعد'}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    opacity: loading ? 0.5 : 1,
                    pointerEvents: loading ? 'none' : 'auto',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      variant="full"
                      onClick={handleMarkAsRead}
                      onDelete={handleDeletePrompt}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && meta && meta.last_page > 1 && (
                <Pagination
                  currentPage={currentPage}
                  lastPage={meta.last_page}
                  total={meta.total}
                  perPage={perPage}
                  onPageChange={handlePageChange}
                  onPerPageChange={handlePerPageChange}
                  isLoading={loading}
                  perPageOptions={[10, 20, 50, 100]}
                  itemLabel="إشعار"
                />
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <DeleteNotificationModal
        isOpen={deleteModalState.isOpen}
        isBulk={deleteModalState.isBulk}
        title={
          deleteModalState.isBulk
            ? 'تأكيد حذف جميع الإشعارات'
            : 'تأكيد حذف الإشعار'
        }
        message={
          deleteModalState.isBulk
            ? 'هل أنت متأكد من حذف جميع الإشعارات؟ لا يمكن التراجع عن هذا الإجراء.'
            : 'هل أنت متأكد من حذف هذا الإشعار؟'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteModalState({ isOpen: false, id: null, isBulk: false })
        }
        isLoading={isDeleting}
      />
    </>
  );
};

export default NotificationsPage;