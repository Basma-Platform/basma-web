import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

interface NotificationsSkeletonProps {
  count?: number;
}

const NotificationsSkeleton = ({ count = 6 }: NotificationsSkeletonProps) => {
  const SkeletonBlock = ({
    height,
    width,
    borderRadius = '8px',
    style,
  }: {
    height: string;
    width?: string;
    borderRadius?: string;
    style?: React.CSSProperties;
  }) => (
    <motion.div
      animate={{ opacity: [0.35, 0.75, 0.35] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        height,
        width,
        borderRadius,
        backgroundColor: 'var(--border-color)',
        ...style,
      }}
    />
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '14px 18px',
              boxShadow: '0 2px 8px var(--shadow-sm)',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
              }}
            >
              {/* Icon */}
              <SkeletonBlock
                height="42px"
                width="42px"
                borderRadius="12px"
                style={{ flexShrink: 0 }}
              />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Title */}
                <SkeletonBlock
                  height="14px"
                  width="50%"
                  borderRadius="6px"
                  style={{ marginBottom: '10px' }}
                />
                {/* Body Line 1 */}
                <SkeletonBlock
                  height="11px"
                  width="90%"
                  borderRadius="6px"
                  style={{ marginBottom: '6px' }}
                />
                {/* Body Line 2 */}
                <SkeletonBlock
                  height="11px"
                  width="70%"
                  borderRadius="6px"
                  style={{ marginBottom: '10px' }}
                />
                {/* Time */}
                <SkeletonBlock
                  height="9px"
                  width="25%"
                  borderRadius="6px"
                />
              </div>

              {/* Unread Dot */}
              <SkeletonBlock
                height="8px"
                width="8px"
                borderRadius="50%"
                style={{ flexShrink: 0, marginTop: '6px' }}
              />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default NotificationsSkeleton;