import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrashAlt } from 'react-icons/fa';
import NotificationIcon from './NotificationIcon';
import { formatNotificationTime } from '../../utils/notificationHelpers';
import type { Notification } from '../../types';

interface NotificationItemProps {
  notification: Notification;
  variant: 'mini' | 'compact' | 'full';
  onClick?: (notification: Notification) => void;
  onDelete?: (id: string) => void;
}

const NotificationItem = ({
  notification,
  variant,
  onClick,
  onDelete,
}: NotificationItemProps) => {
  const navigate = useNavigate();

  // ============================================
  // Variant-specific styles
  // ============================================
  const styles = {
    mini: {
      container: {
        padding: '8px 10px',
        gap: '10px',
        borderRadius: '12px',
      },
      iconSize: 12,
      bgSize: 30,
      titleSize: '0.78rem',
      bodySize: '0.7rem',
      timeSize: '0.62rem',
      showBody: false,
      showDelete: false,
      lineClampBody: 1,
      lineClampTitle: 1,
    },
    compact: {
      container: {
        padding: '12px 18px',
        gap: '12px',
        borderRadius: '0px',
      },
      iconSize: 14,
      bgSize: 36,
      titleSize: '0.82rem',
      bodySize: '0.75rem',
      timeSize: '0.65rem',
      showBody: true,
      showDelete: false,
      lineClampBody: 2,
      lineClampTitle: 1,
    },
    full: {
      container: {
        padding: '14px 18px',
        gap: '14px',
        borderRadius: '14px',
      },
      iconSize: 16,
      bgSize: 42,
      titleSize: '0.9rem',
      bodySize: '0.82rem',
      timeSize: '0.7rem',
      showBody: true,
      showDelete: true,
      lineClampBody: 3,
      lineClampTitle: 2,
    },
  }[variant];

  // ============================================
  // Click Handler
  // ============================================
  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  // ============================================
  // Delete Handler
  // ============================================
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  // ============================================
  // Background Colors
  // ============================================
  const itemBg = notification.is_read
    ? 'var(--bg-card)'
    : 'rgba(232, 122, 32, 0.05)';

  const itemBorder = notification.is_read
    ? '1px solid var(--border-color)'
    : '1px solid rgba(232, 122, 32, 0.2)';

  const hoverBg = 'rgba(232, 122, 32, 0.08)';

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ x: -3 }}
      transition={{ duration: 0.15 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: styles.container.gap,
        padding: styles.container.padding,
        borderRadius: styles.container.borderRadius,
        backgroundColor: itemBg,
        border: itemBorder,
        cursor: notification.link ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverBg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = itemBg;
      }}
    >
      {/* ============================================ */}
      {/* Icon */}
      {/* ============================================ */}
      <NotificationIcon
        type={notification.type}
        size={styles.iconSize}
        withBackground
        bgSize={styles.bgSize}
      />

      {/* ============================================ */}
      {/* Content */}
      {/* ============================================ */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <div
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: styles.titleSize,
            fontWeight: notification.is_read ? 600 : 700,
            marginBottom: '2px',
            display: '-webkit-box',
            WebkitLineClamp: styles.lineClampTitle,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
          }}
        >
          {notification.title}
        </div>

        {/* Body */}
        {styles.showBody && notification.body && (
          <div
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: styles.bodySize,
              lineHeight: 1.4,
              marginBottom: '4px',
              display: '-webkit-box',
              WebkitLineClamp: styles.lineClampBody,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {notification.body}
          </div>
        )}

        {/* Time */}
        <div
          style={{
            color: 'var(--text-muted)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: styles.timeSize,
            opacity: 0.7,
          }}
        >
          {formatNotificationTime(notification.created_at)}
        </div>
      </div>

      {/* ============================================ */}
      {/* Unread Dot */}
      {/* ============================================ */}
      {!notification.is_read && (
        <div
          style={{
            width: variant === 'mini' ? '6px' : '8px',
            height: variant === 'mini' ? '6px' : '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-orange)',
            flexShrink: 0,
            marginTop: variant === 'mini' ? '4px' : '6px',
            boxShadow: '0 0 8px rgba(232, 122, 32, 0.5)',
          }}
        />
      )}

      {/* ============================================ */}
      {/* Delete Button (Full variant only) */}
      {/* ============================================ */}
      {styles.showDelete && onDelete && (
        <motion.button
          onClick={handleDelete}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            opacity: 0.6,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
            e.currentTarget.style.color = '#DC3545';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.opacity = '0.6';
          }}
          aria-label="حذف الإشعار"
        >
          <FaTrashAlt size={13} />
        </motion.button>
      )}
    </motion.div>
  );
};

export default NotificationItem;