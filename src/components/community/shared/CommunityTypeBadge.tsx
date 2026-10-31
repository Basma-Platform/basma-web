import { getCommunityTypeIcon } from '../../../utils/communityIcons';
import {
  getCommunityTypeLabel,
  getCommunityTypeColor,
  getCommunityTypeBg,
} from '../../../utils/communityHelpers';
import type { CommunityPostType } from '../../../types';

interface CommunityTypeBadgeProps {
  type: CommunityPostType;
  /** 'sm' | 'md' | 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Show only icon (no label) — useful in tight spaces */
  iconOnly?: boolean;
  /** Optional className */
  className?: string;
}

const SIZES = {
  sm: { padding: '3px 9px', fontSize: '0.7rem', iconSize: 10, gap: '5px' },
  md: { padding: '5px 12px', fontSize: '0.78rem', iconSize: 12, gap: '6px' },
  lg: { padding: '7px 16px', fontSize: '0.88rem', iconSize: 14, gap: '8px' },
};

/**
 * Colored badge showing the post type (تحذير / مفقود / موجود / عام)
 * with its icon.
 */
const CommunityTypeBadge = ({
  type,
  size = 'md',
  iconOnly = false,
  className,
}: CommunityTypeBadgeProps) => {
  const Icon = getCommunityTypeIcon(type);
  const label = getCommunityTypeLabel(type);
  const color = getCommunityTypeColor(type);
  const bg = getCommunityTypeBg(type);
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

export default CommunityTypeBadge;