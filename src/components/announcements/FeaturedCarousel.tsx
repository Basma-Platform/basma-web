import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import FeaturedCard from './FeaturedCard';
import type { Announcement } from '../../types';

interface FeaturedCarouselProps {
  announcements: Announcement[];
  loading?: boolean;
}

const FeaturedCarousel = ({ announcements, loading = false }: FeaturedCarouselProps) => {
  const [isPaused, setIsPaused] = useState(false);

  if (!loading && (!announcements || announcements.length === 0)) {
    return null;
  }

  const multipliedAnnouncements =
    announcements && announcements.length < 5
      ? [...announcements, ...announcements, ...announcements]
      : announcements || [];

  // =========================================================================
  // SPEED FIX: Calculate dynamic duration based on item count.
  // E.g., ~3.5 seconds per card ensures consistent speed whether 10 or 25 items.
  // =========================================================================
  const itemCount = multipliedAnnouncements.length;
  const dynamicDuration = Math.max(25, itemCount * 3.5);

  return (
    <div
      style={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        marginBottom: '3rem',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(232, 122, 32, 0.05) 0%, rgba(139, 90, 43, 0.1) 100%)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        padding: '28px 0 32px',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '800px',
          margin: '0 auto 24px',
          textAlign: 'center',
          padding: '0 20px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #FFD700 0%, #E87A20 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 6px 20px rgba(232, 122, 32, 0.4)',
          }}
        >
          <FaStar size={24} color="#FFFFFF" />
        </motion.div>

        <h3
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)',
            fontWeight: 900,
            fontFamily: 'Cairo, sans-serif',
            marginBottom: '6px',
            lineHeight: 1.2,
          }}
        >
          الإعلانات المميزة
        </h3>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
            fontFamily: 'Cairo, sans-serif',
            margin: 0,
          }}
        >
          إعلانات بارزة مختارة لك في المقدمة
        </p>
      </motion.div>

      {/* Loading Skeleton */}
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
            <div
              key={i}
              style={{
                width: '280px',
                flexShrink: 0,
              }}
            >
              <Card
                className="announcement-card-skeleton"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px var(--shadow-sm)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  className="skeleton shimmer"
                  style={{
                    width: '100%',
                    height: '160px',
                    flexShrink: 0,
                    position: 'relative',
                    padding: '10px',
                  }}
                >
                  <div
                    className="skeleton shimmer"
                    style={{
                      width: '65px',
                      height: '22px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                  />
                </div>

                <Card.Body
                  style={{
                    padding: '0.8rem 0.9rem 0.9rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div
                      className="skeleton shimmer"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        className="skeleton shimmer"
                        style={{
                          width: '50%',
                          height: '8px',
                          borderRadius: '3px',
                          marginBottom: '3px',
                        }}
                      />
                      <div
                        className="skeleton shimmer"
                        style={{
                          width: '30%',
                          height: '6px',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="skeleton shimmer"
                    style={{
                      width: '90%',
                      height: '14px',
                      borderRadius: '3px',
                      marginTop: '2px',
                    }}
                  />

                  <div
                    className="skeleton shimmer"
                    style={{
                      width: '65%',
                      height: '10px',
                      borderRadius: '3px',
                    }}
                  />

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.5rem',
                      marginTop: 'auto',
                      borderTop: '1px solid var(--border-color)',
                    }}
                  >
                    <div
                      className="skeleton shimmer"
                      style={{
                        width: '40%',
                        height: '16px',
                        borderRadius: '4px',
                      }}
                    />
                    <div
                      className="skeleton shimmer"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Infinite Track Container */}
      {!loading && (
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => setIsPaused((prev) => !prev)} // Tap anywhere on mobile to pause/resume easily
          className="featured-marquee-wrapper"
        >
          {/* Dynamically pass speed via inline CSS variable --scroll-duration */}
          <div 
            className={`featured-marquee-track ${isPaused ? 'paused' : ''}`}
            style={{ '--scroll-duration': `${dynamicDuration}s` } as React.CSSProperties}
          >
            {/* First Set */}
            <div className="featured-marquee-group">
              {multipliedAnnouncements.map((announcement, index) => (
                <div key={`a-${announcement.id}-${index}`} className="featured-card-item">
                  <FeaturedCard announcement={announcement} />
                </div>
              ))}
            </div>

            {/* Second Set (Duplicate) */}
            <div className="featured-marquee-group" aria-hidden="true">
              {multipliedAnnouncements.map((announcement, index) => (
                <div key={`b-${announcement.id}-${index}`} className="featured-card-item">
                  <FeaturedCard announcement={announcement} />
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
        .featured-marquee-wrapper {
          display: flex;
          overflow: hidden;
          width: 100%;
          user-select: none;
          direction: ltr;
          padding: 16px 0;
          margin: -16px 0;
          cursor: pointer;
        }

        .featured-marquee-track {
          display: flex;
          flex-shrink: 0;
          gap: 20px;
          /* Uses the dynamic CSS variable calculated from item count */
          animation: marquee-scroll var(--scroll-duration, 30s) linear infinite;
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

        /* DESKTOP ONLY HOVER EFFECT: Will not trigger jumpiness on touch screens */
        @media (hover: hover) and (pointer: fine) {
          .featured-card-item:hover {
            z-index: 10;
            transform: translateY(-5px);
          }
        }

        /* Skeleton Animations */
        .skeleton {
          position: relative;
          overflow: hidden;
          background-color: #e8e0d8;
        }
        
        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 100%
          );
          animation: shimmer 1.8s infinite;
        }
        
        [data-theme="dark"] .skeleton {
          background-color: #5a4432 !important;
        }
        
        [data-theme="dark"] .shimmer::after {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.08) 50%,
            transparent 100%
          );
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(calc(-50% - 10px));
          }
        }
      `}</style>
    </div>
  );
};

export default FeaturedCarousel;
