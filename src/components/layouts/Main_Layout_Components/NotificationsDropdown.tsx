import { useState, useRef, useEffect } from 'react';
import { FaBell, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useNotifications } from '../../../hooks/useNotifications';
import NotificationItem from '../../shared/NotificationItem';
import type { Notification } from '../../../types';

const NotificationsDropdown = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Notifications Hook
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    startPolling,
    stopPolling,
  } = useNotifications();

  // ============================================
  // Initial load + Polling
  // ============================================
  useEffect(() => {
    // Initial fetch
    fetchNotifications({ filter: 'all', per_page: 5 });
    fetchUnreadCount();

    // Start polling for unread count (60s)
    startPolling();

    return () => {
      stopPolling();
    };
  }, [fetchNotifications, fetchUnreadCount, startPolling, stopPolling]);

  // ============================================
  // Close on outside click
  // ============================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // ============================================
  // Refresh notifications when opening dropdown
  // ============================================
  useEffect(() => {
    if (isOpen) {
      fetchNotifications({ filter: 'all', per_page: 5 });
    }
  }, [isOpen, fetchNotifications]);

  // ============================================
  // Handle notification click
  // ============================================
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      try {
        await markAsRead(notification.id);
      } catch {
        // Error handled in hook
      }
    }

    setIsOpen(false);
  };

  // ============================================
  // Handle mark all as read
  // ============================================
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch {
      // Error handled in hook
    }
  };

  // ============================================
  // Handle view all (Same Page for Admin & User)
  // ============================================
  const handleViewAll = () => {
    navigate('/notifications');
    setIsOpen(false);
  };

  // ============================================
  // Loading Skeleton
  // ============================================
  const renderLoading = () => (
    <div style={{ padding: '12px 18px' }}>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
          style={{
            display: 'flex',
            gap: '12px',
            padding: '10px 0',
            borderBottom: i < 3 ? '1px solid var(--border-color)' : 'none',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--border-color)',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: '12px',
                width: '70%',
                backgroundColor: 'var(--border-color)',
                borderRadius: '6px',
                marginBottom: '8px',
              }}
            />
            <div
              style={{
                height: '10px',
                width: '90%',
                backgroundColor: 'var(--border-color)',
                borderRadius: '6px',
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const isMobile = window.innerWidth < 768;

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* ============================================ */}
      {/* Bell Button */}
      {/* ============================================ */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: isOpen ? 'rgba(232,122,32,0.1)' : 'none',
          border: 'none',
          color: isOpen ? 'var(--primary-orange)' : 'var(--text-muted)',
          fontSize: '1.1rem',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          position: 'relative',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.08)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
        aria-label="الإشعارات"
      >
        <motion.div
          animate={
            unreadCount > 0
              ? {
                  rotate: [0, 15, -15, 12, -12, 7, -7, 0],
                }
              : { rotate: 0 }
          }
          transition={
            unreadCount > 0
              ? {
                  duration: 1.2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut',
                }
              : {}
          }
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <FaBell />
        </motion.div>

        {/* Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              minWidth: '18px',
              height: '18px',
              padding: '0 4px',
              borderRadius: '50%',
              backgroundColor: '#DC3545',
              color: '#FFFFFF',
              fontSize: '0.55rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-card)',
              boxShadow: '0 2px 6px rgba(220,53,69,0.4)',
              zIndex: 2,
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* ============================================ */}
      {/* Dropdown */}
      {/* ============================================ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: isMobile ? 'fixed' : 'absolute',
              top: isMobile ? '68px' : 'calc(100% + 12px)',
              left: isMobile ? '12px' : '0',
              right: isMobile ? '12px' : 'auto',
              width: isMobile ? 'auto' : '380px',
              maxWidth: isMobile ? 'none' : '380px',
              maxHeight: isMobile ? 'calc(100vh - 84px)' : '520px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              boxShadow: isDark
                ? '0 12px 48px rgba(0,0,0,0.4)'
                : '0 12px 48px rgba(0,0,0,0.15)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              zIndex: 9999,
              direction: 'rtl',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ============================================ */}
            {/* Header */}
            {/* ============================================ */}
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-input)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <h6
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  الإشعارات
                </h6>

                {unreadCount > 0 && (
                  <span
                    style={{
                      backgroundColor: 'var(--primary-orange)',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontWeight: 600,
                    }}
                  >
                    {unreadCount} جديد
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-orange)',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 600,
                    padding: '4px 8px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(232,122,32,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <FaCheck size={10} />
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            {/* ============================================ */}
            {/* Content */}
            {/* ============================================ */}
            <div
              style={{
                overflowY: 'auto',
                flex: 1,
                padding: loading && notifications.length === 0 ? '0' : '8px',
              }}
            >
              {loading && notifications.length === 0 ? (
                renderLoading()
              ) : notifications.length === 0 ? (
                <div
                  style={{
                    padding: '3rem 1.5rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontFamily: 'Cairo, sans-serif',
                  }}
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
                      margin: '0 auto 12px',
                    }}
                  >
                    <FaBell size={22} style={{ opacity: 0.4 }} />
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>
                    لا توجد إشعارات
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <AnimatePresence initial={false}>
                    {notifications.slice(0, 5).map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        variant="compact"
                        onClick={handleNotificationClick}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ============================================ */}
            {/* Footer */}
            {/* ============================================ */}
            {notifications.length > 0 && (
              <div
                style={{
                  padding: '10px 18px',
                  borderTop: '1px solid var(--border-color)',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-input)',
                }}
              >
                <button
                  onClick={handleViewAll}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-orange)',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(232,122,32,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  عرض كل الإشعارات →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDropdown;