import { getCommunityStatusIcon } from '../../../utils/communityIcons';
import {
  getCommunityStatusLabel,
  getCommunityStatusColor,
  getCommunityStatusBg,
} from '../../../utils/communityHelpers';
import type { CommunityPostStatus } from '../../../types';

interface CommunityStatusBadgeProps {
  status: CommunityPostStatus;
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  /** Override label with the one from API (already Arabic) */
  labelOverride?: string;
  className?: string;
}

const SIZES = {
  sm: { padding: '3px 9px', fontSize: '0.7rem', iconSize: 10, gap: '5px' },
  md: { padding: '5px 12px', fontSize: '0.78rem', iconSize: 12, gap: '6px' },
  lg: { padding: '7px 16px', fontSize: '0.88rem', iconSize: 14, gap: '8px' },
};

const CommunityStatusBadge = ({
  status,
  size = 'md',
  iconOnly = false,
  labelOverride,
  className,
}: CommunityStatusBadgeProps) => {
  const Icon = getCommunityStatusIcon(status);
  const label = labelOverride || getCommunityStatusLabel(status);
  const color = getCommunityStatusColor(status);
  const bg = getCommunityStatusBg(status);
  const s = SIZES[size];

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 800,
        fontFamily: 'Cairo, sans-serif',
        color,
        backgroundColor: bg,
        border: `1px solid ${color}35`,
        borderRadius: '20px',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
      aria-label={label}
    >
      <Icon size={s.iconSize} />
      {!iconOnly && <span>{label}</span>}
    </span>
  );
};

export default CommunityStatusBadge;