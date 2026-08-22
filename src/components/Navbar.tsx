/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { path: "/", label: "الرئيسية" },
  { path: "/announcements", label: "الإعلانات" },
  { path: "/about", label: "من نحن" },
  { path: "/faq", label: "الأسئلة الشائعة" },
  { path: "/contact", label: "اتصل بنا" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark: darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated: isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  // Scroll shadow/opacity effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Lock body scroll + close on Escape while drawer is open
  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKeyDown);

      return () => {
        document.body.style.overflow = prevOverflow;
        document.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [open]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className={`site-navbar ${scrolled ? "is-scrolled" : ""} ${darkMode ? "is-dark" : ""}`}
      >
        <div className="site-navbar__inner">
          {/* Brand */}
          <Link
            to="/"
            className="site-navbar__brand"
            aria-label="بصمة - الصفحة الرئيسية"
          >
            <img src={logo} alt="بصمة" className="site-navbar__logo" />
            <span className="site-navbar__wordmark">بصمة</span>
          </Link>

          {/* Desktop links */}
          <nav className="site-navbar__links" aria-label="القائمة الرئيسية">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`site-navbar__link ${isActive(link.path) ? "is-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="site-navbar__actions">
            <button
              onClick={toggleDarkMode}
              className="site-navbar__icon-btn"
              aria-label={
                darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"
              }
              type="button"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="site-navbar__btn site-navbar__btn--ghost"
                >
                  لوحة التحكم
                </Link>
                <button
                  className="site-navbar__btn site-navbar__btn--danger"
                  type="button"
                  onClick={handleLogout}
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
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
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="site-navbar__toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            type="button"
          >
            {open ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </header>

      {/* Spacer so fixed header doesn't cover content */}
      <div className="site-navbar__spacer" aria-hidden="true" />

      {/* Mobile backdrop */}
      <div
        className={`site-navbar__backdrop ${open ? "is-visible" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={`site-navbar__drawer ${open ? "is-open" : ""} ${darkMode ? "is-dark" : ""}`}
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
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className={`site-navbar__drawer-link ${isActive(link.path) ? "is-active" : ""}`}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
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
            <span>{darkMode ? "الوضع الفاتح" : "الوضع الداكن"}</span>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="site-navbar__btn site-navbar__btn--ghost site-navbar__btn--block"
              >
                لوحة التحكم
              </Link>
              <button
                className="site-navbar__btn site-navbar__btn--danger site-navbar__btn--block"
                type="button"
                onClick={handleLogout}
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

      {/* Scoped styles — every selector below is prefixed with .site-navbar / .site-navbar__drawer
          so nothing here can leak onto other pages or components. */}
      <style>{`
        :root {
          --nav-h: 70px;
        }

        .site-navbar {
          position: fixed;
          top: 0;
          inset-inline: 0;
          width: 100%;
          max-width: 100vw;
          z-index: 1050;
          height: var(--nav-h);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(139, 90, 43, 0.1);
          transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .site-navbar.is-scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }
        .site-navbar.is-dark {
          background: rgba(26, 26, 46, 0.9);
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }
        .site-navbar.is-dark.is-scrolled {
          background: rgba(26, 26, 46, 0.98);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
        }
        .site-navbar__spacer {
          height: var(--nav-h);
        }

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

        .site-navbar__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .site-navbar__logo {
          height: 38px;
          width: auto;
          display: block;
        }
        .site-navbar.is-dark .site-navbar__logo,
        .site-navbar__drawer.is-dark .site-navbar__logo {
          filter: brightness(0) invert(1);
        }
        .site-navbar__wordmark {
          font-family: 'Cairo', sans-serif;
          font-weight: 900;
          font-size: clamp(19px, 2vw, 23px);
          color: #6B4226;
          line-height: 1;
        }
        .site-navbar.is-dark .site-navbar__wordmark {
          color: #FDF5E6;
        }

        /* Desktop nav links */
        .site-navbar__links {
          display: none;
        }
        .site-navbar__link {
          position: relative;
          font-family: 'Cairo', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #6B4226;
          text-decoration: none;
          padding: 8px 4px;
          transition: color 0.2s ease;
        }
        .site-navbar.is-dark .site-navbar__link {
          color: #C49A6C;
        }
        .site-navbar__link::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 2px;
          border-radius: 2px;
          background: #E87A20;
          transform: scaleX(0);
          transition: transform 0.25s ease;
        }
        .site-navbar__link:hover {
          color: #E87A20;
        }
        .site-navbar__link:hover::after {
          transform: scaleX(1);
        }
        .site-navbar__link.is-active {
          color: #E87A20;
          font-weight: 700;
        }
        .site-navbar__link.is-active::after {
          transform: scaleX(1);
        }

        /* Buttons (shared desktop + drawer) */
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
          background: #E87A20;
          border-color: #E87A20;
          color: #fff;
        }
        .site-navbar__btn--solid:hover {
          background: #D46A1A;
          border-color: #D46A1A;
          color: #fff;
          transform: translateY(-1px);
        }
        .site-navbar__btn--outline {
          background: transparent;
          border-color: #E87A20;
          color: #E87A20;
        }
        .site-navbar__btn--outline:hover {
          background: #E87A20;
          color: #fff;
        }
        .site-navbar__btn--ghost {
          background: rgba(139, 90, 43, 0.08);
          color: #6B4226;
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
        .site-navbar__btn--block {
          width: 100%;
        }

        .site-navbar__icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: #6B4226;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.3s ease;
        }
        .site-navbar.is-dark .site-navbar__icon-btn,
        .site-navbar__drawer.is-dark .site-navbar__icon-btn {
          color: #FDF5E6;
        }
        .site-navbar__icon-btn:hover {
          background: rgba(232, 122, 32, 0.12);
          transform: rotate(15deg);
        }

        .site-navbar__actions {
          display: none;
          align-items: center;
          gap: 10px;
        }

        /* Hamburger (mobile default) */
        .site-navbar__toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #6B4226;
          cursor: pointer;
        }
        .site-navbar.is-dark .site-navbar__toggle {
          color: #FDF5E6;
        }
        .site-navbar__toggle:hover {
          background: rgba(232, 122, 32, 0.1);
        }

        /* Backdrop */
        .site-navbar__backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 1060;
        }
        .site-navbar__backdrop.is-visible {
          opacity: 1;
          pointer-events: auto;
        }

        /* Drawer (mobile) */
        .site-navbar__drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(85vw, 360px);
          background: #FFFFFF;
          z-index: 1070;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -8px 0 40px rgba(0, 0, 0, 0.15);
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
        }
        .site-navbar__drawer.is-dark {
          background: #16213e;
        }
         
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
          border-bottom: 1px solid rgba(139, 90, 43, 0.12);
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
          color: #6B4226;
          text-decoration: none;
          padding: 14px 12px;
          border-radius: 10px;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .site-navbar__drawer.is-dark .site-navbar__drawer-link {
          color: #C49A6C;
        }
        .site-navbar__drawer-link:hover {
          background: rgba(232, 122, 32, 0.08);
          color: #E87A20;
        }
        .site-navbar__drawer-link.is-active {
          background: rgba(232, 122, 32, 0.12);
          color: #E87A20;
          font-weight: 700;
        }

        .site-navbar__drawer-footer {
          padding: 16px 20px 24px;
          border-top: 1px solid rgba(139, 90, 43, 0.12);
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
          color: #6B4226;
          cursor: pointer;
        }
        .site-navbar__drawer.is-dark .site-navbar__theme-row {
          color: #FDF5E6;
        }

        /* ---- Breakpoints ---- */

        /* Tablet: slightly tighter horizontal padding */
        @media (max-width: 767px) {
          .site-navbar__inner {
            padding: 0 14px;
          }
          .site-navbar__logo {
            height: 34px;
          }
        }

        /* Desktop (>=992px): show inline nav + actions, hide hamburger/drawer */
        @media (min-width: 992px) {
          .site-navbar__links {
            display: flex;
            align-items: center;
            gap: 28px;
          }
          .site-navbar__actions {
            display: flex;
          }
          .site-navbar__toggle,
          .site-navbar__backdrop,
          .site-navbar__drawer {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .site-navbar__drawer,
          .site-navbar__backdrop,
          .site-navbar__icon-btn,
          .site-navbar__link::after {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
