import { motion } from 'framer-motion';
import type { HelpRequestStatus } from '../../../../types';
import {
  getHelpRequestStatusLabel,
  getHelpRequestStatusColor,
  getHelpRequestStatusBg,
  getHelpRequestStatusGradient,
} from '../../../../utils/helpRequestHelpers';

interface HelpRequestStatusBadgeProps {
  status: HelpRequestStatus;
  /** Show as a pill (default) or a minimal dot+label */
  variant?: 'pill' | 'minimal';
}

/**
 * Status badge for a user's own help request.
 * Uses the same glassy style family as the announcement status badges.
 */
const HelpRequestStatusBadge = ({
  status,
  variant = 'pill',
}: HelpRequestStatusBadgeProps) => {
  const label = getHelpRequestStatusLabel(status);
  const color = getHelpRequestStatusColor(status);
  const bg = getHelpRequestStatusBg(status);
  const gradient = getHelpRequestStatusGradient(status);

  if (variant === 'minimal') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.72rem',
          fontWeight: 700,
          color,
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: gradient,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
        {label}
      </span>
    );
  }

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 11px',
        borderRadius: '20px',
        backgroundColor: bg,
        border: `1px solid ${color}40`,
        color,
        fontSize: '0.72rem',
        fontWeight: 800,
        fontFamily: 'Cairo, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: gradient,
        }}
      />
      {label}
    </motion.span>
  );
};

export default HelpRequestStatusBadge;