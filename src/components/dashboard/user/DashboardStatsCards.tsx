import { Card } from 'react-bootstrap';
import {
  FaBullhorn,
  FaEye,
  FaHeart,
  FaStar,
  FaCrown,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import type { DashboardStats } from '../../../types';
import { useCardBorderAnimation } from '../../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../../ui/AnimatedCardBorder';

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

// ============================================
// StatCard — individual card with animated top border
// ============================================
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  index: number;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  bgColor,
  index,
}: StatCardProps) => {
  // ✅ One hook instance per card — stable ref
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  return (
    // ✅ OUTER: owns ref + hover detection. NO motion.
    <div ref={attachRef} {...hoverHandlers} style={{ height: '100%' }}>
      {/* ✅ INNER: motion only. NO ref. */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.06 }}
        whileHover={{ y: -4 }}
        style={{ height: '100%' }}
      >
        <Card
          className="position-relative overflow-hidden h-100"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: `1px solid ${
              isDrawn ? `${color}50` : 'var(--border-color)'
            }`,
            borderRadius: '14px',
            padding: '1.1rem 1rem',
            boxShadow: isDrawn
              ? '0 8px 24px var(--shadow-md)'
              : '0 4px 12px var(--shadow-sm)',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
            position: 'relative',
          }}
        >
          {/* ============================================ */}
          {/* ✨ Animated Top Accent Bar */}
          {/* Idle    → hidden                         */}
          {/* Hovered → draws right-to-left (RTL)      */}
          {/* Touch   → draws on scroll into view      */}
          {/* ============================================ */}
          <AnimatedCardBorder
            isDrawn={isDrawn}
            side="top"
            background={`linear-gradient(90deg, ${color}, ${color}CC)`}
            drawFrom="start"
            height={4}
            duration={0.55}
            idleOpacity={0}
            rounded
            cardRadius={14}
          />

          {/* Metallic Glow Overlay */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)',
              pointerEvents: 'none',
              opacity: 0,
            }}
            whileHover={{ opacity: 1 }}
          />

          <div className="d-flex align-items-center justify-content-between gap-2">
            <div style={{ minWidth: 0, flex: 1 }}>
              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </span>
              <h3
                className="mt-2 mb-0"
                style={{
                  color: 'var(--text-primary)',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                }}
              >
                <span
                  style={{
                    fontFamily:
                      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    fontFeatureSettings: '"lnum" 1, "tnum" 1',
                    fontVariantNumeric: 'lining-nums tabular-nums',
                    direction: 'ltr',
                    display: 'inline-block',
                  }}
                >
                  {value}
                </span>
              </h3>
            </div>

            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '11px',
                backgroundColor: bgColor,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

// ============================================
// Main component
// ============================================
const DashboardStatsCards = ({ stats }: DashboardStatsCardsProps) => {
  const formatValue = (val: number) => {
    return (val || 0).toLocaleString('en-US');
  };

  const formatRating = (rating: number) => {
    return Number(rating || 0).toFixed(1);
  };

  const cards = [
    {
      title: 'خدماتي',
      value: formatValue(stats.announcements_count),
      icon: <FaBullhorn size={20} />,
      color: '#E87A20',
      bgColor: 'rgba(232, 122, 32, 0.1)',
    },
    {
      title: 'المشاهدات',
      value: formatValue(stats.total_views),
      icon: <FaEye size={20} />,
      color: '#17A2B8',
      bgColor: 'rgba(23, 162, 184, 0.1)',
    },
    {
      title: 'الإعجابات',
      value: formatValue(stats.total_likes_received),
      icon: <FaHeart size={20} />,
      color: '#DC3545',
      bgColor: 'rgba(220, 53, 69, 0.1)',
    },
    {
      title: 'التقييم العام',
      value: `${formatRating(stats.average_rating)} / 5`,
      icon: <FaStar size={20} />,
      color: '#FFC107',
      bgColor: 'rgba(255, 193, 7, 0.1)',
    },
    {
      title: 'خدمات مميزة',
      value: formatValue(stats.featured_count),
      icon: <FaCrown size={20} />,
      color: '#9C27B0',
      bgColor: 'rgba(156, 39, 176, 0.1)',
    },
  ];

  return (
    <>
      <style>{`
        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          width: 100%;
        }
        @media (max-width: 1199px) {
          .dashboard-stats-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 767px) {
          .dashboard-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .dashboard-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dashboard-stats-grid">
        {cards.map((card, index) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            bgColor={card.bgColor}
            index={index}
          />
        ))}
      </div>
    </>
  );
};

export default DashboardStatsCards;