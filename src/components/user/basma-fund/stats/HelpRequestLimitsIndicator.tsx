import { motion } from 'framer-motion';
import { FaInfoCircle } from 'react-icons/fa';
import type { HelpRequestLimits } from '../../../../types';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';

interface HelpRequestLimitsIndicatorProps {
  limits: HelpRequestLimits;
}

/**
 * Compact limits indicator for MyHelpRequestsPage.
 *
 * Displays two progress bars (active + monthly) and, when a limit is
 * reached, a truthful Arabic explanation of the situation.
 *
 * ⚠️ No CTAs:
 *  - User is already verified (this page requires verification).
 *  - Users can only self-delete within the 30-min window.
 *  - Archiving is an admin-only action.
 */
const HelpRequestLimitsIndicator = ({
  limits,
}: HelpRequestLimitsIndicatorProps) => {
  const activePercent =
    limits.max_active > 0
      ? Math.min(
          100,
          Math.round((limits.active_used / limits.max_active) * 100)
        )
      : 0;

  const monthlyPercent =
    limits.max_monthly > 0
      ? Math.min(
          100,
          Math.round((limits.monthly_used / limits.max_monthly) * 100)
        )
      : 0;

  const activeReached =
    limits.max_active > 0 && limits.active_used >= limits.max_active;

  const monthlyReached =
    limits.max_monthly > 0 && limits.monthly_used >= limits.max_monthly;

  const reachedAny = activeReached || monthlyReached;

  // ============================================
  // Hint content — truth-based, case-specific
  // ============================================
  const getReachedHint = (): string => {
    if (activeReached && monthlyReached) {
      return `يمكنك امتلاك ${limits.max_active} طلبات نشطة في نفس الوقت كحد أقصى، و${limits.max_monthly} طلبات شهرياً. سيتم تجديد الحد الشهري مطلع الشهر القادم.`;
    }
    if (activeReached) {
      return `يمكنك امتلاك ${limits.max_active} طلبات نشطة في نفس الوقت كحد أقصى. يمكنك الحذف فقط خلال 30 دقيقة من إنشاء الطلب — بعد ذلك تواصل مع الإدارة إن احتجت مساعدة.`;
    }
    return `يمكنك تقديم ${limits.max_monthly} طلبات شهرياً كحد أقصى. سيتم تجديد الحد مطلع الشهر القادم.`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        padding: '1rem 1.1rem',
        borderRadius: '14px',
        backgroundColor: reachedAny
          ? 'rgba(220,53,69,0.06)'
          : 'rgba(23,162,184,0.06)',
        border: reachedAny
          ? '1px solid rgba(220,53,69,0.22)'
          : '1px solid rgba(23,162,184,0.2)',
        marginBottom: '1rem',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {/* ============================================ */}
      {/* Header row */}
      {/* ============================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
          color: reachedAny ? '#DC3545' : FUND_THEME.accent,
          fontSize: '0.82rem',
          fontWeight: 800,
        }}
      >
        <FaInfoCircle size={12} />
        {reachedAny ? 'وصلت إلى حد الطلبات' : 'حدود النشر الحالية'}
      </div>

      {/* ============================================ */}
      {/* Progress bars */}
      {/* ============================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        <LimitBar
          label="الطلبات النشطة"
          used={limits.active_used}
          max={limits.max_active}
          percent={activePercent}
          color={FUND_THEME.accent}
        />
        <LimitBar
          label="هذا الشهر"
          used={limits.monthly_used}
          max={limits.max_monthly}
          percent={monthlyPercent}
          color="#E87A20"
        />
      </div>

      {/* ============================================ */}
      {/* Reached hint — truthful, no fake CTAs */}
      {/* ============================================ */}
      {reachedAny && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px dashed rgba(220,53,69,0.25)',
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            lineHeight: 1.65,
            fontWeight: 600,
          }}
        >
          {getReachedHint()}
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================
// Internal bar component
// ============================================
interface LimitBarProps {
  label: string;
  used: number;
  max: number;
  percent: number;
  color: string;
}

const LimitBar = ({ label, used, max, percent, color }: LimitBarProps) => (
  <div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
        fontSize: '0.75rem',
        fontWeight: 700,
      }}
    >
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span
        style={{
          color,
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {used} / {max}
      </span>
    </div>
    <div
      style={{
        height: '6px',
        borderRadius: '3px',
        backgroundColor: 'var(--bg-input)',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          height: '100%',
          borderRadius: '3px',
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        }}
      />
    </div>
  </div>
);

export default HelpRequestLimitsIndicator;