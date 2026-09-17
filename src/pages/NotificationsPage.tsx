import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import NotificationItem from '../components/shared/NotificationItem';
import NotificationsFilters, {
  type NotificationFilter,
} from '../components/notifications/NotificationsFilters';
import NotificationsSkeleton from '../components/notifications/NotificationsSkeleton';
import DeleteNotificationModal from '../components/notifications/DeleteNotificationModal';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
import type { Notification } from '../types';

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
  const [counts, setCounts] = useState({
    all: 0,
    unread: 0,
    read: 0,
  });

  // ============================================
  // Modal State Management
  // ============================================
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
  // Fetch Notifications
  // ============================================
  const loadNotifications = useCallback(
    async (filter: NotificationFilter = activeFilter, page: number = 1) => {
      try {
        const response = await fetchNotifications({
          filter,
          page,
          per_page: 20,
        });

        // Update counts (fallback using response if not provided separately)
        setCounts((prev) => ({
          ...prev,
          [filter]: response.meta.total,
        }));
      } catch {
        // Toast handled in hook
      }
    },
    [activeFilter, fetchNotifications]
  );

  // Initial load
  useEffect(() => {
    loadNotifications(activeFilter, currentPage);
  }, [activeFilter, currentPage, loadNotifications]);

  // ============================================
  // Handle Filter Change
  // ============================================
  const handleFilterChange = (filter: NotificationFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // ============================================
  // Handle Mark as Read (single)
  // ============================================
  const handleMarkAsRead = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
  };

  // ============================================
  // Handle Delete Prompt (Triggers Custom Modal)
  // ============================================
  const handleDeletePrompt = (id: string) => {
    setDeleteModalState({ isOpen: true, id, isBulk: false });
  };

  // ============================================
  // Handle Delete All Prompt (Triggers Custom Modal)
  // ============================================
  const handleDeleteAllPrompt = () => {
    setDeleteModalState({ isOpen: true, id: null, isBulk: true });
  };

  // ============================================
  // Confirm Delete Action Handler
  // ============================================
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteModalState.isBulk) {
        await deleteAllNotifications();
        setCurrentPage(1);
        loadNotifications(activeFilter, 1);
      } else if (deleteModalState.id) {
        await deleteNotification(deleteModalState.id);
        loadNotifications(activeFilter, currentPage);
      }
      setDeleteModalState({ isOpen: false, id: null, isBulk: false });
    } catch {
      // Toast handled in hook
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================================
  // Handle Mark All as Read
  // ============================================
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      loadNotifications(activeFilter, currentPage);
    } catch {
      // Toast handled in hook
    }
  };

  // ============================================
  // Handle Page Change
  // ============================================
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================
  // Breadcrumb Link
  // ============================================
  const backLink = isAdmin ? '/admin/dashboard' : '/user/dashboard';
  const backLabel = isAdmin ? 'لوحة الإدارة' : 'لوحة التحكم';

  return (
    <>
      <SEO
        title="الإشعارات"
        description="جميع إشعاراتك على منصة بصمة"
      />

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
          {/* Breadcrumb + Page Title */}
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

            {/* Page Title */}
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background:
                      'linear-gradient(135deg, #E87A20, #F5A623)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                    position: 'relative',
                  }}
                >
                  <FaBell size={22} color="#FFFFFF" />

                  {/* Badge on Icon */}
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
                        boxShadow: '0 2px 8px rgba(220,53,69,0.4)',
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

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
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
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'var(--primary-orange)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--primary-orange)';
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
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(220,53,69,0.08)';
                      e.currentTarget.style.borderColor = '#DC3545';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    <FaTrash size={12} />
                    حذف الكل
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* Filters */}
          {/* ============================================ */}
          <NotificationsFilters
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            counts={counts}
          />

          {/* ============================================ */}
          {/* Content */}
          {/* ============================================ */}
          <Row className="justify-content-center">
            <Col xs={12} lg={10} xl={9}>
              {loading && notifications.length === 0 ? (
                <NotificationsSkeleton count={6} />
              ) : notifications.length === 0 ? (
                /* Empty State */
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
                /* Notifications List */
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
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

              {/* ============================================ */}
              {/* Pagination */}
              {/* ============================================ */}
              {!loading && meta && meta.last_page > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '2rem',
                  }}
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-card)',
                      color:
                        currentPage === 1
                          ? 'var(--text-muted)'
                          : 'var(--text-secondary)',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.4 : 1,
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.85rem',
                    }}
                  >
                    <FaChevronRight size={10} />
                    السابق
                  </button>

                  <span
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      padding: '0 12px',
                    }}
                  >
                    صفحة {currentPage} من {meta.last_page}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === meta.last_page}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-card)',
                      color:
                        currentPage === meta.last_page
                          ? 'var(--text-muted)'
                          : 'var(--text-secondary)',
                      cursor:
                        currentPage === meta.last_page
                          ? 'not-allowed'
                          : 'pointer',
                      opacity: currentPage === meta.last_page ? 0.4 : 1,
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.85rem',
                    }}
                  >
                    التالي
                    <FaChevronLeft size={10} />
                  </button>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* ============================================ */}
      {/* Custom Confirmation Modal */}
      {/* ============================================ */}
      <DeleteNotificationModal
        isOpen={deleteModalState.isOpen}
        isBulk={deleteModalState.isBulk}
        title={deleteModalState.isBulk ? 'تأكيد حذف جميع الإشعارات' : 'تأكيد حذف الإشعار'}
        message={
          deleteModalState.isBulk
            ? 'هل أنت متأكد من حذف جميع الإشعارات؟ لا يمكن التراجع عن هذا الإجراء.'
            : 'هل أنت متأكد من حذف هذا الإشعار؟'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalState({ isOpen: false, id: null, isBulk: false })}
        isLoading={isDeleting}
      />
    </>
  );
};

export default NotificationsPage;