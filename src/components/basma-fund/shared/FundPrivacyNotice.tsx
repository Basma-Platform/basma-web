import { motion } from 'framer-motion';
import { FaShieldAlt, FaCheck } from 'react-icons/fa';
import { FUND_COPY } from '../../../utils/fundContactHelpers';

/**
 * Privacy notice block — explains why users can trust the platform.
 *
 * Enhancements:
 *  - Staggered reveal per bullet (framer-motion)
 *  - Animated checkmark draw-in (SVG circle + tick)
 *  - Card hover: lift + border glow + icon pulse
 *  - Each bullet locked to a SINGLE LINE (no wrapping) via white-space + min-width
 *  - Font shrinks responsively at < 480px so single-line still fits
 */
const FundPrivacyNotice = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="fund-privacy"
      style={{
        position: 'relative',
        padding: 'clamp(1.35rem, 3.5vw, 1.85rem)',
        borderRadius: '22px',
        background:
          'linear-gradient(135deg, rgba(23,162,184,0.09) 0%, rgba(23,162,184,0.02) 100%)',
        border: '1px solid rgba(23,162,184,0.22)',
        fontFamily: 'Cairo, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* ============================================ */}
      {/* Decorative background — soft radial glow + drifting dots */}
      {/* ============================================ */}
      <div
        style={{
          position: 'absolute',
          top: '-70px',
          left: '-70px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(23,162,184,0.22), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-90px',
          right: '-80px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(32,201,224,0.15), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Drifting shield dots (very subtle decoration) */}
      {[
        { top: '12%', left: '85%', delay: 0 },
        { top: '70%', left: '6%', delay: 0.8 },
        { top: '40%', left: '92%', delay: 1.6 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -10, 0],
            opacity: [0.08, 0.2, 0.08],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: dot.delay,
          }}
          style={{
            position: 'absolute',
            top: dot.top,
            left: dot.left,
            color: '#17A2B8',
            pointerEvents: 'none',
          }}
        >
          <FaShieldAlt size={22} />
        </motion.div>
      ))}

      {/* ============================================ */}
      {/* Header */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '1.1rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Icon with continuous soft pulse */}
        <motion.div
          animate={{
            boxShadow: [
              '0 4px 12px rgba(23,162,184,0.35)',
              '0 6px 22px rgba(23,162,184,0.55)',
              '0 4px 12px rgba(23,162,184,0.35)',
            ],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <motion.span
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ display: 'inline-flex' }}
          >
            <FaShieldAlt size={18} />
          </motion.span>
        </motion.div>

        <h4
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            fontWeight: 900,
            margin: 0,
            lineHeight: 1.2,
            position: 'relative',
          }}
        >
          {FUND_COPY.privacy_title}
          {/* Underline accent */}
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: '42%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
            style={{
              display: 'block',
              height: '3px',
              borderRadius: '3px',
              background:
                'linear-gradient(90deg, #17A2B8, rgba(32,201,224,0))',
              marginTop: '6px',
            }}
          />
        </h4>
      </motion.div>

      {/* ============================================ */}
      {/* Points list — single line each */}
      {/* ============================================ */}
      <ul
        className="fund-privacy__list"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {FUND_COPY.privacy_points.map((point, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: 0.2 + idx * 0.09,
              ease: 'easeOut',
            }}
            whileHover={{ y: -3, scale: 1.015 }}
            className="fund-privacy__item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              lineHeight: 1.5,
              whiteSpace: 'nowrap', // ✅ single line
              overflow: 'hidden',
              cursor: 'default',
              transition:
                'box-shadow 0.25s ease, border-color 0.25s ease, background-color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                '0 8px 20px rgba(23,162,184,0.22)';
              e.currentTarget.style.borderColor = 'rgba(23,162,184,0.55)';
              e.currentTarget.style.backgroundColor =
                'rgba(23,162,184,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.backgroundColor = 'var(--bg-card)';
            }}
          >
            {/* Animated check icon — draws in */}
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 16,
                delay: 0.35 + idx * 0.09,
              }}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, #28A745, #4FCB6E)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(40,167,69,0.35)',
              }}
            >
              <FaCheck size={10} />
            </motion.span>

            <span
              className="fund-privacy__text"
              style={{
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {point}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* ============================================ */}
      {/* Scoped responsive styles */}
      {/* ============================================ */}
      <style>{`
        /* ✅ Below 480px — shrink font so single-line still fits */
        @media (max-width: 480px) {
          .fund-privacy__item {
            font-size: 0.72rem !important;
            padding: 8px 10px !important;
            gap: 6px !important;
          }
        }

        /* ✅ Extremely narrow (<= 360px) — micro size */
        @media (max-width: 360px) {
          .fund-privacy__item {
            font-size: 0.66rem !important;
            padding: 7px 9px !important;
            gap: 5px !important;
          }
        }

        /* Respect users who dislike motion */
        @media (prefers-reduced-motion: reduce) {
          .fund-privacy__item {
            transition: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default FundPrivacyNotice;