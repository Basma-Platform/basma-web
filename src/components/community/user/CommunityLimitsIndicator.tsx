import { COMMUNITY_THEME } from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';
import type { CommunityLimits } from '../../../types';

interface CommunityLimitsIndicatorProps {
  limits: CommunityLimits;
}

const CommunityLimitsIndicator = ({ limits }: CommunityLimitsIndicatorProps) => {
  const monthlyPct =
    limits.max_monthly > 0
      ? Math.min((limits.monthly_used / limits.max_monthly) * 100, 100)
      : 0;

  const activePct =
    limits.max_active > 0
      ? Math.min((limits.active_used / limits.max_active) * 100, 100)
      : 0;

  const getColor = (pct: number) => {
    if (pct >= 100) return '#DC3545';
    if (pct >= 80) return '#FFC107';
    return COMMUNITY_THEME.accent;
  };

  return (
    <div
      style={{
        padding: '1.25rem',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        marginBottom: '1.25rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '1rem',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          fontWeight: 900,
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <CommunityIcons.info size={13} />
        حدك الحالي
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <LimitBar
          label="منشورات هذا الشهر"
          used={limits.monthly_used}
          max={limits.max_monthly}
          pct={monthlyPct}
          color={getColor(monthlyPct)}
        />
        <LimitBar
          label="المنشورات النشطة"
          used={limits.active_used}
          max={limits.max_active}
          pct={activePct}
          color={getColor(activePct)}
        />
      </div>

      {!limits.can_post && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(220, 53, 69, 0.08)',
            border: '1px solid rgba(220, 53, 69, 0.25)',
            borderRadius: '10px',
            color: '#DC3545',
            fontSize: '0.78rem',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 700,
            lineHeight: 1.7,
          }}
        >
          لا يمكنك النشر حالياً — لقد وصلت للحد الأقصى من المنشورات. تواصل مع
          الإدارة أو انتظر حتى نهاية الشهر.
        </div>
      )}
    </div>
  );
};

// ============================================
// LimitBar
// ============================================
const LimitBar = ({
  label,
  used,
  max,
  pct,
  color,
}: {
  label: string;
  used: number;
  max: number;
  pct: number;
  color: string;
}) => (
  <div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px',
        fontFamily: 'Cairo, sans-serif',
        fontSize: '0.75rem',
        fontWeight: 800,
        color: 'var(--text-secondary)',
      }}
    >
      <span>{label}</span>
      <span dir="ltr" style={{ color }}>
        {used} / {max}
      </span>
    </div>
    <div
      style={{
        height: '8px',
        backgroundColor: 'var(--bg-input)',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          backgroundColor: color,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  </div>
);

export default CommunityLimitsIndicator;