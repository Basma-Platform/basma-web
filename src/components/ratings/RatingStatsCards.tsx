import { Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaStar,
  FaInbox,
  FaPaperPlane,
  FaCommentAlt,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { MyRatingStats } from '../../types';

interface RatingStatsCardsProps {
  stats: MyRatingStats;
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
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
};

const RatingStatsCards = ({ stats }: RatingStatsCardsProps) => {
  const cards: StatCard[] = [
    {
      label: 'التقييم العام',
      value: stats.average_rating ? stats.average_rating.toFixed(1) : '—',
      subtext: 'متوسط تقييماتك',
      color: '#FFC107',
      gradient: 'linear-gradient(135deg, #FFC107, #FFD966)',
      bg: 'rgba(255, 193, 7, 0.1)',
      Icon: FaStar,
    },
    {
      label: 'التقييمات المستلمة',
      value: stats.total_received,
      subtext: 'استلمتها من الآخرين',
      color: '#28A745',
      gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
      bg: 'rgba(40, 167, 69, 0.1)',
      Icon: FaInbox,
    },
    {
      label: 'التقييمات المعطاة',
      value: stats.total_given,
      subtext: 'أعطيتها للآخرين',
      color: '#E87A20',
      gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
      bg: 'rgba(232, 122, 32, 0.1)',
      Icon: FaPaperPlane,
    },
    {
      label: 'مع تعليق',
      value: stats.ratings_with_comments_received,
      subtext: 'تقييمات مع تعليق',
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
      <Row className="g-3">
        {cards.map((card, idx) => {
          const Icon = card.Icon;
          const isNumeric = typeof card.value === 'number';

          return (
            <Col key={idx} xs={6} lg={3}>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '1.1rem',
                  boxShadow: '0 4px 12px var(--shadow-sm)',
                  overflow: 'hidden',
                  height: '100%',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                {/* Top accent bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    height: '3px',
                    background: card.gradient,
                  }}
                />

                {/* Glow */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    backgroundColor: card.bg,
                    filter: 'blur(8px)',
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
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {card.label}
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: card.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0,
                      boxShadow: `0 4px 10px ${card.color}30`,
                    }}
                  >
                    <Icon size={15} />
                  </div>
                </div>

                <div
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: isNumeric ? '1.6rem' : '1.5rem',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    marginBottom: '4px',
                    fontFamily:
                      "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
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
                    fontSize: '0.68rem',
                    opacity: 0.75,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {card.subtext}
                </div>
              </motion.div>
            </Col>
          );
        })}
      </Row>
    </motion.div>
  );
};

export default RatingStatsCards;