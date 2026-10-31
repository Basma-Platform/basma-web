import { useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface PillarParticlesProps {
  /** Whether particles should be active */
  active: boolean;
  /** Base color for particles */
  color: string;
  /** Number of particles (default 10) */
  count?: number;
}

/**
 * Decorative particles that rise from the base of a pillar while it's
 * hovered. Purely visual — no interaction.
 *
 * FIX: the previous version called Math.random() inside the animate prop
 * (a new target on every render) and animated `x` between a "%" string
 * and a `calc(...)` string, which Framer Motion cannot interpolate.
 * Everything random is now generated once in useMemo, `left` is static,
 * and motion only animates numeric px values.
 */
const PillarParticles = ({
  active,
  color,
  count = 10,
}: PillarParticlesProps) => {
  const reduceMotion = useReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: 8 + Math.random() * 84,
        size: 3 + Math.random() * 3,
        delay: Math.random() * 0.8,
        duration: 2.4 + Math.random() * 1.6,
        rise: 140 + Math.random() * 120,
        drift: (Math.random() - 0.5) * 36,
      })),
    [count]
  );

  if (reduceMotion) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <AnimatePresence>
        {active &&
          particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                y: -p.rise,
                x: p.drift,
                scale: [0, 1.2, 1, 0.4],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeOut',
                repeat: Infinity,
                repeatDelay: 0.3,
              }}
              style={{
                position: 'absolute',
                left: `${p.left}%`,
                bottom: '6%',
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 ${p.size * 3}px ${color}`,
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  );
};

export default PillarParticles;
