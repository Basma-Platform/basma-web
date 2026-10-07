import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaAward, FaArrowLeft } from 'react-icons/fa';
import AchievementCard from './AchievementCard';
import AchievementCardSkeleton from './AchievementCardSkeleton';
import type { DonationAchievement } from '../../../types';

interface AchievementsCarouselProps {
  achievements: DonationAchievement[];
  loading?: boolean;
  title?: string;
  /** Optional custom header action — defaults to "عرض الكل" link */
  showViewAll?: boolean;
  onCardClick?: (achievement: DonationAchievement) => void;
}

/**
 * Infinite marquee carousel — mirrors FeaturedCarousel's behavior.
 * Slides right → left (RTL). Pauses on hover.
 *
 * ⚠️ Hook-safe: all hooks run BEFORE any conditional return.
 */
const AchievementsCarousel = ({
  achievements,
  loading = false,
  title = 'إنجازات التبرعات',
  showViewAll = true,
  onCardClick,
}: AchievementsCarouselProps) => {
  // ============================================
  // ✅ ALL HOOKS FIRST — no early returns above these
  // ============================================
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const multiplied =
    achievements && achievements.length < 4
      ? [...achievements, ...achievements, ...achievements]
      : achievements || [];

  const itemCount = multiplied.length;
  const dynamicDuration = Math.max(28, itemCount * 4);

  useEffect(() => {
    if (loading) return;
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const trackGroup = container.querySelector(
      '.ach-carousel-group'
    ) as HTMLElement;
    if (trackGroup) {
      container.scrollLeft = trackGroup.offsetWidth;
    }
  }, [loading, multiplied]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const trackGroup = container.querySelector(
      '.ach-carousel-group'
    ) as HTMLElement;
    if (!trackGroup) return;
    const groupWidth = trackGroup.offsetWidth;

    if (container.scrollLeft <= 10) {
      container.scrollLeft += groupWidth;
    } else if (container.scrollLeft >= groupWidth * 2 - 10) {
      container.scrollLeft -= groupWidth;
    }
  };

  // ============================================
  // ✅ Safe to render nothing now
  // ============================================
  const isEmpty = !loading && (!achievements || achievements.length === 0);
  if (isEmpty) return null;

  return (
    <div
      className="ach-carousel-wrapper"
      style={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        marginBottom: '2rem',
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, rgba(255,193,7,0.04) 0%, rgba(232,122,32,0.06) 100%)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        padding: '22px 0 26px',
      }}
    >
      {/* ============================================
          Header — icon + title centered, view-all on the side
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '900px',
          margin: '0 auto 20px',
          padding: '0 20px',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        {/* Icon + title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background:
                'linear-gradient(135deg, #FFD700 0%, #E87A20 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              boxShadow: '0 6px 20px rgba(232,122,32,0.4)',
              color: '#FFFFFF',
            }}
          >
            <FaAward size={22} />
          </motion.div>
          <h3
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1.3rem, 2vw, 1.7rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '4px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(0.8rem, 1vw, 0.92rem)',
              fontFamily: 'Cairo, sans-serif',
              margin: 0,
            }}
          >
            قصص نجاح حقيقية بفضل تبرعاتكم
          </p>
        </div>

        {/* ✅ View-all CTA */}
        {showViewAll && !loading && achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Link
              to="/basma-fund/achievements"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,193,7,0.12)',
                border: '1px solid rgba(255,193,7,0.35)',
                color: '#B8860B',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.82rem',
                fontWeight: 800,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 10px rgba(232,122,32,0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(255,193,7,0.22)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 18px rgba(232,122,32,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(255,193,7,0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 2px 10px rgba(232,122,32,0.15)';
              }}
            >
              <FaAward size={12} />
              عرض كل الإنجازات
              <FaArrowLeft size={10} />
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Skeletons */}
      {loading && (
        <div style={{ padding: '16px 24px' }}>
          <AchievementCardSkeleton count={5} />
        </div>
      )}

      {/* Marquee */}
      {!loading && (
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onScroll={handleScroll}
          className="ach-carousel-scroll"
        >
          <div
            className={`ach-carousel-track ${isPaused ? 'paused' : ''}`}
            style={
              {
                '--ach-scroll-duration': `${dynamicDuration}s`,
              } as React.CSSProperties
            }
          >
            <div className="ach-carousel-group" aria-hidden="true">
              {multiplied.map((a, i) => (
                <div key={`a-${a.id}-${i}`} className="ach-carousel-item">
                  <AchievementCard achievement={a} onClick={onCardClick} />
                </div>
              ))}
            </div>

            <div className="ach-carousel-group">
              {multiplied.map((a, i) => (
                <div key={`b-${a.id}-${i}`} className="ach-carousel-item">
                  <AchievementCard achievement={a} onClick={onCardClick} />
                </div>
              ))}
            </div>

            <div className="ach-carousel-group" aria-hidden="true">
              {multiplied.map((a, i) => (
                <div key={`c-${a.id}-${i}`} className="ach-carousel-item">
                  <AchievementCard achievement={a} onClick={onCardClick} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edge fades */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '100px',
          background: 'linear-gradient(to left, var(--bg-body), transparent)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '100px',
          background: 'linear-gradient(to right, var(--bg-body), transparent)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <style>{`
        .ach-carousel-scroll {
          display: flex;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          width: 100%;
          user-select: none;
          direction: ltr;
          padding: 16px 0;
          margin: -16px 0;
          cursor: grab;
          scroll-behavior: auto;
        }
        .ach-carousel-scroll:active { cursor: grabbing; }
        .ach-carousel-scroll::-webkit-scrollbar { display: none; }

        .ach-carousel-track {
          display: flex;
          flex-shrink: 0;
          gap: 20px;
          animation: achMarquee var(--ach-scroll-duration, 30s) linear infinite;
        }
        .ach-carousel-track.paused { animation-play-state: paused; }

        .ach-carousel-group {
          display: flex;
          flex-shrink: 0;
          align-items: stretch;
          gap: 20px;
          min-width: max-content;
          direction: rtl;
        }
        .ach-carousel-item {
          position: relative;
          z-index: 2;
          transition: z-index 0.2s ease, transform 0.2s ease;
          height: 100%;
        }
        @media (hover: hover) and (pointer: fine) {
          .ach-carousel-item:hover { z-index: 10; }
        }
        @keyframes achMarquee {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(calc(-33.333% - 7px)); }
        }
      `}</style>
    </div>
  );
};

export default AchievementsCarousel;