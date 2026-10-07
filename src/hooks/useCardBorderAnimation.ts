import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// Detect hover-capable devices (once, cached)
// ============================================
let cachedCanHover: boolean | null = null;
let mediaQueryRef: MediaQueryList | null = null;

const getCanHover = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;

  if (cachedCanHover !== null) return cachedCanHover;

  if (!mediaQueryRef) {
    mediaQueryRef = window.matchMedia('(hover: hover) and (pointer: fine)');
  }
  cachedCanHover = mediaQueryRef.matches;
  return cachedCanHover;
};

const useCanHover = () => {
  // ✅ Initialize from cache on first render — no flicker, no effect churn
  const [canHover, setCanHover] = useState<boolean>(() => getCanHover());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    if (!mediaQueryRef) {
      mediaQueryRef = window.matchMedia('(hover: hover) and (pointer: fine)');
    }

    // Sync in case the media query changed between module init and mount
    if (mediaQueryRef.matches !== canHover) {
      setCanHover(mediaQueryRef.matches);
    }

    const handler = (e: MediaQueryListEvent) => {
      cachedCanHover = e.matches;
      setCanHover(e.matches);
    };

    if (mediaQueryRef.addEventListener) {
      mediaQueryRef.addEventListener('change', handler);
      return () => mediaQueryRef!.removeEventListener('change', handler);
    } else {
      // @ts-ignore — legacy Safari
      mediaQueryRef.addListener(handler);
      // @ts-ignore
      return () => mediaQueryRef!.removeListener(handler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return canHover;
};

// ============================================
// Main hook
// ============================================
interface UseCardBorderAnimationOptions {
  /** Threshold for IntersectionObserver on touch devices (default 0.3) */
  threshold?: number;
  /** rootMargin for IntersectionObserver (default '-40px 0px') */
  rootMargin?: string;
  /** Fire only once on touch devices (default true) */
  triggerOnce?: boolean;
  /**
   * Disable the hook entirely (e.g., when filters are being applied).
   * Returns isDrawn = false, attachRef = noop, hoverHandlers = {}
   */
  disabled?: boolean;
}

/**
 * Hook that drives the animated border on a card.
 *
 * ✅ Uses a MANUAL IntersectionObserver (NOT useInView from the library)
 *    to avoid re-mount storms when rendered in a list.
 *
 * ✅ On hover-capable devices → the observer is NEVER created.
 *    Only `mouseenter` / `mouseleave` drive the animation.
 *
 * ✅ The `attachRef` callback is stable — React won't re-mount the element.
 */
export const useCardBorderAnimation = (
  options: UseCardBorderAnimationOptions = {}
) => {
  const {
    threshold = 0.3,
    rootMargin = '-40px 0px',
    triggerOnce = true,
    disabled = false,
  } = options;

  const canHover = useCanHover();
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);

  // ✅ Stable DOM node ref
  const nodeRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasFiredRef = useRef(false);

  // ============================================
  // Stable hover handlers
  // ============================================
  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    setHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    setHovered(false);
  }, [disabled]);

  // ============================================
  // Stable attachRef — called ONCE per mount by React
  // ============================================
  const attachRef = useCallback(
    (node: HTMLElement | null) => {
      nodeRef.current = node;

      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // ✅ Skip observer entirely on hover devices OR when disabled
      if (!node || canHover || disabled) return;

      // Touch device → create ONE observer for this card
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;

          if (entry.isIntersecting) {
            setInView(true);
            if (triggerOnce) {
              hasFiredRef.current = true;
              observerRef.current?.disconnect();
              observerRef.current = null;
            }
          } else if (!triggerOnce) {
            setInView(false);
          }
        },
        { threshold, rootMargin }
      );

      observerRef.current.observe(node);
    },
    [canHover, disabled, threshold, rootMargin, triggerOnce]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  // ============================================
  // Compute isDrawn
  // ============================================
  const isDrawn = disabled ? false : canHover ? hovered : inView;

  const hoverHandlers = canHover && !disabled
    ? {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      }
    : {};

  return {
    attachRef,
    /** @deprecated use attachRef */
    ref: attachRef,
    isDrawn,
    canHover,
    hoverHandlers,
  };
};

export default useCardBorderAnimation;