import { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import { formatDeleteCountdown } from '../../../../utils/helpRequestHelpers';

interface DeleteCountdownTimerProps {
  /** ISO datetime — the absolute deadline */
  deadline: string | null;
  /** Fallback seconds if deadline is null */
  secondsRemaining?: number | null;
  /** Called once when the countdown hits 0 */
  onExpire?: () => void;
  /** Compact chip style */
  compact?: boolean;
}

/**
 * Live countdown to the 30-minute delete window deadline.
 *
 * ✅ Ticks against the ABSOLUTE `deadline` on every tick — no drift,
 *    no dependency on a local counter. Matches the modal's countdown exactly.
 */
const DeleteCountdownTimer = ({
  deadline,
  secondsRemaining,
  onExpire,
  compact = false,
}: DeleteCountdownTimerProps) => {
  // ============================================
  // Compute from absolute deadline
  // ============================================
  const computeRemaining = (): number => {
    if (deadline) {
      const diff = new Date(deadline).getTime() - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    }
    return Math.max(0, secondsRemaining ?? 0);
  };

  const [remaining, setRemaining] = useState<number>(computeRemaining);
  const [expired, setExpired] = useState<boolean>(
    () => computeRemaining() <= 0
  );

  // ============================================
  // Tick every second — recompute from deadline
  // ============================================
  useEffect(() => {
    // Reset when the deadline prop changes
    const initial = computeRemaining();
    setRemaining(initial);
    setExpired(initial <= 0);

    if (initial <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      const next = computeRemaining();
      setRemaining(next);
      if (next <= 0) {
        clearInterval(timer);
        setExpired(true);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline, secondsRemaining]);

  if (expired || remaining <= 0) return null;

  if (compact) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          color: '#E87A20',
          fontSize: '0.68rem',
          fontWeight: 800,
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <FaClock size={9} />
        {formatDeleteCountdown(remaining)}
      </span>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '10px 12px',
        borderRadius: '11px',
        backgroundColor: 'var(--notice-warning-bg)',
        border: '1px solid var(--notice-warning-border)',
        color: 'var(--notice-warning-text)',
        fontFamily: 'Cairo, sans-serif',
        fontSize: '0.78rem',
        fontWeight: 700,
      }}
    >
      <span
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      >
        <FaClock size={11} />
        يمكنك الحذف خلال
      </span>
      <span
        style={{
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          fontVariantNumeric: 'tabular-nums',
          fontSize: '0.92rem',
          fontWeight: 900,
          letterSpacing: '0.5px',
        }}
      >
        {formatDeleteCountdown(remaining)}
      </span>
    </div>
  );
};

export default DeleteCountdownTimer;