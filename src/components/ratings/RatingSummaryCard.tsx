import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import StarRating from './StarRating';
import { getRatingColor } from '../../utils/ratingHelpers';
import type { UserRatingSummary } from '../../types';

interface RatingSummaryCardProps {
  summary: UserRatingSummary;
}

const RatingSummaryCard = ({ summary }: RatingSummaryCardProps) => {
  const { average_rating, total_ratings, rating_distribution } = summary;

  const ratingColor = getRatingColor(average_rating);

  // Count of 4 & 5 star ratings (positive feedback)
  const positiveCount =
    (rating_distribution['4'] || 0) + (rating_distribution['5'] || 0);
  const positivePct =
    total_ratings > 0
      ? Math.round((positiveCount / total_ratings) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '18px',
        padding: '1.5rem',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap',
        fontFamily: 'Cairo, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
      dir="rtl"
    >
      {/* Decorative glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          left: '-40px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ratingColor}15, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Big average */}
      <div
        style={{
          textAlign: 'center',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: '3rem',
            fontWeight: 900,
            color: ratingColor,
            lineHeight: 1,
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
            fontVariantNumeric: 'lining-nums tabular-nums',
          }}
        >
          {average_rating.toFixed(1)}
        </div>
        <div style={{ margin: '6px 0 4px' }}>
          <StarRating rating={average_rating} size={16} />
        </div>
        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 600,
          }}
        >
          من 5 نجوم
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: '1px',
          height: '80px',
          backgroundColor: 'var(--border-color)',
          flexShrink: 0,
        }}
        className="d-none d-sm-block"
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: '180px', position: 'relative', zIndex: 1 }}>
        <h3
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: 800,
            margin: '0 0 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <FaStar size={13} color="#FFC107" />
          التقييم العام
        </h3>

        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            lineHeight: 1.7,
          }}
        >
          بناءً على{' '}
          <strong
            style={{
              color: 'var(--text-secondary)',
              fontFamily: "system-ui, sans-serif",
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {total_ratings.toLocaleString('en-US')}
          </strong>{' '}
          {total_ratings === 1 ? 'تقييم' : 'تقييمات'}
          {total_ratings > 0 && (
            <>
              {' '}
              — <strong style={{ color: '#28A745' }}>{positivePct}%</strong> من
              التقييمات إيجابية
            </>
          )}
        </div>

        {/* Mini distribution preview */}
        {total_ratings > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '4px',
              marginTop: '10px',
            }}
          >
            {[5, 4, 3, 2, 1].map((star) => {
              const count =
                rating_distribution[String(star) as '1' | '2' | '3' | '4' | '5'] || 0;
              const pct =
                total_ratings > 0 ? (count / total_ratings) * 100 : 0;
              return (
                <div
                  key={star}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--bg-input)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                  title={`${star} نجوم: ${count}`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{
                      height: '100%',
                      backgroundColor:
                        star >= 4
                          ? '#28A745'
                          : star === 3
                          ? '#FFC107'
                          : '#DC3545',
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {total_ratings === 0 && (
          <div
            style={{
              marginTop: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              opacity: 0.7,
            }}
          >
            لا توجد تقييمات بعد
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RatingSummaryCard;