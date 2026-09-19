import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import {
  getDistributionTotal,
  getDistributionPercentage,
} from '../../utils/ratingHelpers';
import type { RatingDistribution as RatingDistributionType } from '../../types';

interface RatingDistributionProps {
  distribution: RatingDistributionType;
  showStars?: boolean;
}

const RatingDistribution = ({
  distribution,
  showStars = true,
}: RatingDistributionProps) => {
  const total = getDistributionTotal(distribution);
  const stars: Array<1 | 2 | 3 | 4 | 5> = [5, 4, 3, 2, 1];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        fontFamily: 'Cairo, sans-serif',
      }}
      dir="rtl"
    >
      <h4
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          fontWeight: 800,
          margin: '0 0 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <FaStar size={13} color="#FFC107" />
        توزيع التقييمات
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {stars.map((star) => {
          const count =
            distribution[String(star) as keyof RatingDistributionType] || 0;
          const percentage = getDistributionPercentage(distribution, star);

          return (
            <div
              key={star}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {/* Star label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: '40px',
                  direction: 'ltr',
                }}
              >
                {showStars && (
                  <FaStar size={11} color="#FFC107" />
                )}
                <span
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontFamily:
                      "system-ui, sans-serif",
                  }}
                >
                  {star}
                </span>
              </div>

              {/* Bar */}
              <div
                style={{
                  height: '8px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    borderRadius: '4px',
                    background:
                      star >= 4
                        ? 'linear-gradient(90deg, #28A745, #4FCB6E)'
                        : star === 3
                        ? 'linear-gradient(90deg, #FFC107, #FFD966)'
                        : 'linear-gradient(90deg, #DC3545, #F56575)',
                  }}
                />
              </div>

              {/* Count + % */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  minWidth: '70px',
                  justifyContent: 'flex-end',
                }}
              >
                <span
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    fontFamily:
                      "system-ui, sans-serif",
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: '24px',
                    textAlign: 'right',
                  }}
                >
                  {count.toLocaleString('en-US')}
                </span>
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.68rem',
                    fontFamily:
                      "system-ui, sans-serif",
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: '30px',
                    textAlign: 'left',
                  }}
                >
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      {total > 0 && (
        <div
          style={{
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-color)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
          }}
        >
          إجمالي{' '}
          <strong
            style={{
              color: 'var(--text-secondary)',
              fontFamily: "system-ui, sans-serif",
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {total.toLocaleString('en-US')}
          </strong>{' '}
          تقييم
        </div>
      )}
    </div>
  );
};

export default RatingDistribution;