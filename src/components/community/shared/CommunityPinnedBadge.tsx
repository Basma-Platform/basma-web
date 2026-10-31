import { CommunityIcons } from '../../../utils/communityIcons';
import { getPinnedBadgeLabel } from '../../../utils/communityHelpers';

interface CommunityPinnedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { padding: '3px 9px', fontSize: '0.68rem', iconSize: 10, gap: '5px' },
  md: { padding: '5px 12px', fontSize: '0.75rem', iconSize: 12, gap: '6px' },
  lg: { padding: '7px 16px', fontSize: '0.85rem', iconSize: 14, gap: '8px' },
};

/**
 * "Pinned" badge with gold gradient — signals admin-curated content.
 * Only render when `is_pinned = true`.
 */
const CommunityPinnedBadge = ({
  size = 'md',
  className,
}: CommunityPinnedBadgeProps) => {
  const Icon = CommunityIcons.pinned;
  const label = getPinnedBadgeLabel();
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
        color: '#7A5A10',
        background: 'linear-gradient(135deg, #FFE082, #FFC107)',
        border: '1px solid #E0A800',
        borderRadius: '20px',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 8px rgba(255, 193, 7, 0.35)',
      }}
      aria-label={label}
    >
      <Icon size={s.iconSize} />
      <span>{label}</span>
    </span>
  );
};

export default CommunityPinnedBadge;