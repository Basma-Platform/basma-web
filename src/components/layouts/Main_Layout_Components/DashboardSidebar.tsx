import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome, FaBullhorn, FaStar,
  FaUser, FaCog, FaSignOutAlt, FaShieldAlt,
  FaThumbtack, FaFlag, FaUsers, FaChartBar,
  FaCheckCircle, FaPlus, FaMoon, FaSun,
  FaCommentDots,
} from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../context/ThemeContext';
import { useUserAnnouncements } from '../../../hooks/useUserAnnouncements';
import { useAdminVerifications } from '../../../hooks/useAdminVerifications';
import logo from '../../../assets/logo.png';
import { motion } from 'framer-motion';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const DashboardSidebar = ({ isOpen, onClose, isMobile = false }: DashboardSidebarProps) => {
  const { user, logout } = useAuth();
  const { isDark, toggleDarkMode } = useTheme();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  // ============================================
  // Fetch announcement count for badge
  // ============================================
  const [announcementCount, setAnnouncementCount] = useState<number>(0);
  const { stats, fetchMyAnnouncements } = useUserAnnouncements();

  useEffect(() => {
    if (!isAdmin && user) {
      fetchMyAnnouncements({ per_page: 1 }).catch(() => {
        // Silent fail — badge will remain 0
      });
    }
  }, [isAdmin, user, fetchMyAnnouncements]);

  useEffect(() => {
    if (stats) {
      setAnnouncementCount(stats.total || 0);
    }
  }, [stats]);

  // Fetch number of Verification Request for Admin
  const { stats: verificationStats, fetchRequests: fetchVerificationRequests } = useAdminVerifications();

  useEffect(() => {
    if (isAdmin) {
      fetchVerificationRequests({ status: 'pending', per_page: 1 }).catch(() => {
        /* silent */
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // ✅ Admin Links
  const adminNavItems = [
    {
      icon: <FaChartBar />,
      label: 'لوحة التحكم',
      path: '/admin/dashboard',
      isActive: location.pathname === '/admin/dashboard',
    },
    {
      icon: <FaUsers />,
      label: 'المستخدمين',
      path: '/admin/users',
      isActive: location.pathname === '/admin/users',
    },
    {
      icon: <FaBullhorn />,
      label: 'الإعلانات',
      path: '/admin/announcements',
      isActive: location.pathname === '/admin/announcements',
    },
    {
      icon: <FaFlag />,
      label: 'البلاغات',
      path: '/admin/reports',
      isActive: location.pathname === '/admin/reports',
      badge: 23,
      badgeColor: '#DC3545',
    },
    {
      icon: <FaShieldAlt />,
      label: 'طلبات التحقق',
      path: '/admin/verification',
      isActive:
        location.pathname === '/admin/verification' ||
        location.pathname.startsWith('/admin/verification/'),
      badge: verificationStats?.pending || undefined,
      badgeColor: '#17A2B8',
    },
    {
      icon: <FaThumbtack />,
      label: 'الإعلانات المميزة',
      path: '/admin/featured-requests',
      isActive: location.pathname === '/admin/featured-requests',
    },
    {
      icon: <FaUser />,
      label: 'الملف الشخصي',
      path: '/admin/profile',
      isActive: location.pathname === '/admin/profile',
    },
    {
      icon: <FaCog />,
      label: 'الإعدادات',
      path: '/admin/settings',
      isActive: location.pathname === '/admin/settings',
    },
  ];

  // ✅ User Links
  // ✅ FIX 1: Separate "My Announcements" active state from "Add Announcement"
  //    - "My Announcements" should be active ONLY on /user/my-announcements
  //    - "Add Announcement" should be active ONLY on /user/announcements/create
  //    - Both should NOT be highlighted at the same time
  const userNavItems = [
    {
      icon: <FaHome />,
      label: 'لوحة التحكم',
      path: '/user/dashboard',
      isActive: location.pathname === '/user/dashboard',
    },
    {
      icon: <FaBullhorn />,
      label: 'إعلاناتي',
      path: '/user/my-announcements',
      // ✅ Active ONLY on listing page
      isActive: location.pathname === '/user/my-announcements',
      badge: announcementCount > 0 ? announcementCount : undefined,
      badgeColor: '#E87A20',
    },
    {
      icon: <FaPlus />,
      label: 'إضافة إعلان',
      path: '/user/announcements/create',
      // ✅ Active ONLY on create page
      isActive: location.pathname === '/user/announcements/create',
    },
    {
      icon: <FaStar />,
      label: 'طلبات التمييز',
      path: '/user/featured-requests',
      isActive: location.pathname === '/user/featured-requests',
    },
    // ✅ FIX 2: New link — My Reviews (under Featured Requests)
    {
      icon: <FaCommentDots />,
      label: 'تقييماتي',
      path: '/user/my-reviews',
      isActive: location.pathname === '/user/my-reviews',
    },
    {
      icon: <FaShieldAlt />,
      label: 'التحقق من الهوية',
      path: '/user/verify-identity',
      isActive: location.pathname === '/user/verify-identity',
    },
    {
      icon: <FaUser />,
      label: 'الملف الشخصي',
      path: '/user/profile',
      isActive: location.pathname === '/user/profile',
    },
    {
      icon: <FaCog />,
      label: 'الإعدادات',
      path: '/user/settings',
      isActive: location.pathname === '/user/settings',
    },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getUserAvatar = (): string | null => {
    if (user?.profile_image) {
      if (user.profile_image.startsWith('http')) {
        return user.profile_image;
      }
      return `http://localhost:8000/storage/${user.profile_image}`;
    }
    return null;
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
      transition: { delay: i * 0.04, duration: 0.3 },
    }),
  };

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
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
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
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ✕
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
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
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map((item, index) => (
          <motion.div key={index} custom={index} initial="hidden" animate="visible" variants={itemVariants}>
            <Link
              to={item.path}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: item.isActive ? 'rgba(232,122,32,0.12)' : 'transparent',
                color: item.isActive ? 'var(--primary-orange)' : 'var(--text-muted)',
                textDecoration: 'none',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                fontWeight: item.isActive ? 700 : 500,
                transition: 'all 0.2s ease',
                marginBottom: '2px',
                position: 'relative',
                borderRight: item.isActive ? '3px solid var(--primary-orange)' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!item.isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.06)';
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
              <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center', flexShrink: 0 }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
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
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
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
          <span style={{ fontSize: '1rem' }}>{isDark ? <FaSun /> : <FaMoon />}</span>
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

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1040,
            backdropFilter: 'blur(4px)',
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
    </>
  );
};

export default DashboardSidebar;