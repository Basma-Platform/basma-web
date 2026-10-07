import {
  FaCar,
  FaGraduationCap,
  FaHeartbeat,
  FaHome,
  FaShoppingBasket,
  FaTools,
  FaUtensils,
  FaTag,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

// ============================================
// Category Colors
// ============================================

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#E87A20',
  education: '#17A2B8',
  healthcare: '#DC3545',
  home_services: '#28A745',
  food: '#F5A623',
  goods: '#8B5A2B',
  services: '#9C27B0',
  default: '#6C757D',
};

export const getCategoryColor = (slug?: string | null): string => {
  if (!slug) return CATEGORY_COLORS.default;
  return CATEGORY_COLORS[slug] || CATEGORY_COLORS.default;
};

// ============================================
// Category Icons
// ============================================

const CATEGORY_ICONS: Record<string, IconType> = {
  transport: FaCar,
  education: FaGraduationCap,
  healthcare: FaHeartbeat,
  home_services: FaHome,
  food: FaUtensils,
  goods: FaShoppingBasket,
  services: FaTools,
  default: FaTag,
};

export const getCategoryIcon = (slug?: string | null): IconType => {
  if (!slug) return CATEGORY_ICONS.default;
  return CATEGORY_ICONS[slug] || CATEGORY_ICONS.default;
};

// ============================================
// High Risk
// ============================================

export const isHighRiskCategory = (slug?: string | null): boolean => {
  if (!slug) return false;
  return ['education', 'healthcare', 'home_services', 'transport'].includes(
    slug
  );
};

export const getCategoryLabel = (name: string | null | undefined): string => {
  return name || 'غير مصنّف';
};

// ============================================
// Sub-category slug aliases (safety net)
// If your backend sends OTHER slugs, add them above.
// ============================================

export const KNOWN_CATEGORY_SLUGS = Object.keys(CATEGORY_COLORS).filter(
  (s) => s !== 'default'
);