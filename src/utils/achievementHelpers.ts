import type { DonationAchievementMetadata } from '../types';

// ============================================
// METADATA FORMATTERS
// ============================================

export const formatBeneficiariesCount = (
  metadata: DonationAchievementMetadata | null
): string | null => {
  const n = metadata?.beneficiaries;
  if (!n || n <= 0) return null;
  if (n === 1) return 'مستفيد واحد';
  if (n === 2) return 'مستفيدان';
  if (n <= 10) return `${n} مستفيدين`;
  return `${n} مستفيداً`;
};

export const formatDonorsCount = (
  metadata: DonationAchievementMetadata | null
): string | null => {
  const n = metadata?.donors;
  if (!n || n <= 0) return null;
  if (n === 1) return 'متبرع واحد';
  if (n === 2) return 'متبرعان';
  if (n <= 10) return `${n} متبرعين`;
  return `${n} متبرعاً`;
};

export const formatAmount = (
  metadata: DonationAchievementMetadata | null,
  currency: string = '₪'
): string | null => {
  const n = metadata?.amount;
  if (!n || n <= 0) return null;
  return `${n.toLocaleString('en-US')} ${currency}`;
};

/**
 * Extract all displayable metadata chips for a card
 */
export interface AchievementChip {
  key: 'beneficiaries' | 'donors' | 'amount';
  label: string;
  color: string;
}

export const getAchievementChips = (
  metadata: DonationAchievementMetadata | null
): AchievementChip[] => {
  const chips: AchievementChip[] = [];

  const beneficiaries = formatBeneficiariesCount(metadata);
  if (beneficiaries) {
    chips.push({
      key: 'beneficiaries',
      label: beneficiaries,
      color: '#17A2B8',
    });
  }

  const donors = formatDonorsCount(metadata);
  if (donors) {
    chips.push({
      key: 'donors',
      label: donors,
      color: '#28A745',
    });
  }

  const amount = formatAmount(metadata);
  if (amount) {
    chips.push({
      key: 'amount',
      label: amount,
      color: '#E87A20',
    });
  }

  return chips;
};

// ============================================
// DATE
// ============================================

export const formatAchievementDate = (date: string | null): string => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatAchievementTimeAgo = (date: string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffSec = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffSec < 60) return 'الآن';
  if (diffSec < 3600) return `منذ ${Math.floor(diffSec / 60)} دقيقة`;
  if (diffSec < 86400) return `منذ ${Math.floor(diffSec / 3600)} ساعة`;
  if (diffSec < 604800) return `منذ ${Math.floor(diffSec / 86400)} يوم`;
  if (diffSec < 2592000) return `منذ ${Math.floor(diffSec / 604800)} أسبوع`;
  return `منذ ${Math.floor(diffSec / 2592000)} شهر`;
};

// ============================================
// PLACEHOLDER
// ============================================

export const ACHIEVEMENT_PLACEHOLDER = '/placeholder-achievement.png';