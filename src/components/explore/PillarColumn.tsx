import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaArrowLeft, FaClock } from 'react-icons/fa';
import { EXPLORE_DESIGN } from '../../utils/exploreHelpers';
import type { ExplorePillar } from '../../utils/exploreHelpers';
import PillarParticles from './PillarParticles';

interface PillarColumnProps {
  pillar: ExplorePillar;
  index: number;
}

/**
 * One of the three pillars, drawn as a classical column:
 *   capital  →  fluted shaft (the content)  →  base
 *
 * Layout notes:
 *  - The root fills its grid cell (width: 100%, minWidth: 0) and the
 *    shaft is `flex: 1`, so all three columns are equal height.
 *  - The CTA uses `marginTop: auto`, so buttons line up at the bottom.
 *  - There is NO transform: scale() fallback for small screens; the
 *    parent grid simply collapses to one column.
 */
const PillarColumn = ({ pillar, index }: PillarColumnProps) => {
  const [hovered, setHovered] = useState(false);
  const { Icon, color, colorLight } = pillar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: EXPLORE_DESIGN.ease_out_expo,
      }}
      style={{ display: 'flex', width: '100%', minWidth: 0 }}
    >
      <motion.article
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minWidth: 0,
        }}
      >
        {/* ===== Capital ===== */}
        <div
          style={{
            height: '14px',
            margin: '0 -6px',
            borderRadius: '6px 6px 2px 2px',
            background: `linear-gradient(180deg, ${colorLight}, ${color})`,
            boxShadow: `0 6px 16px ${color}40`,
          }}
        />
        <div
          style={{
            height: '8px',
            margin: '0 -2px',
            borderRadius: '0 0 6px 6px',
            backgroundColor: color,
            opacity: 0.85,
          }}
        />

        {/* ===== Shaft (content) ===== */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: '1.75rem 1.4rem 1.5rem',
            backgroundColor: 'var(--bg-card)',
            // fluting: soft vertical shading on both edges
            backgroundImage: `linear-gradient(90deg, ${color}1F 0%, transparent 7%, transparent 93%, ${color}1F 100%)`,
            borderLeft: `1px solid ${color}30`,
            borderRight: `1px solid ${color}30`,
            boxShadow: hovered
              ? `0 20px 48px ${color}30`
              : '0 10px 28px var(--shadow-sm)',
            transition: 'box-shadow 0.35s ease',
          }}
        >
          <PillarParticles active={hovered} color={color} />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            {/* Icon medallion */}
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '18px',
                background: `linear-gradient(135deg, ${colorLight}, ${color})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: `0 8px 20px ${color}45`,
                marginBottom: '1.1rem',
              }}
            >
              <Icon size={26} />
            </div>

            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.45rem',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                margin: '0 0 4px',
                lineHeight: 1.3,
              }}
            >
              {pillar.title}
            </h3>

            <div
              style={{
                color,
                fontSize: '0.88rem',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '0.85rem',
              }}
            >
              {pillar.tagline}
            </div>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.9,
                margin: '0 0 1.1rem',
              }}
            >
              {pillar.description}
            </p>

            {/* Optional chips (community post types) */}
            {pillar.chips && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '1.1rem',
                }}
              >
                {pillar.chips.map(({ label, color: chipColor, Icon: ChipIcon }) => (
                  <span
                    key={label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      borderRadius: '999px',
                      backgroundColor: `${chipColor}14`,
                      border: `1px solid ${chipColor}40`,
                      color: chipColor,
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                    }}
                  >
                    <ChipIcon size={11} />
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div
              style={{
                height: '1px',
                backgroundColor: 'var(--border-color)',
                marginBottom: '1.1rem',
              }}
            />

            {/* Features */}
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {pillar.features.map((feature) => (
                <li
                  key={feature}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    lineHeight: 1.7,
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: '18px',
                      height: '18px',
                      marginTop: '3px',
                      borderRadius: '50%',
                      backgroundColor: `${color}1A`,
                      color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FaCheck size={8} />
                  </span>
                  <span style={{ minWidth: 0 }}>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA — pinned to the bottom so the 3 buttons line up */}
            {pillar.available ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{ marginTop: 'auto' }}
              >
                <Link
                  to={pillar.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${colorLight}, ${color})`,
                    color: '#FFFFFF',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    boxShadow: `0 6px 18px ${color}45`,
                  }}
                >
                  {pillar.cta}
                  <FaArrowLeft size={11} />
                </Link>
              </motion.div>
            ) : (
              <div
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: `1.5px dashed ${color}60`,
                  color,
                  backgroundColor: `${color}0D`,
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                }}
              >
                <FaClock size={12} />
                {pillar.cta}
              </div>
            )}
          </div>
        </div>

        {/* ===== Base ===== */}
        <div
          style={{
            height: '10px',
            margin: '0 -5px',
            borderRadius: '3px 3px 0 0',
            background: `linear-gradient(180deg, ${color}, ${color}CC)`,
          }}
        />
        <div
          style={{
            height: '14px',
            margin: '0 -10px',
            borderRadius: '4px',
            background: 'linear-gradient(180deg, #6B4226, #4A2E1A)',
            boxShadow: '0 8px 18px rgba(74, 46, 26, 0.35)',
          }}
        />
      </motion.article>
    </motion.div>
  );
};

export default PillarColumn;
