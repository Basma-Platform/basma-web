import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaChevronDown,
} from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorageUrl } from '../../../utils/storageHelpers';
import NotificationsDropdown from './NotificationsDropdown';
import WarningBadge from '../../shared/WarningBadge';

interface DashboardHeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
}

const DashboardHeader = ({
  title = 'لوحة التحكم',
  onToggleSidebar,
}: DashboardHeaderProps) => {
  const { user, logout } = useAuth();
  const { isDark, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ============================================
  // Detect touch device
  // ============================================
  useEffect(() => {
    const checkTouch =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(checkTouch);
  }, []);

  // ============================================
  // Scroll effect
  // ============================================
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ============================================
  // Close dropdown on route change
  // ============================================
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  // ============================================
  // Close dropdown on outside click / tap
  // ============================================
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [dropdownOpen]);

  // ============================================
  // Close dropdown on Escape key
  // ============================================
  useEffect(() => {
    if (!dropdownOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dropdownOpen]);

  // ============================================
  // Cleanup hover timeout on unmount
  // ============================================
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
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

  const handleToggleClick = useCallback(() => {
    setDropdownOpen((prev) => !prev);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setDropdownOpen(true);
  }, [isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 180);
  }, [isTouchDevice]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-card)',
        borderBottom: scrolled
          ? '1px solid var(--border-color)'
          : '1px solid transparent',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 20px var(--shadow-sm)' : 'none',
      }}
    >
      {/* Left: Toggle + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <motion.button
          onClick={onToggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="القائمة"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '10px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </motion.button>

        <span
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: 700,
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          {title}
        </span>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Theme Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.1, rotate: 20 }}
          whileTap={{ scale: 0.9 }}
          aria-label="تبديل الوضع"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {isDark ? <FaSun /> : <FaMoon />}
        </motion.button>

        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* User Dropdown */}
        <div
          ref={dropdownRef}
          style={{ position: 'relative' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.button
            type="button"
            onClick={handleToggleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            aria-label="قائمة المستخدم"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px 4px 16px',
              borderRadius: '30px',
              border: `1px solid ${
                dropdownOpen ? 'var(--primary-orange)' : 'var(--border-color)'
              }`,
              background: dropdownOpen
                ? 'rgba(232,122,32,0.06)'
                : 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '34px',
                height: '34px',
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
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
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
            </div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {user?.name?.split(' ')[0] || 'مستخدم'}
            </span>

            {/* ✅ Warning badge */}
            <WarningBadge
              warnings={user?.warnings}
              variant="icon"
              onClick={() => navigate('/user/profile')}
            />

            <motion.div
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronDown size={10} style={{ opacity: 0.5 }} />
            </motion.div>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                role="menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  minWidth: '220px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '14px',
                  boxShadow: '0 12px 48px var(--shadow-md)',
                  border: '1px solid var(--border-color)',
                  padding: '6px',
                  zIndex: 1000,
                  direction: 'rtl',
                }}
              >
                <Link
                  to={
                    user?.role === 'admin'
                      ? '/admin/profile'
                      : '/user/profile'
                  }
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(232,122,32,0.06)';
                    e.currentTarget.style.color = 'var(--primary-orange)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <FaUser size={14} />
                  الملف الشخصي
                </Link>
                <Link
                  to={
                    user?.role === 'admin'
                      ? '/admin/settings'
                      : '/user/settings'
                  }
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(232,122,32,0.06)';
                    e.currentTarget.style.color = 'var(--primary-orange)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <FaCog size={14} />
                  الإعدادات
                </Link>
                <div
                  style={{
                    height: '1px',
                    margin: '6px 10px',
                    backgroundColor: 'var(--border-color)',
                  }}
                />
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    color: '#DC3545',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(220,53,69,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <FaSignOutAlt size={14} />
                  تسجيل الخروج
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;