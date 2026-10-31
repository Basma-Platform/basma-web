import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  EXPLORE_COPY,
  EXPLORE_PILLARS,
  EXPLORE_DESIGN,
} from '../../utils/exploreHelpers';
import PillarColumn from './PillarColumn';
import SectionHeading from './SectionHeading';

const EASE = EXPLORE_DESIGN.ease_out_expo;

/**
 * Three columns standing together under a shared roof (architrave).
 *
 * FIX: the old layout was a wrapping flex row that shrank columns with
 * `transform: scale(0.85 / 0.7)` and negative bottom margins on small
 * screens. Scaled elements keep their original layout box, so columns
 * overlapped, left dead space and clipped content. This version uses a
 * plain CSS grid instead — nothing is ever scaled.
 */
const ExplorePillars = () => {
  const { isDark } = useTheme();

  return (
    <section
      id="explore-pillars"
      style={{
        paddingTop: '3rem',
        paddingBottom: 'clamp(4rem, 8vw, 5.5rem)',
        backgroundColor: 'var(--bg-body)',
        position: 'relative',
        overflow: 'hidden',
        scrollMarginTop: '70px',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(900px, 100vw)',
          height: '500px',
          background:
            'radial-gradient(ellipse, rgba(232,122,32,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
        }}
      />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          title={EXPLORE_COPY.pillars_title}
          subtitle={EXPLORE_COPY.pillars_subtitle}
        />

        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          {/* ===== Shared roof ===== */}
          <motion.div
            initial={{ opacity: 0, y: -16, scaleX: 0.7 }}
            whileInView={{ opacity: 1, y: 0, scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: EASE }}
            style={{ position: 'relative', paddingBottom: '14px' }}
          >
            <div
              style={{
                position: 'relative',
                height: '22px',
                borderRadius: '6px',
                background:
                  'linear-gradient(180deg, #8B5A2B 0%, #6B4226 40%, #4A2E1A 100%)',
                boxShadow: isDark
                  ? '0 8px 24px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.08)'
                  : '0 8px 24px rgba(139,90,43,0.25), inset 0 2px 0 rgba(255,255,255,0.15)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 50%, transparent)',
                  borderRadius: '6px 6px 0 0',
                }}
              />
            </div>
            <div
              style={{
                height: '14px',
                marginTop: '-2px',
                marginInline: '3%',
                borderRadius: '4px',
                background: 'linear-gradient(180deg, #6B4226 0%, #4A2E1A 100%)',
              }}
            />
            <div
              style={{
                height: '8px',
                marginTop: '-2px',
                marginInline: '8%',
                borderRadius: '3px',
                background: 'linear-gradient(180deg, #4A2E1A 0%, #2E1A0E 100%)',
                opacity: 0.9,
              }}
            />
          </motion.div>

          {/* ===== Columns ===== */}
          <div
            className="explore-pillars-grid"
            style={{ gap: `${EXPLORE_DESIGN.column.gap}px`, paddingTop: '0.75rem' }}
          >
            {EXPLORE_PILLARS.map((pillar, index) => (
              <PillarColumn key={pillar.key} pillar={pillar} index={index} />
            ))}
          </div>

          {/* ===== Floor ===== */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: EASE }}
            style={{
              margin: '2.5rem auto 0',
              height: '6px',
              borderRadius: '3px',
              background:
                'linear-gradient(90deg, transparent, rgba(139,90,43,0.4) 20%, rgba(139,90,43,0.6) 50%, rgba(139,90,43,0.4) 80%, transparent)',
            }}
          />
        </div>
      </Container>

      <style>{`
        .explore-pillars-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          align-items: stretch;
        }

        /* Tablet: 2 columns, third one centered underneath */
        @media (min-width: 700px) and (max-width: 1023px) {
          .explore-pillars-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .explore-pillars-grid > *:nth-child(3) {
            grid-column: 1 / -1;
            justify-self: center;
            width: calc((100% - 28px) / 2);
          }
        }

        /* Desktop: three equal columns */
        @media (min-width: 1024px) {
          .explore-pillars-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </section>
  );
};

export default ExplorePillars;
