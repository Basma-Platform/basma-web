import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaExchangeAlt,
  FaHandHoldingHeart,
  FaBullhorn,
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { getDashboardPath } from '../utils/authRedirect';
import { getStorageUrl } from '../utils/storageHelpers';
import WarningBadge from './shared/WarningBadge';
import logo from '../assets/logo.png';

// ============================================
// مجتمع بصمة — 3 pillars, each with its own accent color
// ============================================
const COMMUNITY_LINKS = [
  {
    path: '/announcements',
    label: 'تبادل الخدمات',
    Icon: FaExchangeAlt,
    // Orange — the flagship pillar
    accent: '#E87A20',
    accentSoft: 'rgba(232, 122, 32, 0.10)',
    accentSoftDark: 'rgba(232, 122, 32, 0.18)',
  },
  {
    path: '/basma-fund',
    label: 'صندوق بصمة',
    Icon: FaHandHoldingHeart,
    // Teal — warmth + care
    accent: '#17A2B8',
    accentSoft: 'rgba(23, 162, 184, 0.10)',
    accentSoftDark: 'rgba(23, 162, 184, 0.18)',
  },
  {
    path: '/community',
    label: 'منشورات المجتمع',
    Icon: FaBullhorn,
    // Purple — community voice
    accent: '#9C27B0',
    accentSoft: 'rgba(156, 39, 176, 0.10)',
    accentSoftDark: 'rgba(156, 39, 176, 0.18)',
  },
];

// Simple links around the dropdown
const LINKS_BEFORE = [{ path: '/', label: 'الرئيسية' }];
const LINKS_AFTER = [
  { path: '/about', label: 'من نحن' },
  { path: '/faq', label: 'الأسئلة الشائعة' },
  { path: '/contact', label: 'اتصل بنا' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const { isDark: darkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const communityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // ============================================
  // Scroll effect
  // ============================================
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ============================================
  // Close drawer + dropdowns on route change
  // ============================================
  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
    setCommunityOpen(false);
  }, [location]);

  // ============================================
  // Close community dropdown on outside click
  // ============================================
  useEffect(() => {
    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (
        communityRef.current &&
        !communityRef.current.contains(event.target as Node)
      ) {
        setCommunityOpen(false);
      }
    };

    if (communityOpen) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('touchstart', handleOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [communityOpen]);

  const dashboardPath = getDashboardPath(user?.role);

  const isActive = (path: string) => location.pathname === path;

  // Is the user on any of the 3 community sub-routes?
  const isCommunityActive = COMMUNITY_LINKS.some(
    (link) =>
      location.pathname === link.path ||
      location.pathname.startsWith(link.path + '/')
  );

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getUserAvatar = () => {
    return getStorageUrl(user?.profile_image);
  };

  const userAvatar = getUserAvatar();
  const userInitials = getUserInitials();

  // ============================================
  // Community dropdown hover handlers
  // ============================================
  const handleCommunityEnter = () => {
    if (communityTimeoutRef.current) {
      clearTimeout(communityTimeoutRef.current);
      communityTimeoutRef.current = null;
    }
    setCommunityOpen(true);
  };

  const handleCommunityLeave = () => {
    communityTimeoutRef.current = setTimeout(() => {
      setCommunityOpen(false);
    }, 200);
  };

  // ============================================
  // User dropdown hover handlers
  // ============================================
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  // ============================================
  // Auth section
  // ============================================
  const renderAuthSection = () => {
    if (isLoading) {
      return (
        <div className="site-navbar__auth-loading">
          <div className="site-navbar__avatar-skeleton" />
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <div
          className="site-navbar__dropdown"
          ref={dropdownRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`site-navbar__dropdown-toggle ${
              dropdownOpen ? 'is-active' : ''
            }`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            type="button"
          >
            <div className="site-navbar__avatar">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={user?.name || 'مستخدم'}
                  className="site-navbar__avatar-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.className = 'site-navbar__avatar-fallback';
                      fallback.textContent = userInitials;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <span className="site-navbar__avatar-fallback">
                  {userInitials}
                </span>
              )}
            </div>
            <span className="site-navbar__username">
              {user?.name?.split(' ')[0] || 'حسابي'}
            </span>

            <WarningBadge
              warnings={user?.warnings}
              variant="icon"
              onClick={() => navigate('/user/profile')}
            />

            <FaChevronDown
              size={12}
              className={`site-navbar__dropdown-arrow ${
                dropdownOpen ? 'is-rotated' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="site-navbar__dropdown-menu">
              <div className="site-navbar__dropdown-header">
                <div className="site-navbar__dropdown-avatar">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={user?.name || 'مستخدم'}
                      className="site-navbar__dropdown-avatar-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = document.createElement('span');
                          fallback.className =
                            'site-navbar__dropdown-avatar-fallback';
                          fallback.textContent = userInitials;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <span className="site-navbar__dropdown-avatar-fallback">
                      {userInitials}
                    </span>
                  )}
                </div>
                <div className="site-navbar__dropdown-userinfo">
                  <div className="site-navbar__dropdown-name">
                    {user?.name || 'مستخدم'}
                  </div>
                  <div className="site-navbar__dropdown-email">
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="site-navbar__dropdown-divider" />

              <Link
                to={dashboardPath}
                className="site-navbar__dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <FaCog size={16} />
                <span>لوحة التحكم</span>
              </Link>

              <button
                onClick={handleLogout}
                className="site-navbar__dropdown-item site-navbar__dropdown-item--danger"
              >
                <FaSignOutAlt size={16} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <Link
          to="/login"
          className="site-navbar__btn site-navbar__btn--outline"
        >
          تسجيل الدخول
        </Link>
        <Link
          to="/register"
          className="site-navbar__btn site-navbar__btn--solid"
        >
          ابدأ الآن
        </Link>
      </>
    );
  };

  return (
    <>
      <header
        className={`site-navbar ${scrolled ? 'is-scrolled' : ''} ${
          darkMode ? 'is-dark' : ''
        }`}
      >
        <div className="site-navbar__inner">
          <Link
            to="/"
            className="site-navbar__brand"
            aria-label="بصمة - الصفحة الرئيسية"
          >
            <img src={logo} alt="بصمة" className="site-navbar__logo" />
            <span className="site-navbar__wordmark">بصمة</span>
          </Link>

          {/* ============================================ */}
          {/* Desktop navigation — community sits right after الرئيسية */}
          {/* ============================================ */}
          <nav className="site-navbar__links" aria-label="القائمة الرئيسية">
            {/* الرئيسية */}
            {LINKS_BEFORE.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`site-navbar__link ${
                  isActive(link.path) ? 'is-active' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* مجتمع بصمة — hover dropdown */}
            <div
              ref={communityRef}
              className="site-navbar__community"
              onMouseEnter={handleCommunityEnter}
              onMouseLeave={handleCommunityLeave}
            >
              <button
                type="button"
                className={`site-navbar__link site-navbar__community-toggle ${
                  isCommunityActive ? 'is-active' : ''
                } ${communityOpen ? 'is-open' : ''}`}
                aria-haspopup="menu"
                aria-expanded={communityOpen}
                onClick={() => setCommunityOpen((v) => !v)}
              >
                مجتمع بصمة
                <FaChevronDown
                  size={10}
                  className={`site-navbar__community-arrow ${
                    communityOpen ? 'is-rotated' : ''
                  }`}
                />
              </button>

              {communityOpen && (
                <div
                  className="site-navbar__community-menu"
                  role="menu"
                  aria-label="مجتمع بصمة"
                >
                  {COMMUNITY_LINKS.map(
                    ({ path, label, Icon, accent, accentSoft, accentSoftDark }) => {
                      const active =
                        location.pathname === path ||
                        location.pathname.startsWith(path + '/');
                      return (
                        <Link
                          key={path}
                          to={path}
                          role="menuitem"
                          className={`site-navbar__community-item ${
                            active ? 'is-active' : ''
                          }`}
                          onClick={() => setCommunityOpen(false)}
                          style={{
                            // Per-pillar accent passed as CSS vars
                            ['--community-accent' as any]: accent,
                            ['--community-accent-soft' as any]: darkMode
                              ? accentSoftDark
                              : accentSoft,
                          }}
                        >
                          <span className="site-navbar__community-item-icon">
                            <Icon size={14} />
                          </span>
                          <span className="site-navbar__community-item-label">
                            {label}
                          </span>
                        </Link>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* من نحن / الأسئلة الشائعة / اتصل بنا */}
            {LINKS_AFTER.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`site-navbar__link ${
                  isActive(link.path) ? 'is-active' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="site-navbar__actions">
            <button
              onClick={toggleDarkMode}
              className="site-navbar__icon-btn"
              aria-label={
                darkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'
              }
              type="button"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {renderAuthSection()}
          </div>

          <button
            className="site-navbar__toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            type="button"
          >
            {open ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </header>

      <div className="site-navbar__spacer" aria-hidden="true" />

      <div
        className={`site-navbar__backdrop ${open ? 'is-visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ============================================ */}
      {/* Mobile drawer */}
      {/* ============================================ */}
      <div
        id="mobile-drawer"
        className={`site-navbar__drawer ${open ? 'is-open' : ''} ${
          darkMode ? 'is-dark' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="القائمة"
      >
        <div className="site-navbar__drawer-header">
          <Link
            to="/"
            className="site-navbar__brand"
            onClick={() => setOpen(false)}
          >
            <img src={logo} alt="" className="site-navbar__logo" />
            <span className="site-navbar__wordmark">بصمة</span>
          </Link>
          <button
            className="site-navbar__icon-btn"
            onClick={() => setOpen(false)}
            aria-label="إغلاق القائمة"
            type="button"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav
          className="site-navbar__drawer-links"
          aria-label="القائمة الرئيسية - جوال"
        >
          {/* الرئيسية */}
          {LINKS_BEFORE.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className={`site-navbar__drawer-link ${
                isActive(link.path) ? 'is-active' : ''
              }`}
              style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
            >
              {link.label}
            </Link>
          ))}

          {/* مجتمع بصمة — flat section, still right after الرئيسية */}
          <div className="site-navbar__drawer-section">
            <div className="site-navbar__drawer-section-title">
              مجتمع بصمة
            </div>
            {COMMUNITY_LINKS.map(
              ({ path, label, Icon, accent, accentSoft, accentSoftDark }) => {
                const active =
                  location.pathname === path ||
                  location.pathname.startsWith(path + '/');
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`site-navbar__drawer-link site-navbar__drawer-link--sub ${
                      active ? 'is-active' : ''
                    }`}
                    style={{
                      ['--community-accent' as any]: accent,
                      ['--community-accent-soft' as any]: darkMode
                        ? accentSoftDark
                        : accentSoft,
                    }}
                  >
                    <span className="site-navbar__drawer-link-icon">
                      <Icon size={14} />
                    </span>
                    {label}
                  </Link>
                );
              }
            )}
          </div>

          {/* من نحن / الأسئلة الشائعة / اتصل بنا */}
          {LINKS_AFTER.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className={`site-navbar__drawer-link ${
                isActive(link.path) ? 'is-active' : ''
              }`}
              style={{
                transitionDelay: open ? `${(i + 1) * 40}ms` : '0ms',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-navbar__drawer-footer">
          <button
            onClick={toggleDarkMode}
            className="site-navbar__theme-row"
            type="button"
          >
            <span>{darkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}</span>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {isLoading ? (
            <div className="site-navbar__drawer-loading">
              <div className="site-navbar__avatar-skeleton" />
              <div className="site-navbar__text-skeleton" />
              <div className="site-navbar__text-skeleton" />
            </div>
          ) : isAuthenticated ? (
            <>
              <div className="site-navbar__drawer-user">
                <div className="site-navbar__drawer-avatar">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={user?.name || 'مستخدم'}
                      className="site-navbar__drawer-avatar-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = document.createElement('span');
                          fallback.className =
                            'site-navbar__drawer-avatar-fallback';
                          fallback.textContent = userInitials;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <span className="site-navbar__drawer-avatar-fallback">
                      {userInitials}
                    </span>
                  )}
                </div>
                <div className="site-navbar__drawer-userinfo">
                  <div className="site-navbar__drawer-username">
                    {user?.name || 'مستخدم'}
                  </div>
                  <div className="site-navbar__drawer-useremail">
                    {user?.email}
                  </div>
                </div>

                <WarningBadge
                  warnings={user?.warnings}
                  variant="chip"
                  onClick={() => {
                    setOpen(false);
                    navigate('/user/profile');
                  }}
                />
              </div>

              <Link
                to={dashboardPath}
                className="site-navbar__btn site-navbar__btn--ghost site-navbar__btn--block"
              >
                لوحة التحكم
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="site-navbar__btn site-navbar__btn--danger site-navbar__btn--block"
                type="button"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="site-navbar__btn site-navbar__btn--outline site-navbar__btn--block"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="site-navbar__btn site-navbar__btn--solid site-navbar__btn--block"
              >
                ابدأ الآن
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* Styles */}
      {/* ============================================ */}
      <style>{`
        :root { --nav-h: 70px; }

        /* ============================================ */
        /* NAVBAR BASE */
        /* ============================================ */
        .site-navbar {
          position: fixed;
          top: 0;
          inset-inline: 0;
          width: 100%;
          max-width: 100vw;
          z-index: 1050;
          height: var(--nav-h);
          background: var(--bg-navbar);
          backdrop-filter: blur(10px);
          border-bottom: none;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .site-navbar.is-scrolled {
          background: var(--bg-navbar);
          box-shadow: 0 4px 24px var(--shadow-sm);
        }
        .site-navbar.is-dark {
          background: var(--bg-navbar);
        }
        .site-navbar.is-dark.is-scrolled {
          background: var(--bg-navbar);
          box-shadow: 0 4px 24px var(--shadow-md);
        }
        .site-navbar__spacer { height: var(--nav-h); }

        /* ============================================ */
        /* INNER */
        /* ============================================ */
        .site-navbar__inner {
          height: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* ============================================ */
        /* BRAND */
        /* ============================================ */
        .site-navbar__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .site-navbar__logo { height: 38px; width: auto; display: block; }
        .site-navbar.is-dark .site-navbar__logo,
        .site-navbar__drawer.is-dark .site-navbar__logo {
          filter: brightness(0) invert(1);
        }
        .site-navbar__wordmark {
          font-family: 'Cairo', sans-serif;
          font-weight: 900;
          font-size: clamp(19px, 2vw, 23px);
          color: var(--text-secondary);
          line-height: 1;
        }
        .site-navbar.is-dark .site-navbar__wordmark {
          color: var(--text-light);
        }

        /* ============================================ */
        /* NAV LINKS */
        /* ============================================ */
        .site-navbar__links { display: none; }
        .site-navbar__link {
          position: relative;
          font-family: 'Cairo', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 8px 4px;
          transition: color 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
        }
        .site-navbar.is-dark .site-navbar__link {
          color: var(--text-muted);
        }
        .site-navbar__link::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 2px;
          border-radius: 2px;
          background: var(--primary-orange);
          transform: scaleX(0);
          transition: transform 0.25s ease;
        }
        .site-navbar__link:hover { color: var(--primary-orange); }
        .site-navbar__link:hover::after { transform: scaleX(1); }
        .site-navbar__link.is-active {
          color: var(--primary-orange);
          font-weight: 700;
        }
        .site-navbar__link.is-active::after { transform: scaleX(1); }

        /* ============================================ */
        /* COMMUNITY DROPDOWN */
        /* ============================================ */
        .site-navbar__community {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .site-navbar__community-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 4px;
        }
        .site-navbar__community-toggle.is-open {
          color: var(--primary-orange);
        }
        .site-navbar__community-toggle.is-open::after {
          transform: scaleX(1);
        }
        .site-navbar__community-arrow {
          transition: transform 0.25s ease;
          opacity: 0.6;
        }
        .site-navbar__community-arrow.is-rotated {
          transform: rotate(180deg);
        }

        .site-navbar__community-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 260px;
          background: var(--bg-white);
          border-radius: 16px;
          box-shadow: 0 12px 48px var(--shadow-md);
          border: 1px solid var(--border-color);
          padding: 8px;
          z-index: 1000;
          direction: rtl;
          display: flex;
          flex-direction: column;
          gap: 2px;
          animation: communityFadeIn 0.2s ease;
          transform-origin: top center;
        }
        @keyframes communityFadeIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .site-navbar__community-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          font-family: 'Cairo', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.2s ease;
          position: relative;
        }
        .site-navbar.is-dark .site-navbar__community-item {
          color: var(--text-muted);
        }
        .site-navbar__community-item:hover {
          background: var(--community-accent-soft, rgba(232, 122, 32, 0.08));
          color: var(--community-accent, var(--primary-orange));
          transform: translateX(-3px);
        }
        .site-navbar__community-item.is-active {
          background: var(--community-accent-soft, rgba(232, 122, 32, 0.12));
          color: var(--community-accent, var(--primary-orange));
          font-weight: 700;
        }
        .site-navbar__community-item.is-active::before {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          border-radius: 3px;
          background: var(--community-accent, var(--primary-orange));
        }

        .site-navbar__community-item-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--community-accent-soft, rgba(232, 122, 32, 0.1));
          color: var(--community-accent, var(--primary-orange));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .site-navbar__community-item:hover .site-navbar__community-item-icon {
          transform: scale(1.08) rotate(-3deg);
        }
        .site-navbar__community-item-label {
          white-space: nowrap;
        }

        /* ============================================ */
        /* DROPDOWN (user account) */
        /* ============================================ */
        .site-navbar__dropdown {
          position: relative;
          padding-bottom: 4px;
          margin-bottom: -4px;
        }

        .site-navbar__dropdown-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 16px;
          border-radius: 40px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.25s ease;
        }
        .site-navbar.is-dark .site-navbar__dropdown-toggle {
          color: var(--text-light);
        }
        .site-navbar__dropdown-toggle:hover {
          background: rgba(232, 122, 32, 0.06);
          border-color: rgba(232, 122, 32, 0.15);
        }
        .site-navbar__dropdown-toggle.is-active {
          background: rgba(232, 122, 32, 0.08);
          border-color: rgba(232, 122, 32, 0.2);
        }

        .site-navbar__avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .site-navbar__avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .site-navbar__avatar-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: #FFFFFF;
          background: linear-gradient(135deg, var(--primary-orange), var(--primary-orange-dark));
          border-radius: 50%;
          text-transform: uppercase;
        }
        .site-navbar.is-dark .site-navbar__avatar-fallback {
          background: linear-gradient(135deg, var(--primary-orange-light), var(--primary-orange));
        }

        .site-navbar__username {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          white-space: nowrap;
          transition: color 0.3s ease;
        }
        .site-navbar.is-dark .site-navbar__username {
          color: var(--text-light);
        }

        .site-navbar__dropdown-arrow {
          transition: transform 0.25s ease;
          opacity: 0.4;
          color: inherit;
        }
        .site-navbar__dropdown-arrow.is-rotated {
          transform: rotate(180deg);
        }

        .site-navbar__dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          min-width: 240px;
          background: var(--bg-white);
          border-radius: 16px;
          box-shadow: 0 12px 48px var(--shadow-md);
          border: 1px solid var(--border-color);
          padding: 6px;
          z-index: 1000;
          direction: rtl;
          animation: dropdownFade 0.2s ease;
          transform-origin: top center;
        }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .site-navbar__dropdown-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px 10px 16px;
          border-radius: 12px;
          background: var(--bg-card);
        }
        .site-navbar__dropdown-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .site-navbar__dropdown-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .site-navbar__dropdown-avatar-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 700;
          color: #FFFFFF;
          background: linear-gradient(135deg, var(--primary-orange), var(--primary-orange-dark));
          border-radius: 50%;
          text-transform: uppercase;
        }
        .site-navbar.is-dark .site-navbar__dropdown-avatar-fallback {
          background: linear-gradient(135deg, var(--primary-orange-light), var(--primary-orange));
        }
        .site-navbar__dropdown-userinfo {
          flex: 1;
          min-width: 0;
        }
        .site-navbar__dropdown-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-secondary);
          font-family: 'Cairo', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .site-navbar__dropdown-email {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: 'Cairo', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          direction: ltr;
          text-align: left;
        }
        .site-navbar__dropdown-divider {
          height: 1px;
          margin: 6px 10px;
          background: var(--border-color);
        }
        .site-navbar__dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          color: var(--text-secondary);
          text-decoration: none;
          font-family: 'Cairo', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .site-navbar__dropdown-item:hover {
          background: rgba(232, 122, 32, 0.06);
          color: var(--primary-orange);
          transform: translateX(-4px);
        }
        .site-navbar__dropdown-item--danger {
          color: #DC3545;
        }
        .site-navbar__dropdown-item--danger:hover {
          background: rgba(220, 53, 69, 0.08);
          color: #DC3545;
        }

        /* ============================================ */
        /* BUTTONS */
        /* ============================================ */
        .site-navbar__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cairo', sans-serif;
          font-weight: 700;
          font-size: 14px;
          border-radius: 999px;
          padding: 9px 20px;
          border: 2px solid transparent;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .site-navbar__btn--solid {
          background: var(--primary-orange);
          border-color: var(--primary-orange);
          color: #fff;
        }
        .site-navbar__btn--solid:hover {
          background: var(--primary-orange-dark);
          border-color: var(--primary-orange-dark);
          color: #fff;
          transform: translateY(-1px);
        }
        .site-navbar__btn--outline {
          background: transparent;
          border-color: var(--primary-orange);
          color: var(--primary-orange);
        }
        .site-navbar__btn--outline:hover {
          background: var(--primary-orange);
          color: #fff;
        }
        .site-navbar__btn--ghost {
          background: var(--border-color);
          color: var(--text-secondary);
        }
        .site-navbar__btn--danger {
          background: transparent;
          border-color: #DC3545;
          color: #DC3545;
        }
        .site-navbar__btn--danger:hover {
          background: #DC3545;
          color: #fff;
        }
        .site-navbar__btn--block { width: 100%; }

        /* ============================================ */
        /* ICON BUTTONS */
        /* ============================================ */
        .site-navbar__icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.3s ease;
        }
        .site-navbar.is-dark .site-navbar__icon-btn,
        .site-navbar__drawer.is-dark .site-navbar__icon-btn {
          color: var(--text-light);
        }
        .site-navbar__icon-btn:hover {
          background: rgba(232, 122, 32, 0.12);
          transform: rotate(15deg);
        }

        /* ============================================ */
        /* LOADING STATES */
        /* ============================================ */
        .site-navbar__auth-loading {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 80px;
          justify-content: flex-end;
        }

        .site-navbar__avatar-skeleton {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-input);
          animation: navbarPulse 1.5s ease-in-out infinite;
        }

        .site-navbar__drawer-loading {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px 0;
        }

        .site-navbar__text-skeleton {
          width: 100%;
          height: 14px;
          border-radius: 6px;
          background: var(--bg-input);
          animation: navbarPulse 1.5s ease-in-out infinite;
        }
        .site-navbar__text-skeleton:last-child {
          width: 60%;
        }

        @keyframes navbarPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }

        .site-navbar__actions { display: none; align-items: center; gap: 10px; }

        /* ============================================ */
        /* TOGGLE & BACKDROP */
        /* ============================================ */
        .site-navbar__toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .site-navbar.is-dark .site-navbar__toggle { color: var(--text-light); }
        .site-navbar__toggle:hover { background: rgba(232, 122, 32, 0.1); }

        .site-navbar__backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 1060;
        }
        .site-navbar__backdrop.is-visible { opacity: 1; pointer-events: auto; }

        /* ============================================ */
        /* DRAWER (mobile) */
        /* ============================================ */
        .site-navbar__drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(85vw, 360px);
          background: var(--bg-white);
          z-index: 1070;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -8px 0 40px var(--shadow-md);
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
        }
        .site-navbar__drawer.is-dark { background: var(--bg-white); }
        .site-navbar__drawer.is-open {
          transform: translateX(0);
          opacity: 1;
          pointer-events: auto;
          visibility: visible;
        }

        .site-navbar__drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .site-navbar__drawer-links {
          display: flex;
          flex-direction: column;
          padding: 8px 12px;
          overflow-y: auto;
          flex: 1;
        }
        .site-navbar__drawer-link {
          font-family: 'Cairo', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 14px 12px;
          border-radius: 10px;
          transition: background-color 0.2s ease, color 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .site-navbar__drawer.is-dark .site-navbar__drawer-link {
          color: var(--text-muted);
        }
        .site-navbar__drawer-link:hover {
          background: rgba(232, 122, 32, 0.08);
          color: var(--primary-orange);
        }
        .site-navbar__drawer-link.is-active {
          background: rgba(232, 122, 32, 0.12);
          color: var(--primary-orange);
          font-weight: 700;
        }

        /* Nested community section in mobile drawer */
        .site-navbar__drawer-section {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--border-color);
        }
        .site-navbar__drawer-section-title {
          font-family: 'Cairo', sans-serif;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.6px;
          padding: 12px 12px 6px;
          opacity: 0.7;
        }
        .site-navbar__drawer-link--sub {
          font-size: 15px;
          padding: 12px 12px 12px 24px;
        }
        .site-navbar__drawer-link-icon {
          width: 26px;
          height: 26px;
          border-radius: 7px;
          background: var(--community-accent-soft, rgba(232, 122, 32, 0.1));
          color: var(--community-accent, var(--primary-orange));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .site-navbar__drawer-link--sub.is-active .site-navbar__drawer-link-icon {
          transform: scale(1.06);
        }

        .site-navbar__drawer-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--bg-card);
          border-radius: 12px;
          margin: 4px 0 8px;
        }

        .site-navbar__drawer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .site-navbar__drawer-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .site-navbar__drawer-avatar-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 700;
          color: #FFFFFF;
          background: linear-gradient(135deg, var(--primary-orange), var(--primary-orange-dark));
          border-radius: 50%;
          text-transform: uppercase;
        }

        .site-navbar__drawer-userinfo {
          flex: 1;
          min-width: 0;
        }
        .site-navbar__drawer-username {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-secondary);
          font-family: 'Cairo', sans-serif;
        }
        .site-navbar__drawer-useremail {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: 'Cairo', sans-serif;
          direction: ltr;
          text-align: left;
        }

        .site-navbar__drawer-footer {
          padding: 16px 20px 24px;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
        }
        .site-navbar__theme-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          padding: 8px 4px;
          font-family: 'Cairo', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .site-navbar__drawer.is-dark .site-navbar__theme-row {
          color: var(--text-light);
        }

        /* ============================================ */
        /* RESPONSIVE */
        /* ============================================ */
        @media (max-width: 767px) {
          .site-navbar__inner { padding: 0 14px; }
          .site-navbar__logo { height: 34px; }
        }

        @media (min-width: 992px) {
          .site-navbar__links {
            display: flex;
            align-items: center;
            gap: 24px;
          }
          .site-navbar__actions { display: flex; }
          .site-navbar__toggle,
          .site-navbar__backdrop,
          .site-navbar__drawer { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .site-navbar__drawer,
          .site-navbar__backdrop,
          .site-navbar__icon-btn,
          .site-navbar__link::after,
          .site-navbar__dropdown-menu,
          .site-navbar__dropdown-arrow,
          .site-navbar__community-menu,
          .site-navbar__community-arrow,
          .site-navbar__community-item-icon {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;