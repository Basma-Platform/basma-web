import {
  FaExclamationTriangle,
  FaSearch,
  FaMapMarkerAlt,
  FaBullhorn,
  FaThumbtack,
  FaWhatsapp,
  FaClock,
  FaTag,
  FaMapPin,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaRegClock,
  FaRegEye,
  FaChevronRight,
  FaChevronLeft,
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaPen,
  FaTrash,
  FaCheck,
  FaTimes,
  FaBan,
  FaUndo,
  FaImages,
  FaInfoCircle,
  FaUserSecret,
  FaUser,
  FaUserEdit,
  FaExpand,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaRegImage,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { CommunityPostType, CommunityPostStatus } from '../types';

// ============================================
// TYPE ICONS
// ============================================

export const COMMUNITY_TYPE_ICONS: Record<CommunityPostType, IconType> = {
  warning: FaExclamationTriangle,
  lost: FaSearch,
  found: FaMapMarkerAlt,
  general: FaBullhorn,
};

export const getCommunityTypeIcon = (
  type: CommunityPostType
): IconType => COMMUNITY_TYPE_ICONS[type] ?? FaBullhorn;

// ============================================
// STATUS ICONS
// ============================================

export const COMMUNITY_STATUS_ICONS: Record<CommunityPostStatus, IconType> = {
  pending: FaHourglassHalf,
  approved: FaCheckCircle,
  rejected: FaTimesCircle,
  resolved: FaCheck,
  expired: FaBan,
};

export const getCommunityStatusIcon = (
  status: CommunityPostStatus
): IconType => COMMUNITY_STATUS_ICONS[status] ?? FaInfoCircle;

// ============================================
// DISPLAY NAME ICONS
// ============================================

export const COMMUNITY_DISPLAY_ICONS = {
  full: FaUser,
  anonymous: FaUserSecret,
  custom: FaUserEdit,
} as const;

// ============================================
// SHARED UI ICONS
// ============================================

export const CommunityIcons = {
  // Type-agnostic
  pinned: FaThumbtack,
  views: FaRegEye,
  eye: FaRegEye,
  clicks: FaWhatsapp,
  time: FaRegClock,
  clock: FaClock,
  category: FaTag,
  location: FaMapPin,
  region: FaMapMarkedAlt,
  calendar: FaCalendarAlt,

  // Actions
  add: FaPlus,
  edit: FaPen,
  delete: FaTrash,
  confirm: FaCheck,
  cancel: FaTimes,
  resolve: FaCheckCircle,
  reopen: FaUndo,
  ban: FaBan,
  info: FaInfoCircle,

  // Images
  image: FaRegImage,
  images: FaImages,
  expand: FaExpand,

  // Navigation
  arrowLeft: FaArrowLeft,
  arrowRight: FaArrowRight,
  chevronLeft: FaChevronLeft,
  chevronRight: FaChevronRight,
} as const;

// ============================================
// Resolvable helper
// ============================================

export const isResolvable = (type: CommunityPostType): boolean =>
  type === 'lost' || type === 'found';

export default CommunityIcons;