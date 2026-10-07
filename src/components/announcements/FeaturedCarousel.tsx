import { useState, useRef, useEffect } from 'react';
import { FaStar, FaGift, FaHandsHelping } from 'react-icons/fa';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import FeaturedCard from './FeaturedCard';
import type { Announcement } from '../../types';

interface FeaturedCarouselProps {
  announcements: Announcement[];
  loading?: boolean;
  /** Title shown in the header */
  title?: string;
  /** Icon variant to color the header */
  variant?: 'offer' | 'request' | 'default';
}

/**
 * Featured Carousel — Horizontal infinite marquee
 * - Supports 2 variants: 'offer' (🎁) + 'request' (🙋)
 * - Slides right → left (RTL friendly)
 * - Pauses on hover
 */
const FeaturedCarousel = ({
  announcements,
  loading = false,
  title = 'الخدمات المميزة',
  variant = 'default',
}: FeaturedCarouselProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ============================================
  // Empty state — hide carousel completely
  // ============================================
  if (!loading && (!announcements || announcements.length === 0)) {
    return null;
  }

  // ============================================
  // Duplicate items for seamless loop
  // ============================================
  const multipliedAnnouncements =
    announcements && announcements.length < 5
      ? [...announcements, ...announcements, ...announcements]
      : announcements || [];

  const itemCount = multipliedAnnouncements.length;
  const dynamicDuration = Math.max(25, itemCount * 3.5);

  // ============================================
  // Set initial scroll position to middle group
  // ============================================
  useEffect(() => {
    if (!loading && scrollRef.current) {
      const container = scrollRef.current;
      const trackGroup = container.querySelector(
        '.featured-marquee-group'
      ) as HTMLElement;
      if (trackGroup) {
        container.scrollLeft = trackGroup.offsetWidth;
      }
    }
  }, [loading, multipliedAnnouncements]);

  // ============================================
  // Seamless loop on scroll
  // ============================================
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const trackGroup = container.querySelector(
      '.featured-marquee-group'
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
  // Variant config
  // ============================================
  const variantConfig = {
    offer: {
      Icon: FaGift,
      gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
      glowColor: 'rgba(40,167,69,0.35)',
      subtitle: 'أحدث العروض المميزة من المجتمع',
    },
    request: {
      Icon: FaHandsHelping,
      gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
      glowColor: 'rgba(23,162,184,0.35)',
      subtitle: 'طلبات يحتاجها المجتمع — ساعد من تستطيع',
    },
    default: {
      Icon: FaStar,
      gradient: 'linear-gradient(135deg, #FFD700 0%, #E87A20 100%)',
      glowColor: 'rgba(232,122,32,0.4)',
      subtitle: 'خدمات بارزة مختارة لك في المقدمة',
    },
  }[variant];

  const HeaderIcon = variantConfig.Icon;

  return (
    <div
      className="featured-carousel-wrapper"
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
          'linear-gradient(135deg, rgba(232, 122, 32, 0.04) 0%, rgba(139, 90, 43, 0.08) 100%)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        padding: '22px 0 26px',
      }}
    >
      {/* ============================================ */}
      {/* Header */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '800px',
          margin: '0 auto 20px',
          textAlign: 'center',
          padding: '0 20px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: variantConfig.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            boxShadow: `0 6px 20px ${variantConfig.glowColor}`,
          }}
        >
          <HeaderIcon size={22} color="#FFFFFF" />
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
          {variantConfig.subtitle}
        </p>
      </motion.div>

      {/* ============================================ */}
      {/* Loading Skeleton */}
      {/* ============================================ */}
      {loading && (
        <div
          style={{
            display: 'flex',
            gap: '20px',
            padding: '16px 24px',
            overflow: 'hidden',
            justifyContent: 'center',
            direction: 'rtl',
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ width: '280px', flexShrink: 0 }}>
              <Card
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  className="featured-skel"
                  style={{ width: '100%', height: '160px' }}
                />
                <Card.Body
                  style={{
                    padding: '0.8rem 0.9rem 0.9rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div
                    className="featured-skel"
                    style={{ height: '14px', width: '90%', borderRadius: '4px' }}
                  />
                  <div
                    className="featured-skel"
                    style={{
                      height: '10px',
                      width: '65%',
                      borderRadius: '4px',
                    }}
                  />
                  <div
                    className="featured-skel"
                    style={{
                      height: '16px',
                      width: '40%',
                      borderRadius: '6px',
                      marginTop: 'auto',
                    }}
                  />
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* ============================================ */}
      {/* Marquee Track */}
      {/* ============================================ */}
      {!loading && (
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onScroll={handleScroll}
          className="featured-marquee-wrapper"
        >
          <div
            className={`featured-marquee-track ${isPaused ? 'paused' : ''}`}
            style={
              { '--scroll-duration': `${dynamicDuration}s` } as React.CSSProperties
            }
          >
            {/* First Set (buffer) */}
            <div className="featured-marquee-group" aria-hidden="true">
              {multipliedAnnouncements.map((a, i) => (
                <div key={`a-${a.id}-${i}`} className="featured-card-item">
                  <FeaturedCard announcement={a} />
                </div>
              ))}
            </div>

            {/* Second Set (primary) */}
            <div className="featured-marquee-group">
              {multipliedAnnouncements.map((a, i) => (
                <div key={`b-${a.id}-${i}`} className="featured-card-item">
                  <FeaturedCard announcement={a} />
                </div>
              ))}
            </div>

            {/* Third Set (buffer) */}
            <div className="featured-marquee-group" aria-hidden="true">
              {multipliedAnnouncements.map((a, i) => (
                <div key={`c-${a.id}-${i}`} className="featured-card-item">
                  <FeaturedCard announcement={a} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edge Blur Overlays */}
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
        .featured-skel {
          background-color: #e8e0d8;
          animation: featured-skel-pulse 1.4s ease-in-out infinite;
        }
        [data-theme='dark'] .featured-skel {
          background-color: #5a4432;
        }
        @keyframes featured-skel-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.9; }
        }

        .featured-marquee-wrapper {
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
        .featured-marquee-wrapper:active {
          cursor: grabbing;
        }
        .featured-marquee-wrapper::-webkit-scrollbar {
          display: none;
        }

        .featured-marquee-track {
          display: flex;
          flex-shrink: 0;
          gap: 20px;
          animation: featured-marquee-scroll var(--scroll-duration, 30s) linear infinite;
        }
        .featured-marquee-track.paused {
          animation-play-state: paused;
        }

        .featured-marquee-group {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          gap: 20px;
          min-width: max-content;
          direction: rtl;
        }

        .featured-card-item {
          position: relative;
          z-index: 2;
          transition: z-index 0.2s ease, transform 0.2s ease;
        }

        @media (hover: hover) and (pointer: fine) {
          .featured-card-item:hover {
            z-index: 10;
            transform: translateY(-5px);
          }
        }

        @keyframes featured-marquee-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(calc(-33.333% - 7px));
          }
        }
      `}</style>
    </div>
  );
};

export default FeaturedCarousel;