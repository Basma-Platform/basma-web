import { motion } from 'framer-motion';
import {
  FaStar,
  FaCommentAlt,
  FaArrowUp,
  FaChartLine,
  FaTrophy,
  FaInfoCircle,
} from 'react-icons/fa';
import type { MyRatingStats } from '../../../types';

interface RatingInsightsCardProps {
  stats: MyRatingStats;
}

const RatingInsightsCard = ({ stats }: RatingInsightsCardProps) => {
  const { rating_distribution, total_received, ratings_with_comments_received } =
    stats;

  const total = total_received || 0;

  // Calculated insights
  const fiveStarCount = rating_distribution['5'] || 0;
  const fourStarCount = rating_distribution['4'] || 0;
  
  const positiveCount = fiveStarCount + fourStarCount;

  const fiveStarPct = total > 0 ? Math.round((fiveStarCount / total) * 100) : 0;
  const positivePct = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
  const commentsPct =
    total > 0 ? Math.round((ratings_with_comments_received / total) * 100) : 0;

  // ✅ FIXED: Determine dominant rating with proper tie-breaking
  const dominantRating = (() => {
    if (total === 0) return null;

    const entries = Object.entries(rating_distribution) as Array<
      [string, number]
    >;

    if (entries.length === 0) return null;

    // ✅ Find max count — prefer HIGHER star on tie
    const winner = entries.reduce(
      (max, curr) => {
        if (curr[1] > max[1]) return curr;
        if (curr[1] === max[1] && Number(curr[0]) > Number(max[0])) return curr;
        return max;
      },
      entries[0]
    );

    if (winner[1] === 0) return null;

    return winner[0];
  })();

  // Determine overall tier
  const avg = stats.average_rating;
  const tier = (() => {
    if (total === 0)
      return {
        label: 'لا توجد تقييمات',
        color: '#8B5A2B',
        bg: 'rgba(139,90,43,0.08)',
      };
    if (avg >= 4.5)
      return {
        label: 'تقييم ممتاز',
        color: '#28A745',
        bg: 'rgba(40,167,69,0.08)',
      };
    if (avg >= 3.5)
      return {
        label: 'تقييم جيد',
        color: '#4FCB6E',
        bg: 'rgba(79,203,110,0.08)',
      };
    if (avg >= 2.5)
      return {
        label: 'تقييم متوسط',
        color: '#FFC107',
        bg: 'rgba(255,193,7,0.1)',
      };
    if (avg >= 1.5)
      return {
        label: 'تحتاج إلى تحسين',
        color: '#F5A623',
        bg: 'rgba(245,166,35,0.1)',
      };
    return {
      label: 'تقييم ضعيف',
      color: '#DC3545',
      bg: 'rgba(220,53,69,0.08)',
    };
  })();

  const insights = [
    {
      icon: <FaTrophy size={13} />,
      label: 'التقييم السائد',
      value: dominantRating ? `${dominantRating} نجوم` : '—',
      sublabel:
        dominantRating === '5'
          ? 'معظم تقييماتك ممتازة'
          : dominantRating === '4'
          ? 'معظم تقييماتك جيدة'
          : dominantRating === '3'
          ? 'معظم تقييماتك متوسطة'
          : dominantRating === '2'
          ? 'معظم تقييماتك تحتاج تحسين'
          : dominantRating === '1'
          ? 'معظم تقييماتك ضعيفة'
          : 'لا توجد بيانات',
      color:
        dominantRating === '5' || dominantRating === '4'
          ? '#28A745'
          : dominantRating === '3'
          ? '#FFC107'
          : dominantRating
          ? '#DC3545'
          : 'var(--text-muted)',
      bg:
        dominantRating === '5' || dominantRating === '4'
          ? 'rgba(40,167,69,0.08)'
          : dominantRating === '3'
          ? 'rgba(255,193,7,0.08)'
          : dominantRating
          ? 'rgba(220,53,69,0.06)'
          : 'var(--bg-input)',
    },
    {
      icon: <FaStar size={13} />,
      label: 'تقييمات 5 نجوم',
      value: `${fiveStarPct}%`,
      sublabel: `${fiveStarCount} من ${total} تقييم`,
      color: '#F5A623',
      bg: 'rgba(245,166,35,0.08)',
    },
    {
      icon: <FaArrowUp size={13} />,
      label: 'التقييمات الإيجابية',
      value: `${positivePct}%`,
      sublabel: '4 نجوم أو أكثر',
      color: '#28A745',
      bg: 'rgba(40,167,69,0.08)',
    },
    {
      icon: <FaCommentAlt size={13} />,
      label: 'تقييمات مع تعليق',
      value: `${commentsPct}%`,
      sublabel: `${ratings_with_comments_received} تعليق`,
      color: '#17A2B8',
      bg: 'rgba(23,162,184,0.08)',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        height: '100%',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 4px 12px var(--shadow-sm)',
        fontFamily: 'Cairo, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      dir="rtl"
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '14px',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-color)',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #E87A20, #F5A623)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(232,122,32,0.3)',
          }}
        >
          <FaChartLine size={14} />
        </div>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            رؤى سريعة
          </div>
          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.68rem',
              marginTop: '2px',
            }}
          >
            ملخص لأدائك وتقييماتك
          </div>
        </div>
      </div>

      {/* Empty state */}
      {total === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <FaInfoCircle
            size={26}
            style={{ opacity: 0.4, marginBottom: '10px' }}
          />
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '4px',
            }}
          >
            لا توجد رؤى بعد
          </div>
          <div style={{ fontSize: '0.72rem', opacity: 0.7, lineHeight: 1.5 }}>
            ستظهر الرؤى التحليلية بعد استلام أول تقييم.
          </div>
        </div>
      ) : (
        <>
          {/* Tier Badge */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: tier.bg,
              borderRadius: '12px',
              border: `1px solid ${tier.color}40`,
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              flexWrap: 'wrap',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <FaTrophy size={14} color={tier.color} style={{ flexShrink: 0 }} />
              <span
                style={{
                  color: tier.color,
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  whiteSpace: 'nowrap',
                }}
              >
                {tier.label}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: tier.color,
                fontFamily:
                  "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                fontVariantNumeric: 'tabular-nums',
                flexShrink: 0,
              }}
            >
              <FaStar size={12} />
              <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>
                {avg.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Insights Grid - Forced exactly 2 items per row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              flex: 1,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {insights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                style={{
                  padding: '10px',
                  backgroundColor: insight.bg,
                  borderRadius: '10px',
                  border: `1px solid ${insight.color}25`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  minWidth: 0,
                  width: '100%',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: insight.color,
                    marginBottom: '2px',
                    minWidth: 0,
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{insight.icon}</span>
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {insight.label}
                  </span>
                </div>
                <div
                  style={{
                    color: insight.color,
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    fontFamily:
                      "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1.1,
                    wordBreak: 'break-all',
                  }}
                >
                  {insight.value}
                </div>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.6rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {insight.sublabel}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default RatingInsightsCard;