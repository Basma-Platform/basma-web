import { motion } from 'framer-motion';
import { FaInbox, FaEnvelopeOpen, FaEnvelope } from 'react-icons/fa';
import type { IconType } from 'react-icons';

export type NotificationFilter = 'all' | 'unread' | 'read';

interface NotificationsFiltersProps {
  activeFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  counts: {
    all: number;
    unread: number;
    read: number;
  };
}

const NotificationsFilters = ({
  activeFilter,
  onFilterChange,
  counts,
}: NotificationsFiltersProps) => {
  const filters: {
    key: NotificationFilter;
    label: string;
    icon: IconType;
  }[] = [
    { key: 'all', label: 'الكل', icon: FaInbox },
    { key: 'unread', label: 'غير مقروءة', icon: FaEnvelope },
    { key: 'read', label: 'مقروءة', icon: FaEnvelopeOpen },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '1.25rem',
      }}
    >
      {filters.map((filter, index) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.key;
        const count = counts[filter.key];

        return (
          <motion.button
            key={filter.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFilterChange(filter.key)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '30px',
              border: `2px solid ${
                isActive ? 'var(--primary-orange)' : 'var(--border-color)'
              }`,
              backgroundColor: isActive
                ? 'var(--primary-orange)'
                : 'var(--bg-card)',
              color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: isActive
                ? '0 4px 16px rgba(232, 122, 32, 0.3)'
                : 'none',
            }}
          >
            <Icon size={13} />
            <span>{filter.label}</span>

            {/* Count Badge */}
            {count > 0 && (
              <span
                style={{
                  backgroundColor: isActive
                    ? 'rgba(255, 255, 255, 0.25)'
                    : 'var(--bg-input)',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '1px 8px',
                  borderRadius: '10px',
                  minWidth: '22px',
                  textAlign: 'center',
                }}
              >
                {count > 99 ? '99+' : count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default NotificationsFilters;