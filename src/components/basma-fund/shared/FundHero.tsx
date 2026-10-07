import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaArrowLeft, FaHeart } from 'react-icons/fa';
import { FUND_COPY } from '../../../utils/fundContactHelpers';

interface FundHeroProps {
  /** Callback when user clicks primary CTA (scroll to help requests) */
  onPrimaryCTA?: () => void;
  /** Callback when user clicks secondary CTA (scroll to achievements) */
  onSecondaryCTA?: () => void;
}

/**
 * Hero section for Basma Fund landing page.
 * Content is centered horizontally; CTAs stay side-by-side even on
 * very narrow screens (< 375px) via responsive font/padding.
 */
const FundHero = ({ onPrimaryCTA, onSecondaryCTA }: FundHeroProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fund-hero"
      style={{
        position: 'relative',
        padding: 'clamp(2rem, 6vw, 3.5rem) clamp(1rem, 4vw, 2.5rem)',
        borderRadius: '28px',
        background:
          'linear-gradient(135deg, #138496 0%, #17A2B8 50%, #20C9E0 100%)',
        color: '#FFFFFF',
        overflow: 'hidden',
        fontFamily: 'Cairo, sans-serif',
        marginBottom: '2rem',
        boxShadow: '0 20px 50px rgba(23,162,184,0.35)',
        textAlign: 'center', // ✅ center everything
      }}
    >
      {/* Decorative radial glows */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-120px',
          left: '-100px',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating heart icon (decorative) */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [0, 6, -6, 0],
          opacity: [0.14, 0.22, 0.14],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '12%',
          left: '8%',
          color: '#FFFFFF',
          pointerEvents: 'none',
        }}
      >
        <FaHeart size={80} />
      </motion.div>

      {/* Inner content wrapper — centered via flex column */}
      <div
        className="fund-hero__inner"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '720px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // ✅ centers children
        }}
      >
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.28)',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '1rem',
            backdropFilter: 'blur(6px)',
          }}
        >
          <FaHandHoldingHeart size={12} />
          مبادرة مجتمعية
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            margin: '0 0 0.75rem',
            color: '#FFFFFF',
          }}
        >
          {FUND_COPY.hero_title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.92)',
            margin: '0 0 1.75rem',
            maxWidth: '560px',
          }}
        >
          {FUND_COPY.hero_subtitle}
        </motion.p>

        {/* CTAs — always side-by-side, shrink on tiny screens */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="fund-hero__actions"
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'nowrap', // ✅ never wrap to column
            width: '100%',
            maxWidth: '520px',
          }}
        >
          <motion.button
            type="button"
            onClick={onPrimaryCTA}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="fund-hero__btn fund-hero__btn--primary"
          >
            {FUND_COPY.hero_cta}
            <FaArrowLeft size={11} />
          </motion.button>

          <motion.button
            type="button"
            onClick={onSecondaryCTA}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="fund-hero__btn fund-hero__btn--secondary"
          >
            {FUND_COPY.hero_cta_secondary}
          </motion.button>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* Scoped styles for the CTAs */}
      {/* ============================================ */}
      <style>{`
        .fund-hero__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 14px;
          font-family: 'Cairo', sans-serif;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex: 0 1 auto;
          min-width: 0;
        }

        .fund-hero__btn--primary {
          border: none;
          background-color: #FFFFFF;
          color: #138496;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .fund-hero__btn--secondary {
          border: 1.5px solid rgba(255, 255, 255, 0.5);
          background-color: transparent;
          color: #FFFFFF;
          font-weight: 700;
        }

        /* ✅ Below 375px — smaller font + tighter padding, still side-by-side */
        @media (max-width: 374px) {
          .fund-hero__actions {
            gap: 8px;
          }
          .fund-hero__btn {
            padding: 9px 12px;
            font-size: 0.72rem;
            gap: 5px;
            border-radius: 11px;
          }
        }

        /* Extremely narrow (<= 320px) — micro text */
        @media (max-width: 340px) {
          .fund-hero__btn {
            padding: 8px 10px;
            font-size: 0.68rem;
            gap: 4px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fund-hero__btn {
            transition: none !important;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default FundHero;