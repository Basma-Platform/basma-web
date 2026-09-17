import { Row, Col, Card } from 'react-bootstrap';
import { FaBullhorn, FaEye, FaHeart, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import type { ProfileStats } from '../../../types';

interface ProfileStatsCardsProps {
  stats: ProfileStats;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ProfileStatsCards = ({ stats }: ProfileStatsCardsProps) => {
  // ✅ Format numbers with Western digits (0-9)
  const formatValue = (val: number) => {
    return (val || 0).toLocaleString('en-US');
  };

  // ✅ Format rating (always 1 decimal)
  const formatRating = (rating: number) => {
    return Number(rating || 0).toFixed(1);
  };

  const cards = [
    {
      title: 'إعلاناتي',
      value: formatValue(stats.announcements_count),
      subtext: 'إجمالي الإعلانات',
      icon: <FaBullhorn size={22} />,
      color: '#E87A20',
      bgColor: 'rgba(232, 122, 32, 0.1)',
      gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
    },
    {
      title: 'المشاهدات',
      value: formatValue(stats.total_views),
      subtext: 'إجمالي المشاهدات',
      icon: <FaEye size={22} />,
      color: '#17A2B8',
      bgColor: 'rgba(23, 162, 184, 0.1)',
      gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
    },
    {
      title: 'الإعجابات',
      value: formatValue(stats.total_likes_received),
      subtext: 'إعجابات مستلمة',
      icon: <FaHeart size={22} />,
      color: '#DC3545',
      bgColor: 'rgba(220, 53, 69, 0.1)',
      gradient: 'linear-gradient(135deg, #DC3545, #F56575)',
    },
    {
      title: 'التقييم العام',
      value: `${formatRating(stats.average_rating)} / 5`,
      subtext: 'متوسط التقييمات',
      icon: <FaStar size={22} />,
      color: '#FFC107',
      bgColor: 'rgba(255, 193, 7, 0.1)',
      gradient: 'linear-gradient(135deg, #FFC107, #FFD966)',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      dir="rtl"
    >
      <Row className="g-3">
        {cards.map((card, index) => (
          <Col key={index} xs={12} sm={6} lg={3}>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
              }}
              whileHover={{
                y: -6,
                transition: { duration: 0.2, ease: 'easeInOut' },
              }}
              className="h-100"
            >
              <Card
                className="position-relative overflow-hidden h-100 border-0"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '18px',
                  padding: '1.35rem',
                  boxShadow: '0 6px 20px var(--shadow-sm)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 14px 35px ${card.color}25`;
                  e.currentTarget.style.borderColor = card.color + '50';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 20px var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                {/* Top Gradient Bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    height: '5px',
                    background: card.gradient,
                    opacity: 0.9,
                  }}
                />

                {/* Decorative Glowing Background Orb */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-35px',
                    left: '-35px',
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    backgroundColor: card.bgColor,
                    pointerEvents: 'none',
                    opacity: 0.6,
                    filter: 'blur(10px)',
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'right' }}>
                  {/* Header: Title + Icon */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 700,
                      }}
                    >
                      {card.title}
                    </span>

                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: card.gradient,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 6px 16px ${card.color}45`,
                      }}
                    >
                      {card.icon}
                    </motion.div>
                  </div>

                  {/* Value */}
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      fontWeight: 800,
                      fontSize: 'clamp(1.5rem, 2vw, 1.85rem)',
                      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                      fontFeatureSettings: '"lnum" 1, "tnum" 1',
                      fontVariantNumeric: 'lining-nums tabular-nums',
                      direction: 'ltr',
                      textAlign: 'right',
                      marginBottom: '6px',
                      lineHeight: 1.2,
                    }}
                  >
                    {card.value}
                  </h3>

                  {/* Subtext */}
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontFamily: 'Cairo, sans-serif',
                      opacity: 0.75,
                      fontWeight: 600,
                    }}
                  >
                    {card.subtext}
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </motion.div>
  );
};

export default ProfileStatsCards;