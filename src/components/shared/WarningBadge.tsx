import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import type { UserWarnings } from '../../types';
import { getWarningLevelConfig } from '../../utils/warningHelpers';

interface WarningBadgeProps {
  warnings?: UserWarnings;
  /** Compact = tiny icon-only chip. Default = chip with count. */
  variant?: 'chip' | 'icon';
  /** Optional click handler (e.g. scroll to WarningCard) */
  onClick?: () => void;
}

/**
 * Small badge that shows the user's current warning count.
 * Renders nothing when count is 0.
 *
 * Usage:
 *   <WarningBadge warnings={user.warnings} />
 *   <WarningBadge warnings={user.warnings} variant="icon" />
 */
const WarningBadge = ({
  warnings,
  variant = 'chip',
  onClick,
}: WarningBadgeProps) => {
  if (!warnings || warnings.count <= 0) return null;

  const config = getWarningLevelConfig(warnings.status.level);
  const isIconOnly = variant === 'icon';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      title={warnings.status.message || `لديك ${warnings.count} تحذيرات`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isIconOnly ? '0' : '5px',
        padding: isIconOnly ? '5px' : '4px 9px',
        minWidth: isIconOnly ? '26px' : 'auto',
        height: '26px',
        borderRadius: '8px',
        border: `1px solid ${config.border}`,
        backgroundColor: config.bg,
        color: config.color,
        fontFamily: 'Cairo, sans-serif',
        fontSize: '0.7rem',
        fontWeight: 800,
        lineHeight: 1,
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Pulse ring for last_warning / critical */}
      {config.pulse && (
        <motion.span
          animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: '10px',
            border: `2px solid ${config.color}`,
            pointerEvents: 'none',
          }}
        />
      )}

      <FaExclamationTriangle size={isIconOnly ? 11 : 10} />

      {!isIconOnly && (
        <span
          style={{
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
            fontVariantNumeric: 'tabular-nums',
            fontSize: '0.72rem',
          }}
        >
          {warnings.count}
        </span>
      )}
    </motion.button>
  );
};

export default WarningBadge;