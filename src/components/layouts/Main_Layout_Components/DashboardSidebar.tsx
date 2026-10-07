import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBullhorn,
  FaStar,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
  FaThumbtack,
  FaFlag,
  FaUsers,
  FaChartBar,
  FaCheckCircle,
  FaPlus,
  FaMoon,
  FaSun,
  FaCommentDots,
  FaTimes,
  FaHandHoldingHeart,
  FaTrophy,
  FaNewspaper,
  FaLock,
  FaInbox,
} from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../context/ThemeContext';
import { useVerificationGuard } from '../../../context/VerificationGuardContext';
import { useUserAnnouncements } from '../../../hooks/useUserAnnouncements';
import { useAdminFeaturedRequests } from '../../../hooks/useAdminFeaturedRequests';
import { useAdminVerifications } from '../../../hooks/useAdminVerifications';
import { useAdminReports } from '../../../hooks/useAdminReports';
import { useAdminHelpRequests } from '../../../hooks/useAdminHelpRequests';
import { useAdminDonationInquiries } from '../../../hooks/useAdminDonationInquiries';
import { getPendingBadgeCount as getFeaturedPendingBadgeCount } from '../../../utils/featuredHelpers';
import { getPendingBadgeCount as getReportsPendingBadgeCount } from '../../../utils/reportHelpers';
import { getStorageUrl } from '../../../utils/storageHelpers';
import WarningBadge from '../../shared/WarningBadge';
import logo from '../../../assets/logo.png';
import { motion } from 'framer-motion';

// ============================================
// Types
// ============================================
interface DashboardSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
  badgeColor?: string;
  requiresVerification?: boolean;
}

// ============================================
// ✅ Path matching helpers
// ============================================

/**
 * Returns true if `currentPath` matches `basePath` exactly OR is a
 * direct sub-route of it.
 */
const isPathActive = (currentPath: string, basePath: string): boolean => {
  if (currentPath === basePath) return true;
  return currentPath.startsWith(basePath + '/');
};

/**
 * Given a list of paths and the current location, returns the SET of
 * paths that should be marked active.
 *
 * Rule: **only the single deepest matching path is active.**
 * This prevents parent/child pairs (e.g. `/help-requests` and
 * `/help-requests/create`) from being highlighted at the same time.
 */
const computeActiveSet = (
  currentPath: string,
  allPaths: string[]
): Set<string> => {
  // Find all paths that match the current URL
  const matches = allPaths.filter((p) => isPathActive(currentPath, p));

  if (matches.length === 0) return new Set();

  // Pick the LONGEST match (deepest path)
  const deepest = matches.reduce((a, b) =>
    a.length >= b.length ? a : b
  );

  return new Set([deepest]);
};

// ============================================
// ✅ HARD-CODED Arabic names for verification modal
// ============================================
const VERIFICATION_NAMES: Record<string, string> = {
  '/user/basma-fund/help-requests': 'طلبات المساعدة',
  '/user/basma-fund/help-requests/create': 'تقديم طلب مساعدة',
  '/user/community-posts': 'منشورات المجتمع',
  '/user/community-posts/create': 'إنشاء منشور في المجتمع',
};

const DEFAULT_VERIFICATION_NAME = 'ميزة تتطلب التوثيق';

const resolveVerificationName = (path: string): string => {
  if (VERIFICATION_NAMES[path]) return VERIFICATION_NAMES[path];
  return DEFAULT_VERIFICATION_NAME;
};

// ============================================
// DashboardSidebar
// ============================================
const DashboardSidebar = ({
  isOpen,
  onClose,
  isMobile = false,
}: DashboardSidebarProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleDarkMode } = useTheme();
  const location = useLocation();
  const { requireVerification } = useVerificationGuard();

  const isAdmin = user?.role === 'admin';
  const isVerified = !!user?.is_verified;

  // ============================================
  // Badge: User announcements count
  // ============================================
  const [announcementCount, setAnnouncementCount] = useState<number>(0);
  const { stats, fetchMyAnnouncements } = useUserAnnouncements();

  useEffect(() => {
    if (isAdmin || !user || !isAuthenticated) return;
    fetchMyAnnouncements({ per_page: 1 }).catch(() => {});
  }, [isAdmin, user, isAuthenticated, fetchMyAnnouncements]);

  useEffect(() => {
    if (stats) {
      setAnnouncementCount(stats.total || 0);
    }
  }, [stats]);

  // ============================================
  // Badge: Admin featured requests pending count
  // ============================================
  const { stats: featuredStats, fetchStats: fetchFeaturedStats } =
    useAdminFeaturedRequests();

  useEffect(() => {
    if (!isAdmin || !isAuthenticated) return;
    fetchFeaturedStats().catch(() => {});
  }, [isAdmin, isAuthenticated, fetchFeaturedStats]);

  // ============================================
  // Badge: Admin verification requests pending count
  // ============================================
  const {
    stats: verificationStats,
    fetchRequests: fetchVerificationRequests,
  } = useAdminVerifications();

  useEffect(() => {
    if (!isAdmin || !isAuthenticated) return;
    fetchVerificationRequests({ status: 'pending', per_page: 1 }).catch(
      () => {}
    );
  }, [isAdmin, isAuthenticated, fetchVerificationRequests]);

  // ============================================
  // Badge: Admin reports pending count
  // ============================================
  const { stats: reportsStats, fetchStats: fetchReportsStats } =
    useAdminReports();

  useEffect(() => {
    if (!isAdmin || !isAuthenticated) return;
    fetchReportsStats().catch(() => {});
  }, [isAdmin, isAuthenticated, fetchReportsStats]);

  // ============================================
  // Badge: Admin help-requests pending count
  // ============================================
  const { stats: hrStats, fetchStats: fetchHrStats } = useAdminHelpRequests();

  useEffect(() => {
    if (!isAdmin || !isAuthenticated) return;
    fetchHrStats().catch(() => {});
  }, [isAdmin, isAuthenticated, fetchHrStats]);

  // ============================================
  // Badge: Admin donation inquiries (new) count
  // ============================================
  const { stats: inquiryStats, fetchStats: fetchInquiryStats } =
    useAdminDonationInquiries();

  useEffect(() => {
    if (!isAdmin || !isAuthenticated) return;
    fetchInquiryStats().catch(() => {});
  }, [isAdmin, isAuthenticated, fetchInquiryStats]);

  // ============================================
  // Escape key closes sidebar on mobile
  // ============================================
  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobile, isOpen, onClose]);

  // ============================================
  // Admin nav items (raw, without isActive)
  // ============================================
  const adminNavItems: NavItem[] = [
    // ---- Main ----
    {
      icon: <FaChartBar />,
      label: 'لوحة التحكم',
      path: '/admin/dashboard',
    },
    {
      icon: <FaUsers />,
      label: 'المستخدمين',
      path: '/admin/users',
    },

    // ---- Exchange ----
    {
      icon: <FaBullhorn />,
      label: 'تبادل الخدمات',
      path: '/admin/announcements',
    },
    {
      icon: <FaThumbtack />,
      label: 'طلبات التمييز',
      path: '/admin/featured-requests',
      badge: getFeaturedPendingBadgeCount(featuredStats),
      badgeColor: '#FFC107',
    },
    {
      icon: <FaStar />,
      label: 'التقييمات',
      path: '/admin/ratings',
    },

    // ---- Trust & Safety ----
    {
      icon: <FaFlag />,
      label: 'البلاغات',
      path: '/admin/reports',
      badge: getReportsPendingBadgeCount(reportsStats),
      badgeColor: '#DC3545',
    },
    {
      icon: <FaShieldAlt />,
      label: 'طلبات التحقق',
      path: '/admin/verification',
      badge:
        verificationStats && verificationStats.pending > 0
          ? verificationStats.pending
          : undefined,
      badgeColor: '#17A2B8',
    },

    // ---- Basma Fund ----
    {
      icon: <FaHandHoldingHeart />,
      label: 'طلبات المساعدة',
      path: '/admin/help-requests',
      badge:
        hrStats && hrStats.pending > 0 ? hrStats.pending : undefined,
      badgeColor: '#17A2B8',
    },
    {
      icon: <FaInbox />,
      label: 'طلبات التبرعات',
      path: '/admin/donation-inquiries',
      badge:
        inquiryStats && inquiryStats.new > 0
          ? inquiryStats.new
          : undefined,
      badgeColor: '#E87A20',
    },
    {
      icon: <FaTrophy />,
      label: 'إنجازات التبرعات',
      path: '/admin/donation-achievements',
    },

    // ---- Community ----
    {
      icon: <FaNewspaper />,
      label: 'منشورات المجتمع',
      path: '/admin/community-posts',
    },

    // ---- Account ----
    {
      icon: <FaUser />,
      label: 'الملف الشخصي',
      path: '/admin/profile',
    },
    {
      icon: <FaCog />,
      label: 'الإعدادات',
      path: '/admin/settings',
    },
  ];

  // ============================================
  // User nav items (raw, without isActive)
  // ============================================
  const userNavItems: NavItem[] = [
    // ---- Main ----
    {
      icon: <FaHome />,
      label: 'لوحة التحكم',
      path: '/user/dashboard',
    },

    // ---- Exchange ----
    {
      icon: <FaBullhorn />,
      label: 'خدماتي',
      path: '/user/my-announcements',
      badge: announcementCount > 0 ? announcementCount : undefined,
      badgeColor: '#E87A20',
    },
    {
      icon: <FaPlus />,
      label: 'نشر عرض أو طلب',
      path: '/user/announcements/create',
    },
    {
      icon: <FaStar />,
      label: 'طلبات التمييز',
      path: '/user/featured-requests',
    },
    {
      icon: <FaCommentDots />,
      label: 'تقييماتي',
      path: '/user/my-reviews',
    },

    // ---- Basma Fund ----
    {
      icon: <FaHandHoldingHeart />,
      label: 'طلبات المساعدة',
      path: '/user/basma-fund/help-requests',
      requiresVerification: true,
    },
    {
      icon: <FaPlus />,
      label: 'تقديم طلب مساعدة',
      path: '/user/basma-fund/help-requests/create',
      requiresVerification: true,
    },

    // ---- Community ----
    {
      icon: <FaNewspaper />,
      label: 'منشوراتي',
      path: '/user/community-posts',
      requiresVerification: true,
    },
    {
      icon: <FaPlus />,
      label: 'إنشاء منشور',
      path: '/user/community-posts/create',
      requiresVerification: true,
    },

    // ---- Trust & Safety ----
    {
      icon: <FaShieldAlt />,
      label: 'التحقق من الهوية',
      path: '/user/verify-identity',
    },

    // ---- Account ----
    {
      icon: <FaUser />,
      label: 'الملف الشخصي',
      path: '/user/profile',
    },
    {
      icon: <FaCog />,
      label: 'الإعدادات',
      path: '/user/settings',
    },
  ];

  const baseNavItems = isAdmin ? adminNavItems : userNavItems;

  // ============================================
  // ✅ Compute the deepest active path (only ONE active item)
  // ============================================
  const activeSet = useMemo(
    () =>
      computeActiveSet(
        location.pathname,
        baseNavItems.map((item) => item.path)
      ),
    [location.pathname, baseNavItems]
  );

  // Attach `isActive` to each item
  const navItems = baseNavItems.map((item) => ({
    ...item,
    isActive: activeSet.has(item.path),
  }));

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
  };

  /**
   * Handle nav click — respects verification guard.
   */
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    if (item.requiresVerification && !isVerified) {
      e.preventDefault();
      e.stopPropagation();

      requireVerification(false, {
        featureName: resolveVerificationName(item.path),
        redirectTo: item.path,
      });

      if (onClose) onClose();
      return;
    }

    if (onClose) onClose();
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getUserAvatar = (): string | null => {
    return getStorageUrl(user?.profile_image);
  };

  const userAvatar = getUserAvatar();
  const userInitials = getUserInitials();

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '100%' },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, duration: 0.3 },
    }),
  };

  // ============================================
  // Sidebar content
  // ============================================
  const sidebarContent = (
    <motion.div
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--bg-card)',
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <motion.img
            src={logo}
            alt="بصمة"
            style={{ height: '32px', width: 'auto' }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          />
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            بصمة
          </span>
        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            aria-label="إغلاق القائمة"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.08)';
              e.currentTarget.style.color = 'var(--primary-orange)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <FaTimes size={18} />
          </button>
        )}
      </div>

      {/* User Profile */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: userAvatar
              ? 'transparent'
              : isDark
              ? 'linear-gradient(135deg, #2a3a5a, #1a2a4a)'
              : 'linear-gradient(135deg, #e0d8d0, #d0c8c0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#C49A6C' : '#6B4226',
            fontSize: '16px',
            fontWeight: 700,
            flexShrink: 0,
            fontFamily: 'Cairo, sans-serif',
            border: '2px solid var(--border-color)',
          }}
        >
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={user?.name || 'مستخدم'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.style.background = isDark
                    ? 'linear-gradient(135deg, #2a3a5a, #1a2a4a)'
                    : 'linear-gradient(135deg, #e0d8d0, #d0c8c0)';
                  const fallback = document.createElement('span');
                  fallback.textContent = userInitials;
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            userInitials
          )}
        </motion.div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.name || 'مستخدم'}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.65rem',
                fontFamily: 'Cairo, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              {isAdmin ? (
                <>
                  <FaShieldAlt size={10} color="var(--primary-orange)" /> مدير
                </>
              ) : (
                <>
                  <FaUser size={10} /> عضو
                </>
              )}
            </span>
            {!isAdmin && user?.is_verified && (
              <span
                style={{
                  color: '#28A745',
                  fontSize: '0.55rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  backgroundColor: 'rgba(40,167,69,0.1)',
                  padding: '1px 8px',
                  borderRadius: '10px',
                }}
              >
                <FaCheckCircle size={8} /> موثق
              </span>
            )}

            {!isAdmin && user?.warnings && user.warnings.count > 0 && (
              <WarningBadge
                warnings={user.warnings}
                variant="chip"
                onClick={() => {
                  if (onClose) onClose();
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: '12px 12px',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {navItems.map((item, index) => {
          const isLocked = item.requiresVerification && !isVerified;

          return (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <Link
                to={item.path}
                onClick={(e) => handleNavClick(e, item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: item.isActive
                    ? 'rgba(232,122,32,0.12)'
                    : 'transparent',
                  color: item.isActive
                    ? 'var(--primary-orange)'
                    : 'var(--text-muted)',
                  textDecoration: 'none',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: item.isActive ? 700 : 500,
                  transition: 'all 0.2s ease',
                  marginBottom: '2px',
                  position: 'relative',
                  borderRight: item.isActive
                    ? '3px solid var(--primary-orange)'
                    : '3px solid transparent',
                  opacity: isLocked ? 0.75 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!item.isActive) {
                    e.currentTarget.style.backgroundColor =
                      'rgba(232,122,32,0.06)';
                    e.currentTarget.style.color = 'var(--primary-orange)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                {/* Icon container with lock overlay */}
                <span
                  style={{
                    position: 'relative',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: '1rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'inherit',
                    }}
                  >
                    {item.icon}
                  </span>

                  {isLocked && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: 1,
                      }}
                      transition={{
                        scale: {
                          duration: 2.4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                        opacity: { duration: 0.3 },
                      }}
                      title="يتطلب توثيق الهوية"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-3px',
                        marginLeft: '-4px',
                        color: '#E87A20',
                        fontSize: '9px',
                        lineHeight: 1,
                        pointerEvents: 'none',
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))',
                        zIndex: 2,
                      }}
                    >
                      <FaLock size={9} />
                    </motion.span>
                  )}
                </span>

                <span style={{ flex: 1 }}>{item.label}</span>

                {item.badge !== undefined &&
                  item.badge !== null &&
                  item.badge !== 0 && (
                    <span
                      style={{
                        backgroundColor: item.badgeColor,
                        color: '#FFFFFF',
                        fontSize: '0.6rem',
                        padding: '1px 8px',
                        borderRadius: '12px',
                        fontWeight: 600,
                        minWidth: '20px',
                        textAlign: 'center',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px 16px',
          borderTop: '1px solid var(--border-color)',
          flexShrink: 0,
        }}
      >
        <motion.button
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.06)';
            e.currentTarget.style.color = 'var(--primary-orange)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <span style={{ fontSize: '1rem' }}>
            {isDark ? <FaSun /> : <FaMoon />}
          </span>
          {isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
        </motion.button>
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease',
            marginTop: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.08)';
            e.currentTarget.style.color = '#DC3545';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <FaSignOutAlt style={{ fontSize: '1rem' }} /> تسجيل الخروج
        </motion.button>
      </div>
    </motion.div>
  );

  // ============================================
  // Desktop
  // ============================================
  if (!isMobile) {
    return (
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '280px',
          backgroundColor: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-color)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1050,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 30px var(--shadow-md)',
        }}
      >
        {sidebarContent}
      </aside>
    );
  }

  // ============================================
  // Mobile
  // ============================================
  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1040,
            touchAction: 'none',
            userSelect: 'none',
          }}
        />
      )}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '280px',
          maxWidth: '85vw',
          backgroundColor: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-color)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1050,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 30px var(--shadow-md)',
          overscrollBehavior: 'contain',
        }}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default DashboardSidebar;