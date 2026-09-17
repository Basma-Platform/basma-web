/**
 * Get status color for featured request
 */
export const getFeaturedStatusColor = (
  status: 'pending' | 'approved' | 'rejected'
): string => {
  const map = {
    pending: '#FFC107',
    approved: '#28A745',
    rejected: '#DC3545',
  };
  return map[status];
};

/**
 * Get status label for featured request
 */
export const getFeaturedStatusLabel = (
  status: 'pending' | 'approved' | 'rejected'
): string => {
  const map = {
    pending: 'قيد المراجعة',
    approved: 'تمت الموافقة',
    rejected: 'مرفوض',
  };
  return map[status];
};

/**
 * Get status icon for featured request
 */
export const getFeaturedStatusIcon = (
  status: 'pending' | 'approved' | 'rejected'
): string => {
  const map = {
    pending: '⏳',
    approved: '✅',
    rejected: '❌',
  };
  return map[status];
};

/**
 * Format price with currency
 */
export const formatPrice = (price: number, currency: string = 'ILS'): string => {
  return `${price.toFixed(2)} ${currency}`;
};

/**
 * Get duration label
 */
export const getDurationLabel = (days: number): string => {
  if (days === 1) return 'يوم واحد';
  if (days === 2) return 'يومان';
  if (days <= 10) return `${days} أيام`;
  return `${days} يوماً`;
};

/**
 * Get payment method label
 */
export const getPaymentMethodLabel = (
  method: 'palpay' | 'jawwal_pay' | 'bop'
): string => {
  const map = {
    palpay: 'PalPay',
    jawwal_pay: 'Jawwal Pay',
    bop: 'Bank of Palestine',
  };
  return map[method];
};

/**
 * Calculate featured benefits (for CTA card)
 */
export const getFeaturedBenefits = (): string[] => {
  return [
    'ظهور في أعلى نتائج البحث',
    'شارة مميز ذهبية',
    'مشاهدات أكثر بـ 10 أضعاف',
    'زيادة فرص التواصل والبيع',
  ];
};

/**
 * Get expected contact time (in Arabic)
 */
export const getExpectedContactTime = (): string => {
  return 'خلال 24 ساعة';
};

/**
 * Get working hours label
 */
export const getWorkingHours = (): string => {
  return 'من السبت إلى الخميس، 8:00 ص - 10:00 م';
};

/**
 * Check if a featured request can be resubmitted
 */
export const canResubmitFeatured = (
  status: 'pending' | 'approved' | 'rejected' | null
): boolean => {
  return status === null || status === 'rejected';
};

/**
 * Get rejection reason display text
 */
export const getRejectionReason = (
  admin_notes: string | null
): string => {
  return admin_notes || 'لم يتم تحديد السبب';
};