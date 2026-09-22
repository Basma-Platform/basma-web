import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBan,
  FaClock,
  FaCompass,
  FaHeadset,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAccountStatus } from '../../context/AccountStatusContext';
import { useAuth } from '../../hooks/useAuth';
import {
  formatDaysRemaining,
  formatSuspendedUntil,
} from '../../utils/warningHelpers';

// ============================================
// Timing constants
// ============================================
const AUTO_LOGOUT_DELAY_MS = 8000;   // grace period before auto-logout
const SUPPRESS_WINDOW_MS = 5000;     // how long to block modal re-open after logout

// ============================================
// Countdown utilities
// ============================================

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** true ONLY when a valid target date exists AND is in the past */
  expired: boolean;
}

function computeRemaining(target?: string | null): Remaining {
  if (!target) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };
  }
  const diff = new Date(target).getTime() - Date.now();
  if (Number.isNaN(diff)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };
  }
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, expired: false };
}

const useCountdown = (targetDate: string | null | undefined) => {
  const [remaining, setRemaining] = useState<Remaining>(() =>
    computeRemaining(targetDate)
  );

  useEffect(() => {
    setRemaining(computeRemaining(targetDate));
    if (!targetDate) return;

    const interval = setInterval(() => {
      setRemaining(computeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return remaining;
};

const useAutoLogoutCountdown = (enabled: boolean, totalMs: number) => {
  const [secondsLeft, setSecondsLeft] = useState(
    Math.max(0, Math.ceil(totalMs / 1000))
  );

  useEffect(() => {
    if (!enabled) {
      setSecondsLeft(Math.max(0, Math.ceil(totalMs / 1000)));
      return;
    }

    setSecondsLeft(Math.max(0, Math.ceil(totalMs / 1000)));

    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, totalMs]);

  return secondsLeft;
};

const pad = (n: number) => String(n).padStart(2, '0');

// ============================================
// Modal
// ============================================

const AccountStatusModal = () => {
  const { status, dismiss, suppress } = useAccountStatus();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const isOpen = !!status;
  const variant = status?.variant ?? 'blocked';
  const isSuspended = variant === 'suspended';
  const fromSession = !!status?.fromSession;

  const countdown = useCountdown(
    isSuspended ? status?.suspended_until : null
  );

  const secondsBeforeLogout = useAutoLogoutCountdown(
    isOpen && fromSession,
    AUTO_LOGOUT_DELAY_MS
  );

  // Track how long the modal has been open for this specific payload.
  const openedAtRef = useRef<number | null>(null);
  useEffect(() => {
    if (isOpen) {
      openedAtRef.current = Date.now();
    } else {
      openedAtRef.current = null;
    }
  }, [isOpen]);

  // Auto-dismiss if suspension expires WHILE the modal is open.
  useEffect(() => {
    if (!isSuspended || !isOpen) return;
    if (!status?.suspended_until) return;
    if (!countdown.expired) return;

    const openedAt = openedAtRef.current;
    if (!openedAt) return;
    if (Date.now() - openedAt < 1000) return;

    dismiss();
  }, [
    isSuspended,
    isOpen,
    status?.suspended_until,
    countdown.expired,
    dismiss,
  ]);

  // ============================================
  // Auto-logout when triggered mid-session
  // ============================================
  // Sequence:
  //  1. suppress(5s) → block modal re-open during logout + navigate
  //  2. dismiss()    → close the modal
  //  3. await logout → wait for session invalidation
  //  4. navigate('/') → by the time the new page mounts, cookie is gone
  useEffect(() => {
    if (!isOpen || !fromSession) return;

    const timer = setTimeout(async () => {
      // ✅ Suppress for 5s — long enough to cover logout + navigate + mount
      suppress(SUPPRESS_WINDOW_MS);

      dismiss();

      try {
        await logout();
      } catch {
        // Ignore — we're redirecting anyway
      }

      navigate('/', { replace: true });
    }, AUTO_LOGOUT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isOpen, fromSession, suppress, dismiss, logout, navigate]);

  if (!isOpen || !status) return null;

  // ============================================
  // Theme per variant
  // ============================================
  const theme = isSuspended
    ? {
        accent: '#FF9800',
        gradient: 'linear-gradient(135deg, #FF9800, #E87A20)',
        bg: 'rgba(255,152,0,0.08)',
        border: 'rgba(255,152,0,0.3)',
        Icon: FaClock,
        title: 'تم تعليق حسابك بشكل مؤقت',
        subtitle:
          'يرجى مراجعة بريدك الإلكتروني للاطلاع على تفاصيل التعليق، أو التواصل مع الدعم لمزيد من المعلومات.',
      }
    : {
        accent: '#DC3545',
        gradient: 'linear-gradient(135deg, #DC3545, #B02A37)',
        bg: 'rgba(220,53,69,0.08)',
        border: 'rgba(220,53,69,0.3)',
        Icon: FaBan,
        title: 'تم حظر حسابك',
        subtitle:
          'يرجى مراجعة بريدك الإلكتروني للاطلاع على تفاصيل الحظر، أو التواصل مع الدعم لمزيد من المعلومات.',
      };

  const Icon = theme.Icon;

  // ============================================
  // Actions
  // ============================================

  /**
   * Browse as guest:
   * - suppress modal briefly so logout's own 403 doesn't re-trigger it
   * - dismiss
   * - await logout()
   * - navigate to home
   */
  const handleBrowseAsGuest = async () => {
    suppress(SUPPRESS_WINDOW_MS);
    dismiss();
    try {
      await logout();
    } catch {
      // Ignore — navigating away anyway
    }
    navigate('/', { replace: true });
  };

  // ============================================
  // Render
  // ============================================
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          direction: 'rtl',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.94 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: '520px',
            maxHeight: '92vh',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 28px 70px rgba(0,0,0,0.45)',
            overflow: 'hidden',
            fontFamily: 'Cairo, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Body */}
          <div
            style={{
              padding: '2.25rem 1.75rem 1.5rem',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {/* Animated icon */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1.35rem',
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{
                  scale: [1, 1.06, 1],
                  rotate: [0, -3, 3, 0],
                  y: [0, -3, 0],
                }}
                transition={{
                  scale: {
                    repeat: Infinity,
                    duration: 3,
                    ease: 'easeInOut',
                  },
                  rotate: {
                    repeat: Infinity,
                    duration: 4,
                    ease: 'easeInOut',
                  },
                  y: {
                    repeat: Infinity,
                    duration: 2.5,
                    ease: 'easeInOut',
                  },
                  default: { type: 'spring', stiffness: 260, damping: 18 },
                }}
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  background: theme.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: `0 12px 32px ${theme.accent}55`,
                }}
              >
                <Icon size={38} />
              </motion.div>
            </div>

            {/* Title */}
            <h3
              style={{
                textAlign: 'center',
                fontSize: '1.35rem',
                fontWeight: 900,
                color: theme.accent,
                margin: '0 0 10px',
                lineHeight: 1.35,
              }}
            >
              {theme.title}
            </h3>

            {/* Subtitle */}
            <p
              style={{
                textAlign: 'center',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                lineHeight: 1.75,
                margin: '0 0 1.5rem',
              }}
            >
              {theme.subtitle}
            </p>

            {/* Countdown box */}
            {isSuspended && status.suspended_until && (
              <div
                style={{
                  padding: '1.1rem 1rem',
                  borderRadius: '16px',
                  backgroundColor: theme.bg,
                  border: `1px solid ${theme.border}`,
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: theme.accent,
                    marginBottom: '12px',
                  }}
                >
                  <FaClock size={12} />
                  الوقت المتبقي حتى رفع التعليق
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <CountdownCell
                    value={countdown.days}
                    label="يوم"
                    accent={theme.accent}
                  />
                  <CountdownCell
                    value={countdown.hours}
                    label="ساعة"
                    accent={theme.accent}
                  />
                  <CountdownCell
                    value={countdown.minutes}
                    label="دقيقة"
                    accent={theme.accent}
                  />
                  <CountdownCell
                    value={countdown.seconds}
                    label="ثانية"
                    accent={theme.accent}
                  />
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.55,
                  }}
                >
                  <div>
                    تاريخ رفع التعليق المتوقع:{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      {formatSuspendedUntil(status.suspended_until)}
                    </strong>
                  </div>
                  {typeof status.days_remaining === 'number' && (
                    <div style={{ marginTop: '4px', opacity: 0.85 }}>
                      ({formatDaysRemaining(status.days_remaining)})
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact support CTA */}
            <Link
              to="/contact"
              onClick={handleBrowseAsGuest}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px 18px',
                borderRadius: '14px',
                backgroundColor: theme.bg,
                border: `1.5px solid ${theme.border}`,
                color: theme.accent,
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.88rem',
                fontWeight: 800,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                minHeight: '52px',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.accent}1A`;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.bg;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FaHeadset size={16} />
              تواصل مع الدعم لمزيد من التفاصيل
            </Link>

            {/* Footer message */}
            {fromSession ? (
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  color: theme.accent,
                  lineHeight: 1.6,
                  margin: '1rem 0 0',
                  fontWeight: 700,
                }}
              >
                سيتم إنهاء جلستك تلقائياً خلال{' '}
                <span
                  style={{
                    fontFamily:
                      "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {secondsBeforeLogout}
                </span>{' '}
                {secondsBeforeLogout === 1 ? 'ثانية' : 'ثوانٍ'}...
              </p>
            ) : (
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  margin: '1rem 0 0',
                  opacity: 0.75,
                }}
              >
                {isSuspended
                  ? 'سيتم رفع التعليق تلقائياً عند انتهاء المدة.'
                  : 'لا يمكن رفع الحظر إلا من خلال فريق الدعم.'}
              </p>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '1.1rem 1.5rem 1.25rem',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-input)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <motion.button
              type="button"
              onClick={handleBrowseAsGuest}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%',
                maxWidth: '320px',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: theme.gradient,
                color: '#FFFFFF',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: `0 6px 20px ${theme.accent}40`,
                minHeight: '46px',
              }}
            >
              <FaCompass size={14} />
              تصفّح المنصة كزائر
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// Helpers
// ============================================

const CountdownCell = ({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent: string;
}) => (
  <div
    style={{
      padding: '10px 4px',
      borderRadius: '10px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        fontSize: '1.5rem',
        fontWeight: 900,
        color: accent,
        lineHeight: 1,
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        fontVariantNumeric: 'tabular-nums',
        direction: 'ltr',
        marginBottom: '4px',
      }}
    >
      {pad(value)}
    </div>
    <div
      style={{
        fontSize: '0.65rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
      }}
    >
      {label}
    </div>
  </div>
);

export default AccountStatusModal;