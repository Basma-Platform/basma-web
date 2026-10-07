import { motion } from 'framer-motion';

// ============================================
// Types
// ============================================

/**
 * Which side of the card the animated border lives on.
 *
 *   'top'    → horizontal bar at the very top
 *   'bottom' → horizontal bar at the very bottom
 *   'right'  → vertical bar on the right edge (RTL-friendly)
 *   'left'   → vertical bar on the left edge
 */
export type BorderSide = 'top' | 'bottom' | 'right' | 'left';

/**
 * Where the border draws FROM.
 *
 *   'start'     → from the "start" edge (right in RTL, left in LTR)
 *   'end'       → from the "end" edge (left in RTL, right in LTR)
 *   'center'    → from the middle outward
 *   'both-ends' → from both edges toward the middle
 *
 * Note: For semantic RTL correctness, use 'start'/'end' instead of
 * hardcoded left/right wherever possible.
 */
export type BorderDrawFrom = 'start' | 'end' | 'center' | 'both-ends';

export interface AnimatedCardBorderProps {
  /** When true, the border animates to full; when false, fades to idleOpacity */
  isDrawn: boolean;

  /** Which side the border is rendered on. Default: 'top' */
  side?: BorderSide;

  /** CSS background value: solid color, gradient, etc. */
  background: string;

  /** Where the draw animation starts from. Default: 'start' */
  drawFrom?: BorderDrawFrom;

  /** Thickness in pixels. Default: 4 */
  height?: number;

  /** Animation duration in seconds. Default: 0.6 */
  duration?: number;

  /** Delay before the animation starts (seconds). Default: 0 */
  delay?: number;

  /** Opacity when idle (not drawn). Default: 0 */
  idleOpacity?: number;

  /** Round the leading corners to match the card radius. Default: false */
  rounded?: boolean;

  /** Card border-radius (px). Used only when `rounded` = true. Default: 16 */
  cardRadius?: number;

  /** Optional z-index. Default: 2 */
  zIndex?: number;
}

// ============================================
// Constants
// ============================================

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// ============================================
// Component
// ============================================

export const AnimatedCardBorder = ({
  isDrawn,
  side = 'top',
  background,
  drawFrom = 'start',
  height = 4,
  duration = 0.6,
  delay = 0,
  idleOpacity = 0,
  rounded = false,
  cardRadius = 16,
  zIndex = 2,
}: AnimatedCardBorderProps) => {
  // ============================================
  // Determine orientation
  // ============================================
  const isHorizontal = side === 'top' || side === 'bottom';

  // ============================================
  // HORIZONTAL — top / bottom
  // ============================================
  if (isHorizontal) {
    const positionStyles: React.CSSProperties =
      side === 'top'
        ? { top: 0, right: 0, left: 0 }
        : { bottom: 0, right: 0, left: 0 };

    // ---------- both-ends ----------
    if (drawFrom === 'both-ends') {
      return (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            ...positionStyles,
            height: `${height}px`,
            display: 'flex',
            overflow: 'hidden',
            borderRadius: rounded
              ? side === 'top'
                ? `${cardRadius}px ${cardRadius}px 0 0`
                : `0 0 ${cardRadius}px ${cardRadius}px`
              : undefined,
            pointerEvents: 'none',
            zIndex,
          }}
        >
          <motion.div
            initial={{ scaleX: idleOpacity }}
            animate={{ scaleX: isDrawn ? 1 : idleOpacity }}
            transition={{ duration, ease: EASE_OUT_EXPO, delay }}
            style={{
              flex: '1 1 0',
              height: '100%',
              background,
              transformOrigin: 'right center', // RTL start
            }}
          />
          <motion.div
            initial={{ scaleX: idleOpacity }}
            animate={{ scaleX: isDrawn ? 1 : idleOpacity }}
            transition={{ duration, ease: EASE_OUT_EXPO, delay }}
            style={{
              flex: '1 1 0',
              height: '100%',
              background,
              transformOrigin: 'left center', // RTL end
            }}
          />
        </div>
      );
    }

    // ---------- start / end / center ----------
    // In RTL, "start" = right edge, "end" = left edge
    const transformOrigin =
      drawFrom === 'start'
        ? 'right center'
        : drawFrom === 'end'
          ? 'left center'
          : 'center center';

    return (
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          ...positionStyles,
          height: `${height}px`,
          overflow: 'hidden',
          borderRadius: rounded
            ? side === 'top'
              ? `${cardRadius}px ${cardRadius}px 0 0`
              : `0 0 ${cardRadius}px ${cardRadius}px`
            : undefined,
          pointerEvents: 'none',
          zIndex,
        }}
      >
        <motion.div
          initial={{ scaleX: idleOpacity }}
          animate={{ scaleX: isDrawn ? 1 : idleOpacity }}
          transition={{ duration, ease: EASE_OUT_EXPO, delay }}
          style={{
            height: '100%',
            width: '100%',
            background,
            transformOrigin,
          }}
        />
      </div>
    );
  }

  // ============================================
  // VERTICAL — right / left
  // ============================================
  const positionStyles: React.CSSProperties =
    side === 'right'
      ? { top: 0, bottom: 0, right: 0 }
      : { top: 0, bottom: 0, left: 0 };

  // For vertical, "start" = top (regardless of RTL), "end" = bottom
  const transformOriginVertical =
    drawFrom === 'end' ? 'center bottom' : 'center top';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        ...positionStyles,
        width: `${height}px`,
        overflow: 'hidden',
        borderRadius: rounded
          ? side === 'right'
            ? `0 ${cardRadius}px ${cardRadius}px 0`
            : `${cardRadius}px 0 0 ${cardRadius}px`
          : undefined,
        pointerEvents: 'none',
        zIndex,
        // ✅ GPU compositing — prevents layout thrashing in grids
        contain: 'layout paint style',
        willChange: 'transform',
      }}
    >
      <motion.div
        initial={{ scaleY: idleOpacity }}
        animate={{ scaleY: isDrawn ? 1 : idleOpacity }}
        transition={{ duration, ease: EASE_OUT_EXPO, delay }}
        style={{
          width: '100%',
          height: '100%',
          background,
          transformOrigin: transformOriginVertical,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
};

export default AnimatedCardBorder;