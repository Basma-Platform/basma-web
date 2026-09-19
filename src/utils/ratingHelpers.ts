import type { RatingDistribution } from '../types';

/**
 * Format rating (always 1 decimal)
 */
export const formatRating = (rating: number | null | undefined): string => {
  if (rating == null) return '—';
  return Number(rating).toFixed(1);
};

/**
 * Get rating label in Arabic based on value
 */
export const getRatingLabel = (rating: number): string => {
  const map: Record<number, string> = {
    1: 'سيء جداً',
    2: 'سيء',
    3: 'مقبول',
    4: 'جيد',
    5: 'ممتاز',
  };
  return map[rating] || '';
};

/**
 * Get rating color based on value
 */
export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return '#28A745';
  if (rating >= 3.5) return '#4FCB6E';
  if (rating >= 2.5) return '#FFC107';
  if (rating >= 1.5) return '#F5A623';
  return '#DC3545';
};

/**
 * Get rating background tint
 */
export const getRatingBg = (rating: number): string => {
  return `${getRatingColor(rating)}15`;
};

/**
 * Format relative time in Arabic ("منذ 3 أيام")
 */
export const formatRatingTime = (date: string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffSec = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffSec < 60) return 'الآن';
  if (diffSec < 3600) {
    const m = Math.floor(diffSec / 60);
    return m === 1 ? 'منذ دقيقة' : `منذ ${m} دقيقة`;
  }
  if (diffSec < 86400) {
    const h = Math.floor(diffSec / 3600);
    return h === 1 ? 'منذ ساعة' : `منذ ${h} ساعات`;
  }
  if (diffSec < 604800) {
    const d = Math.floor(diffSec / 86400);
    return d === 1 ? 'منذ يوم' : `منذ ${d} أيام`;
  }
  if (diffSec < 2592000) {
    const w = Math.floor(diffSec / 604800);
    return w === 1 ? 'منذ أسبوع' : `منذ ${w} أسابيع`;
  }
  const mo = Math.floor(diffSec / 2592000);
  return mo === 1 ? 'منذ شهر' : `منذ ${mo} أشهر`;
};

/**
 * Calculate total from distribution
 */
export const getDistributionTotal = (
  distribution: RatingDistribution
): number => {
  return Object.values(distribution).reduce((sum, n) => sum + n, 0);
};

/**
 * Get percentage for a specific rating in distribution
 */
export const getDistributionPercentage = (
  distribution: RatingDistribution,
  star: 1 | 2 | 3 | 4 | 5
): number => {
  const total = getDistributionTotal(distribution);
  if (total === 0) return 0;
  const count = distribution[String(star) as keyof RatingDistribution] || 0;
  return Math.round((count / total) * 100);
};

/**
 * Get remaining hours for edit window (24h)
 */
export const getRemainingEditHours = (
  editDeadline: string | null | undefined
): number => {
  if (!editDeadline) return 0;
  const now = new Date();
  const deadline = new Date(editDeadline);
  const diffMs = deadline.getTime() - now.getTime();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60));
};

/**
 * Format remaining edit hours in Arabic
 */
export const formatRemainingEditTime = (
  editDeadline: string | null | undefined
): string => {
  const hours = getRemainingEditHours(editDeadline);
  if (hours <= 0) return 'انتهت مدة التعديل';
  if (hours === 1) return 'متبقي ساعة واحدة للتعديل';
  if (hours < 24) return `متبقي ${hours} ساعات للتعديل`;
  return 'يمكنك التعديل لمدة 24 ساعة';
};

/**
 * Get star color for display
 */
export const getStarColor = (filled: boolean): string => {
  return filled ? '#FFC107' : '#D1D5DB';
};

/**
 * Validate comment (for modal — matches backend max 255)
 */
export const validateRatingComment = (comment: string): string | null => {
  if (!comment || !comment.trim()) return null; // Optional
  if (comment.length > 255) return 'التعليق يجب أن لا يتجاوز 255 حرف';
  return null;
};

/**
 * Validate rating value (1-5)
 */
export const validateRatingValue = (rating: number): string | null => {
  if (!rating || rating < 1 || rating > 5) {
    return 'يجب اختيار تقييم من 1 إلى 5 نجوم';
  }
  return null;
};