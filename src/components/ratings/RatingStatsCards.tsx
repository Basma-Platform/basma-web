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
import { useCardBorderAnimation } from '../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../ui/AnimatedCardBorder';

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
      gradient: 'linear-gradient(90deg, #FFC107, #FFD966)',
      bg: 'rgba(255, 193, 7, 0.1)',
      Icon: FaStar,
    },
    {
      label: 'التقييمات المستلمة',
      value: stats.total_received,
      subtext: 'استلمتها من الآخرين',
      color: '#28A745',
      gradient: 'linear-gradient(90deg, #28A745, #4FCB6E)',
      bg: 'rgba(40, 167, 69, 0.1)',
      Icon: FaInbox,
    },
    {
      label: 'التقييمات المعطاة',
      value: stats.total_given,
      subtext: 'أعطيتها للآخرين',
      color: '#E87A20',
      gradient: 'linear-gradient(90deg, #E87A20, #F5A623)',
      bg: 'rgba(232, 122, 32, 0.1)',
      Icon: FaPaperPlane,
    },
    {
      label: 'مع تعليق',
      value: stats.ratings_with_comments_received,
      subtext: 'تقييمات مع تعليق',
      color: '#17A2B8',
      gradient: 'linear-gradient(90deg, #17A2B8, #20C9E0)',
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
        {cards.map((card, idx) => (
          <Col key={idx} xs={6} lg={3}>
            <RatingStatCardItem card={card} />
          </Col>
        ))}
      </Row>
    </motion.div>
  );
};

// ============================================
// RatingStatCardItem — own border animation hook
// ============================================
interface RatingStatCardItemProps {
  card: StatCard;
}

const RatingStatCardItem = ({ card }: RatingStatCardItemProps) => {
  const Icon = card.Icon;

  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  const isNumeric = typeof card.value === 'number';

  return (
    <div ref={attachRef} {...hoverHandlers} style={{ height: '100%' }}>
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -4 }}
        style={{
          position: 'relative',
          backgroundColor: isDrawn ? card.bg : 'var(--bg-card)',
          border: isDrawn
            ? `1px solid ${card.color}60`
            : '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.1rem',
          boxShadow: isDrawn
            ? `0 8px 24px ${card.color}20`
            : '0 4px 12px var(--shadow-sm)',
          overflow: 'hidden',
          height: '100%',
          fontFamily: 'Cairo, sans-serif',
          transition:
            'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* ✅ Animated TOP border */}
        <AnimatedCardBorder
          isDrawn={isDrawn}
          side="top"
          background={card.gradient}
          drawFrom="start"
          height={3}
          duration={0.55}
          idleOpacity={0}
          rounded
          cardRadius={16}
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

        {/* Header row */}
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
              transition: 'transform 0.3s ease',
              transform: isDrawn ? 'scale(1.06) rotate(-4deg)' : 'scale(1)',
            }}
          >
            <Icon size={15} />
          </div>
        </div>

        {/* Value */}
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

        {/* Subtext */}
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
    </div>
  );
};

export default RatingStatsCards;