import { Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaStar, FaCommentAlt, FaChartBar } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminRatingStats } from '../../../types';

interface AdminRatingStatsCardsProps {
  stats: AdminRatingStats;
}

interface StatCard {
  label: string;
  value: string | number;
  subtext: string;
  color: string;
  gradient: string;
  bg: string;
  Icon: IconType;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

const AdminRatingStatsCards = ({ stats }: AdminRatingStatsCardsProps) => {
  const cards: StatCard[] = [
    {
      label: 'إجمالي التقييمات',
      value: stats.total_ratings,
      subtext: 'على مستوى المنصة',
      color: '#E87A20',
      gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
      bg: 'rgba(232, 122, 32, 0.1)',
      Icon: FaChartBar,
    },
    {
      label: 'متوسط التقييم',
      value: stats.average_rating ? stats.average_rating.toFixed(1) : '—',
      subtext: 'من 5 نجوم',
      color: '#FFC107',
      gradient: 'linear-gradient(135deg, #FFC107, #FFD966)',
      bg: 'rgba(255, 193, 7, 0.1)',
      Icon: FaStar,
    },
    {
      label: 'مع تعليق',
      value: stats.ratings_with_comments,
      subtext: 'تقييمات تحتوي على نص',
      color: '#17A2B8',
      gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
      bg: 'rgba(23, 162, 184, 0.1)',
      Icon: FaCommentAlt,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      dir="rtl"
    >
      {/* ============================================ */}
      {/* Stat Cards */}
      {/* ============================================ */}
      <Row className="g-3 mb-3">
        {cards.map((card, idx) => {
          const Icon = card.Icon;
          const isNumeric = typeof card.value === 'number';

          return (
            <Col key={idx} xs={12} sm={6} lg={4}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <Card
                  className="position-relative overflow-hidden h-100"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                    fontFamily: 'Cairo, sans-serif',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.07)';
                    e.currentTarget.style.borderColor = `${card.color}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.03)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      left: 0,
                      height: '3.5px',
                      background: card.gradient,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-30px',
                      left: '-30px',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      backgroundColor: card.bg,
                      filter: 'blur(12px)',
                      pointerEvents: 'none',
                    }}
                  />

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      {card.label}
                    </span>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: card.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        flexShrink: 0,
                        boxShadow: `0 4px 12px ${card.color}40`,
                      }}
                    >
                      <Icon size={17} />
                    </div>
                  </div>

                  <div
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '1.75rem',
                      fontWeight: 900,
                      lineHeight: 1.1,
                      marginBottom: '6px',
                      fontVariantNumeric: 'lining-nums tabular-nums',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {isNumeric
                      ? (card.value as number).toLocaleString('en-US')
                      : card.value}
                  </div>

                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      opacity: 0.8,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {card.subtext}
                  </div>
                </Card>
              </motion.div>
            </Col>
          );
        })}
      </Row>

      {/* ============================================ */}
      {/* Distribution Chart with Advanced Animation */}
      {/* ============================================ */}
      <motion.div variants={itemVariants}>
        <Card
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            fontFamily: 'Cairo, sans-serif',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '1.25rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-color)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FFC107, #FFD966)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(255,193,7,0.35)',
                  flexShrink: 0,
                }}
              >
                <FaChartBar size={15} />
              </div>
              <div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    lineHeight: 1.2,
                  }}
                >
                  توزيع التقييمات
                </div>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.7rem',
                    marginTop: '2px',
                    fontWeight: 600,
                  }}
                >
                  تحليل تفصيلي لنسب النجوم
                </div>
              </div>
            </div>

            {stats.total_ratings > 0 && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(232,122,32,0.08)',
                  border: '1px solid rgba(232,122,32,0.2)',
                }}
              >
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                >
                  الإجمالي:
                </span>
                <span
                  style={{
                    color: 'var(--primary-orange)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {stats.total_ratings.toLocaleString('en-US')}
                </span>
              </div>
            )}
          </div>

          {stats.total_ratings === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              لا توجد تقييمات بعد لعرض التوزيع
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                alignItems: 'start',
              }}
            >
              {/* Animated Bars Container */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {[5, 4, 3, 2, 1].map((star, index) => {
                  const count =
                    stats.distribution[
                      String(star) as '1' | '2' | '3' | '4' | '5'
                    ] || 0;
                  const pct =
                    stats.total_ratings > 0
                      ? Math.round((count / stats.total_ratings) * 100)
                      : 0;

                  const starColor =
                    star >= 4 ? '#28A745' : star === 3 ? '#FFC107' : '#DC3545';

                  const starGradient =
                    star >= 4
                      ? 'linear-gradient(90deg, #28A745, #51cf66)'
                      : star === 3
                      ? 'linear-gradient(90deg, #FFC107, #ffec99)'
                      : 'linear-gradient(90deg, #DC3545, #ff6b6b)';

                  return (
                    <motion.div
                      key={star}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.3 }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      {/* Star label */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          minWidth: '46px',
                        }}
                      >
                        <FaStar size={12} color="#FFC107" />
                        <span
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {star}
                        </span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div
                        style={{
                          height: '12px',
                          backgroundColor: 'var(--bg-input)',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          position: 'relative',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{
                            duration: 0.9,
                            delay: 0.2 + index * 0.08,
                            ease: [0.25, 1, 0.5, 1], // Custom smooth easing
                          }}
                          style={{
                            height: '100%',
                            borderRadius: '6px',
                            background: starGradient,
                            boxShadow: `0 0 12px ${starColor}40`,
                            position: 'relative',
                          }}
                        >
                          {/* Inner glowing shine effect */}
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              bottom: 0,
                              right: 0,
                              width: '20px',
                              background:
                                'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                            }}
                          />
                        </motion.div>
                      </div>

                      {/* Count + % */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          minWidth: '82px',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <span
                          style={{
                            color: starColor,
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            fontVariantNumeric: 'tabular-nums',
                            minWidth: '24px',
                            textAlign: 'right',
                          }}
                        >
                          {count}
                        </span>
                        <span
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.7rem',
                            fontVariantNumeric: 'tabular-nums',
                            minWidth: '36px',
                            textAlign: 'left',
                            fontWeight: 600,
                          }}
                        >
                          ({pct}%)
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Summary panel */}
              <div
                style={{
                  padding: '18px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--text-secondary)',
                    marginBottom: '2px',
                  }}
                >
                  ملخص سريع
                </div>

                <SummaryRow
                  label="تقييمات إيجابية (4+ نجوم)"
                  value={`${
                    stats.total_ratings > 0
                      ? Math.round(
                          (((stats.distribution['4'] || 0) +
                            (stats.distribution['5'] || 0)) /
                            stats.total_ratings) *
                            100
                        )
                      : 0
                  }%`}
                  color="#28A745"
                />

                <SummaryRow
                  label="تقييمات سلبية (1-2 نجمة)"
                  value={`${
                    stats.total_ratings > 0
                      ? Math.round(
                          (((stats.distribution['1'] || 0) +
                            (stats.distribution['2'] || 0)) /
                            stats.total_ratings) *
                            100
                        )
                      : 0
                  }%`}
                  color="#DC3545"
                />

                <SummaryRow
                  label="تقييمات محايدة (3 نجوم)"
                  value={`${
                    stats.total_ratings > 0
                      ? Math.round(
                          ((stats.distribution['3'] || 0) /
                            stats.total_ratings) *
                            100
                        )
                      : 0
                  }%`}
                  color="#FFC107"
                />

                <div
                  style={{
                    paddingTop: '12px',
                    marginTop: '2px',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    الأكثر شيوعاً
                  </span>
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                    }}
                  >
                    {getMostCommonRating(stats.distribution)} نجوم
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

const SummaryRow = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
    }}
  >
    <span
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      {label}
    </span>
    <span
      style={{
        color,
        fontSize: '0.82rem',
        fontWeight: 800,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {value}
    </span>
  </div>
);

const getMostCommonRating = (
  distribution: { '1': number; '2': number; '3': number; '4': number; '5': number }
): number => {
  let maxStar = 5;
  let maxCount = -1;
  ([5, 4, 3, 2, 1] as const).forEach((star) => {
    const count = distribution[String(star) as '1' | '2' | '3' | '4' | '5'] || 0;
    if (count > maxCount) {
      maxCount = count;
      maxStar = star;
    }
  });
  return maxStar;
};

export default AdminRatingStatsCards;