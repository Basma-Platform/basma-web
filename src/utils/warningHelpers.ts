import type { WarningLevel, AccountErrorCode } from '../types';

// ============================================
// Warning Level → Visual Config
// ============================================

export interface WarningLevelConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  gradient: string;
  /** Should we pulse the badge to draw attention? */
  pulse: boolean;
}

export const getWarningLevelConfig = (
  level: WarningLevel
): WarningLevelConfig => {
  const map: Record<WarningLevel, WarningLevelConfig> = {
    clean: {
      label: 'نظيف',
      color: '#28A745',
      bg: 'rgba(40,167,69,0.1)',
      border: 'rgba(40,167,69,0.3)',
      gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
      pulse: false,
    },
    warning: {
      label: 'تحذير',
      color: '#FFC107',
      bg: 'rgba(255,193,7,0.12)',
      border: 'rgba(255,193,7,0.35)',
      gradient: 'linear-gradient(135deg, #FFC107, #FFD966)',
      pulse: false,
    },
    last_warning: {
      label: 'تحذير أخير',
      color: '#E87A20',
      bg: 'rgba(232,122,32,0.12)',
      border: 'rgba(232,122,32,0.4)',
      gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
      pulse: true,
    },
    critical: {
      label: 'حرج',
      color: '#DC3545',
      bg: 'rgba(220,53,69,0.12)',
      border: 'rgba(220,53,69,0.4)',
      gradient: 'linear-gradient(135deg, #DC3545, #F56575)',
      pulse: true,
    },
  };
  return map[level] ?? map.clean;
};

// ============================================
// Progress percentage (for warning bar)
// ============================================

export const getWarningProgressPercent = (
  count: number,
  threshold: number
): number => {
  if (threshold <= 0) return 0;
  return Math.min(100, Math.round((count / threshold) * 100));
};

// ============================================
// Account Error Codes
// ============================================

export const isSuspendedCode = (
  code?: AccountErrorCode
): boolean => code === 'ACCOUNT_SUSPENDED';

export const isBlockedCode = (
  code?: AccountErrorCode
): boolean => code === 'ACCOUNT_BLOCKED';

/**
 * Format the "remaining days" label in Arabic
 * 1 → "يوم واحد"
 * 2 → "يومان"
 * 3-10 → "N أيام"
 * 11+ → "N يوماً"
 */
export const formatDaysRemaining = (days: number): string => {
  if (days <= 0) return 'أقل من يوم';
  if (days === 1) return 'يوم واحد';
  if (days === 2) return 'يومان';
  if (days <= 10) return `${days} أيام`;
  return `${days} يوماً`;
};

/**
 * Format the suspension end date in Arabic (long)
 */
export const formatSuspendedUntil = (date: string | null): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ============================================
// Account status persistence key
// ============================================

/**
 * The key we store the last-known "suspended/blocked" state under in
 * localStorage, so that a page reload while suspended keeps showing the
 * modal instead of bouncing the user to a blank page.
 */
export const ACCOUNT_STATUS_STORAGE_KEY = 'basma_account_status';