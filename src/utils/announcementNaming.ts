import type { AnnouncementType } from '../types';

/**
 * Central source of truth for type-aware UI naming.
 *
 * The platform has ONE concept (تبادل الخدمات) but TWO entity types:
 *   - 'offer'   → عرض / عرض خدمة
 *   - 'request' → طلب / طلب خدمة
 *
 * Never hardcode "عرض" or "طلب" in a component. Always go through
 * `getEntity()` or the named helpers below.
 *
 * Usage:
 *   const t = getEntity(announcement.type);
 *   <h4>{t.actions}</h4>              // إجراءات العرض / إجراءات الطلب
 *   <span>{t.owner}</span>            // صاحب العرض / صاحب الطلب
 *   toast.success(t.published);       // تم نشر عرضك / تم نشر طلبك
 */
export interface EntityNaming {
  /** "عرض" | "طلب" */
  noun: string;
  /** "عرض خدمة" | "طلب خدمة" */
  fullNoun: string;
  /** "العرض" | "الطلب" */
  definite: string;
  /** "عرضك" | "طلبك" */
  possessive: string;
  /** "صاحب العرض" | "صاحب الطلب" */
  owner: string;
  /** "إجراءات العرض" | "إجراءات الطلب" */
  actions: string;
  /** "ميّز عرضك" | "ميّز طلبك" */
  featureCTA: string;
  /** "تم نشر عرضك" | "تم نشر طلبك" */
  published: string;
  /** "عرضك" | "طلبك" — used on own-entity badges */
  own: string;
  /** "عروض" | "طلبات" — plural */
  plural: string;
  /** "عرضاً" | "طلباً" — used after verbs */
  accusative: string;
}

/**
 * Returns the full naming table for a given announcement type.
 * Falls back to 'offer' when type is unknown/undefined (safe default).
 */
export const getEntity = (type?: AnnouncementType | null): EntityNaming => {
  if (type === 'request') {
    return {
      noun: 'طلب',
      fullNoun: 'طلب خدمة',
      definite: 'الطلب',
      possessive: 'طلبك',
      owner: 'صاحب الطلب',
      actions: 'إجراءات الطلب',
      featureCTA: 'ميّز طلبك',
      published: 'تم نشر طلبك',
      own: 'طلبك',
      plural: 'طلبات',
      accusative: 'طلباً',
    };
  }

  // Default → offer (also used when type is unknown/undefined)
  return {
    noun: 'عرض',
    fullNoun: 'عرض خدمة',
    definite: 'العرض',
    possessive: 'عرضك',
    owner: 'صاحب العرض',
    actions: 'إجراءات العرض',
    featureCTA: 'ميّز عرضك',
    published: 'تم نشر عرضك',
    own: 'عرضك',
    plural: 'عروض',
    accusative: 'عرضاً',
  };
};

/**
 * Dual-form labels — used on pages without a specific entity context
 * (e.g. MyAnnouncements empty state, generic CTAs).
 */
export const DUAL_LABEL = {
  noun: 'عرض أو طلب',
  fullNoun: 'عرض أو طلب خدمة',
  plural: 'عروض أو طلبات',
  possessive: 'عرضك أو طلبك',
  accusative: 'عرضاً أو طلباً',
  createCTA: 'نشر عرض أو طلب',
  emptyTitle: 'لا توجد عروض أو طلبات بعد',
  emptyDescription: 'ابدأ بنشر عرضك أو طلبك الأول وشارك مجتمعك',
} as const;

/**
 * Barter-side labels — always neutral because barter is mutual.
 * Used on public details page (3rd person neutral).
 */
export const BARTER_LABELS = {
  public: {
    offered: 'ما يقدّمه الطرف الآخر',
    requested: 'ما يطلبه الطرف الآخر',
  },
  owner: {
    offered: 'ما تقدّمه في المقايضة',
    requested: 'ما تطلبه في المقايضة',
  },
} as const;