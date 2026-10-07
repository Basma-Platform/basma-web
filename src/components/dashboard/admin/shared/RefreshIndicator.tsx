import { motion, AnimatePresence } from 'framer-motion';
import { FaSyncAlt, FaCheckCircle } from 'react-icons/fa';

interface RefreshIndicatorProps {
  refreshing: boolean;
  lastUpdated?: string | null;
  onRefresh?: () => void;
}

/**
 * Subtle refresh indicator + button
 * - Rotates while refreshing
 * - Shows "آخر تحديث" timestamp when idle
 * - Click to manually refresh
 */
const RefreshIndicator = ({
  refreshing,
  lastUpdated,
  onRefresh,
}: RefreshIndicatorProps) => {
  return (
    <div
      dir="rtl"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '20px',
        backgroundColor: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        fontFamily: 'Cairo, sans-serif',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        cursor: onRefresh ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
      onClick={onRefresh}
      onMouseEnter={(e) => {
        if (onRefresh) {
          e.currentTarget.style.borderColor = 'var(--primary-orange)';
          e.currentTarget.style.color = 'var(--primary-orange)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.color = 'var(--text-muted)';
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {refreshing ? (
          <motion.span
            key="refreshing"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              display: 'inline-flex',
              color: 'var(--primary-orange)',
            }}
          >
            <FaSyncAlt size={11} />
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'inline-flex',
              color: '#28A745',
            }}
          >
            <FaCheckCircle size={11} />
          </motion.span>
        )}
      </AnimatePresence>

      <span style={{ display: 'none' }} className="refresh-text-desktop">
        {refreshing
          ? 'جاري التحديث...'
          : lastUpdated
            ? `آخر تحديث: ${lastUpdated}`
            : 'محدّث'}
      </span>

      <style>{`
        @media (min-width: 480px) {
          .refresh-text-desktop {
            display: inline !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RefreshIndicator;