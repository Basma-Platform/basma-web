import { useEffect, useState } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBell, FaChevronLeft, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationItem from '../../shared/NotificationItem';
import { useNotifications } from '../../../hooks/useNotifications';
import type { Notification } from '../../../types';

interface DashboardRecentNotificationsProps {
  initialNotifications: Notification[];
  initialUnreadCount: number;
}

const DashboardRecentNotifications = ({
  initialNotifications,
  initialUnreadCount,
}: DashboardRecentNotificationsProps) => {
  // ============================================
  // Local state (from initial Dashboard data)
  // ============================================
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  // ============================================
  // Hook for Mark as Read + Mark All as Read actions
  // ============================================
  const { markAsRead, markAllAsRead } = useNotifications();

  // ============================================
  // Sync if parent changes
  // ============================================
  useEffect(() => {
    setNotifications(initialNotifications);
    setUnreadCount(initialUnreadCount);
  }, [initialNotifications, initialUnreadCount]);

  // ============================================
  // Handle notification click
  // ============================================
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        await markAsRead(notification.id);
        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // Toast handled in hook
      }
    }
    // Navigation handled in NotificationItem
  };

  // ============================================
  // Handle mark all as read
  // ============================================
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // Toast handled in hook
    }
  };

  const isAllRead = unreadCount === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="h-100"
    >
      <Card
        className="h-100 d-flex flex-column"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 4px 16px var(--shadow-sm)',
        }}
      >
        {/* ============================================ */}
        {/* Header */}
        {/* ============================================ */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(232, 122, 32, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-orange)',
                position: 'relative',
              }}
            >
              <FaBell size={14} />
            </div>

            <h5
              style={{
                color: 'var(--text-secondary)',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 700,
                margin: 0,
                fontSize: '1rem',
              }}
            >
              آخر الإشعارات
            </h5>

            {/* Badge - عدد غير المقروءة */}
            {unreadCount > 0 && (
              <Badge
                style={{
                  backgroundColor: '#DC3545',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  minWidth: '22px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>

          {/* "عرض الكل" Link */}
          <Link
            to="/notifications"
            style={{
              color: 'var(--primary-orange)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
            }}
          >
            عرض الكل <FaChevronLeft size={10} />
          </Link>
        </div>

        {/* ============================================ */}
        {/* Notifications List */}
        {/* ============================================ */}
        {notifications.length === 0 ? (
          <div
            className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center py-4"
            style={{ color: 'var(--text-muted)' }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-input)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
              }}
            >
              <FaBell size={22} style={{ opacity: 0.4 }} />
            </div>
            <p
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                margin: 0,
                opacity: 0.7,
              }}
            >
              لا توجد إشعارات حالياً
            </p>
          </div>
        ) : (
          <>
            <div className="d-flex flex-column gap-2 flex-grow-1">
              <AnimatePresence initial={false}>
                {notifications.slice(0, 7).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    variant="mini"
                    onClick={handleNotificationClick}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* ============================================ */}
            {/* Mark All as Read (Footer) - Always Visible */}
            {/* ============================================ */}
            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                marginTop: '6px',
                paddingTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={handleMarkAllAsRead}
                disabled={isAllRead}
                style={{
                  width: '100%',
                  background: isAllRead ? 'var(--bg-input)' : 'none',
                  border: isAllRead
                    ? '1px solid var(--border-color)'
                    : '1px dashed var(--border-color)',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  color: 'var(--text-muted)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: isAllRead ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isAllRead ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isAllRead) {
                    e.currentTarget.style.borderColor = 'var(--primary-orange)';
                    e.currentTarget.style.color = 'var(--primary-orange)';
                    e.currentTarget.style.backgroundColor =
                      'rgba(232,122,32,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isAllRead) {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <FaCheck size={12} />
                {isAllRead ? 'تم قراءة جميع الإشعارات' : 'تحديد الكل كمقروء'}
              </button>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default DashboardRecentNotifications;