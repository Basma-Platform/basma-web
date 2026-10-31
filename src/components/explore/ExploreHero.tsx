import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  EXPLORE_COPY,
  EXPLORE_DESIGN,
  EXPLORE_PILLARS,
} from '../../utils/exploreHelpers';

const EASE = EXPLORE_DESIGN.ease_out_expo;

const COLUMNS = [
  { cx: 62, from: '#F5A623', to: '#E87A20', delay: 0.35 },
  { cx: 120, from: '#20C9E0', to: '#17A2B8', delay: 0.5 },
  { cx: 178, from: '#BA68C8', to: '#9C27B0', delay: 0.65 },
];

const scrollToPillars = () => {
  document
    .getElementById('explore-pillars')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/**
 * A small portico: three coloured columns (one per pillar) under a
 * pediment that carries fingerprint arcs — a nod to the name "بصمة".
 * Pure SVG, no external images.
 *
 * FIX: the old illustration rendered a <FaStar /> (which is itself an
 * <svg>) inside this <svg>, producing an invalid nested element, and
 * used a dome + minarets that didn't match the "three pillars" idea.
 */
const HeroPortico = () => {
  const { isDark } = useTheme();
  const ground = isDark ? '#C49A6C' : '#8B5A2B';

  return (
    <svg
      viewBox="0 0 240 150"
      width="240"
      height="150"
      aria-hidden="true"
      style={{
        display: 'block',
        margin: '0 auto',
        maxWidth: '100%',
        height: 'auto',
      }}
    >
      <defs>
        <linearGradient id="hx-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A0682F" />
          <stop offset="100%" stopColor="#6B4226" />
        </linearGradient>
        <linearGradient id="hx-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5A2B" />
          <stop offset="100%" stopColor="#5A3820" />
        </linearGradient>
        {COLUMNS.map((c, i) => (
          <linearGradient
            key={i}
            id={`hx-col-${i}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor={c.from} />
            <stop offset="50%" stopColor={c.to} />
            <stop offset="100%" stopColor={c.from} />
          </linearGradient>
        ))}
      </defs>

      {/* Pediment */}
      <polygon points="20,52 120,10 220,52" fill="url(#hx-roof)" />

      {/* Fingerprint arcs inside the pediment */}
      {[8, 14, 20].map((r, i) => (
        <motion.path
          key={r}
          d={`M ${120 - r} 48 A ${r} ${r} 0 0 1 ${120 + r} 48`}
          fill="none"
          stroke="#FFD966"
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.95 }}
          transition={{ duration: 0.9, delay: 0.9 + i * 0.18, ease: EASE }}
        />
      ))}
      <motion.circle
        cx="120"
        cy="48"
        r="2.2"
        fill="#FFD966"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 1.4 }}
        style={{ originX: 0.5, originY: 0.5 }}
      />

      {/* Beam (architrave) */}
      <rect x="24" y="52" width="192" height="12" rx="3" fill="url(#hx-beam)" />
      <rect x="34" y="64" width="172" height="6" rx="2" fill="#4A2E1A" />

      {/* Columns — each grows up from the ground */}
      {COLUMNS.map((c, i) => (
        <motion.g
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: c.delay, ease: EASE }}
          style={{ originY: 1 }}
        >
          <rect x={c.cx - 16} y="70" width="32" height="7" rx="2" fill={c.to} />
          <rect
            x={c.cx - 11}
            y="77"
            width="22"
            height="54"
            fill={`url(#hx-col-${i})`}
          />
          <line
            x1={c.cx - 4}
            y1="80"
            x2={c.cx - 4}
            y2="128"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1.2"
          />
          <line
            x1={c.cx + 4}
            y1="80"
            x2={c.cx + 4}
            y2="128"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1.2"
          />
          <rect x={c.cx - 16} y="131" width="32" height="7" rx="2" fill={c.to} />
        </motion.g>
      ))}

      {/* Ground */}
      <rect
        x="14"
        y="138"
        width="212"
        height="5"
        rx="2.5"
        fill={ground}
        opacity="0.5"
      />
    </svg>
  );
};

const ExploreHero = () => {
  const { isDark } = useTheme();

  return (
    <section
      style={{
        paddingTop: 'clamp(96px, 14vw, 120px)',
        paddingBottom: '3rem',
        backgroundColor: 'var(--bg-body)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(600px, 100vw)',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(232,122,32,0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        {/* Portico */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <HeroPortico />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ textAlign: 'center', margin: '1.5rem 0 1rem' }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(232, 122, 32, 0.10)',
              border: '1px solid rgba(232, 122, 32, 0.25)',
              color: '#E87A20',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.76rem',
              fontWeight: 800,
            }}
          >
            {EXPLORE_COPY.hero_badge}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            fontFamily: 'Cairo, sans-serif',
            textAlign: 'center',
            lineHeight: 1.2,
            margin: '0 0 0.75rem',
          }}
        >
          {EXPLORE_COPY.hero_title}
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
          style={{
            color: '#E87A20',
            fontSize: 'clamp(1.05rem, 2.2vw, 1.5rem)',
            fontWeight: 800,
            fontFamily: 'Cairo, sans-serif',
            textAlign: 'center',
            lineHeight: 1.5,
            margin: '0 0 1.5rem',
          }}
        >
          {EXPLORE_COPY.hero_subtitle}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
          style={{
            color: 'var(--text-muted)',
            fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
            fontFamily: 'Cairo, sans-serif',
            lineHeight: 1.95,
            textAlign: 'center',
            maxWidth: '740px',
            margin: '0 auto',
          }}
        >
          {EXPLORE_COPY.hero_description}
        </motion.p>

        {/* Pillar quick-jump chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95, ease: EASE }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '2rem',
          }}
        >
          {EXPLORE_PILLARS.map((pillar) => {
            const Icon = pillar.Icon;
            return (
              <button
                key={pillar.key}
                type="button"
                onClick={scrollToPillars}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  minHeight: '40px',
                  borderRadius: '999px',
                  border: `1.5px solid ${pillar.color}45`,
                  backgroundColor: `${pillar.color}12`,
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <Icon size={13} color={pillar.color} />
                {pillar.title}
              </button>
            );
          })}
        </motion.div>

        {/* Scroll hint — a real button now */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            marginTop: '2.25rem',
          }}
        >
          <button
            type="button"
            onClick={scrollToPillars}
            aria-label={EXPLORE_COPY.hero_cta}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '26px',
                height: '42px',
                borderRadius: '14px',
                border: `2px solid ${
                  isDark ? 'rgba(196,168,138,0.4)' : 'rgba(139,90,43,0.3)'
                }`,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '8px',
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '3px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: '#E87A20',
                }}
              />
            </motion.div>
          </button>
          <span
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 700,
              opacity: 0.8,
            }}
          >
            {EXPLORE_COPY.hero_cta}
          </span>
        </motion.div>
      </Container>
    </section>
  );
};

export default ExploreHero;
