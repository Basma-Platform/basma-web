import { motion } from 'framer-motion';
import {
  FaLayerGroup,
  FaCheckCircle,
  FaEyeSlash,
  FaStar,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { useCardBorderAnimation } from '../../../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../../../ui/AnimatedCardBorder';

// ============================================
// Stats shape — same family as other admin stats cards
// ============================================
export interface AdminAchievementStats {
  total: number;
  active: number;
  inactive: number;
  featured: number;
}

export type AdminAchievementStatsFilter =
  | 'all'
  | 'active'
  | 'inactive'
  | 'featured';

interface AdminAchievementStatsCardsProps {
  stats: AdminAchievementStats;
  activeFilter?: AdminAchievementStatsFilter;
  onFilterClick?: (filter: AdminAchievementStatsFilter) => void;
  loading?: boolean;
}

interface StatCard {
  key: AdminAchievementStatsFilter;
  label: string;
  value: number;
  color: string;
  bg: string;
  gradient: string;
  Icon: IconType;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
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

const AdminAchievementStatsCards = ({
  stats,
  activeFilter = 'all',
  onFilterClick,
  loading = false,
}: AdminAchievementStatsCardsProps) => {
  const cards: StatCard[] = [
    {
      key: 'all',
      label: 'الكل',
      value: stats.total,
      color: '#8B5A2B',
      bg: 'rgba(139, 90, 43, 0.1)',
      gradient: 'linear-gradient(90deg, #8B5A2B, #C49A6C)',
      Icon: FaLayerGroup,
    },
    {
      key: 'active',
      label: 'نشط',
      value: stats.active,
      color: '#28A745',
      bg: 'rgba(40, 167, 69, 0.1)',
      gradient: 'linear-gradient(90deg, #28A745, #4FCB6E)',
      Icon: FaCheckCircle,
    },
    {
      key: 'inactive',
      label: 'معطّل',
      value: stats.inactive,
      color: '#6C757D',
      bg: 'rgba(108, 117, 125, 0.1)',
      gradient: 'linear-gradient(90deg, #6C757D, #9CA3AF)',
      Icon: FaEyeSlash,
    },
    {
      key: 'featured',
      label: 'مميز',
      value: stats.featured,
      color: '#FFC107',
      bg: 'rgba(255, 193, 7, 0.1)',
      gradient: 'linear-gradient(90deg, #FFC107, #F5A623)',
      Icon: FaStar,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      dir="rtl"
      className="admin-ach-stats"
    >
      <div className="admin-ach-stats__grid">
        {cards.map((card) => (
          <StatusCard
            key={card.key}
            card={card}
            isActive={activeFilter === card.key}
            clickable={!!onFilterClick}
            loading={loading}
            onClick={() => onFilterClick?.(card.key)}
          />
        ))}
      </div>

      <style>{`
        .admin-ach-stats__grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 1rem;
        }
        @media (min-width: 768px) {
          .admin-ach-stats__grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
          }
        }
        @media (max-width: 380px) {
          .admin-ach-stats__grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
        .admin-ach-skel {
          background-color: var(--border-color);
          animation: adminAchPulse 1.4s ease-in-out infinite;
        }
        @keyframes adminAchPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </motion.div>
  );
};

// ============================================
// StatusCard
// ============================================
const StatusCard = ({
  card,
  isActive,
  clickable,
  loading,
  onClick,
}: {
  card: StatCard;
  isActive: boolean;
  clickable: boolean;
  loading: boolean;
  onClick: () => void;
}) => {
  const Icon = card.Icon;
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  return (
    <div
      ref={attachRef}
      {...hoverHandlers}
      style={{ height: '100%', minWidth: 0 }}
    >
      <motion.button
        variants={itemVariants}
        type="button"
        whileHover={clickable ? { y: -3 } : {}}
        whileTap={clickable ? { scale: 0.98 } : {}}
        onClick={onClick}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          backgroundColor: isActive ? card.bg : 'var(--bg-card)',
          border: isActive
            ? `1.5px solid ${card.color}`
            : '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '14px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: clickable ? 'pointer' : 'default',
          transition: 'all 0.25s ease',
          overflow: 'hidden',
          boxShadow: isActive
            ? `0 4px 16px ${card.color}25`
            : '0 2px 8px var(--shadow-sm)',
          fontFamily: 'Cairo, sans-serif',
          textAlign: 'right',
          boxSizing: 'border-box',
        }}
      >
        <AnimatedCardBorder
          isDrawn={isDrawn || isActive}
          side="top"
          background={card.gradient}
          drawFrom="start"
          height={3}
          duration={0.55}
          idleOpacity={isActive ? 1 : 0}
          rounded
          cardRadius={14}
        />

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
            boxShadow: `0 4px 12px ${card.color}35`,
          }}
        >
          <Icon size={17} />
        </div>

        <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
          <div
            style={{
              color: 'var(--text-primary)',
              fontSize: '1.3rem',
              fontWeight: 900,
              lineHeight: 1.1,
              fontFamily:
                "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              fontVariantNumeric: 'lining-nums tabular-nums',
              marginBottom: '2px',
            }}
          >
            {loading ? (
              <span
                className="admin-ach-skel"
                style={{
                  display: 'inline-block',
                  width: '32px',
                  height: '20px',
                  borderRadius: '6px',
                }}
              />
            ) : (
              card.value.toLocaleString('en-US')
            )}
          </div>
          <div
            style={{
              color: isActive ? card.color : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {card.label}
          </div>
        </div>

        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400 }}
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: card.color,
              boxShadow: `0 0 8px ${card.color}80`,
            }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default AdminAchievementStatsCards;