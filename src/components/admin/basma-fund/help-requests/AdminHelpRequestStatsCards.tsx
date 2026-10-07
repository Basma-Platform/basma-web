import { motion } from 'framer-motion';
import {
  FaLayerGroup,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaArchive,
  FaEye,
  FaInbox,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminHelpRequestStats } from '../../../../types';
import { useCardBorderAnimation } from '../../../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../../../ui/AnimatedCardBorder';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';

export type AdminHelpRequestStatusFilter =
  | 'all'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'archived';

interface AdminHelpRequestStatsCardsProps {
  stats: AdminHelpRequestStats;
  activeFilter?: AdminHelpRequestStatusFilter;
  onFilterClick?: (filter: AdminHelpRequestStatusFilter) => void;
}

interface StatCard {
  key?: AdminHelpRequestStatusFilter;
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

/**
 * Admin stats cards for help requests.
 * Row 1: clickable status filters.
 * Row 2: total + today (informational).
 */
const AdminHelpRequestStatsCards = ({
  stats,
  activeFilter = 'all',
  onFilterClick,
}: AdminHelpRequestStatsCardsProps) => {
  const statusCards: StatCard[] = [
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
      key: 'pending',
      label: 'قيد المراجعة',
      value: stats.pending,
      color: '#FFB800',
      bg: 'rgba(255, 184, 0, 0.1)',
      gradient: 'linear-gradient(90deg, #FFB800, #F5A623)',
      Icon: FaHourglassHalf,
    },
    {
      key: 'approved',
      label: 'منشور',
      value: stats.approved,
      color: '#28A745',
      bg: 'rgba(40, 167, 69, 0.1)',
      gradient: 'linear-gradient(90deg, #28A745, #4FCB6E)',
      Icon: FaCheckCircle,
    },
    {
      key: 'rejected',
      label: 'مرفوض',
      value: stats.rejected,
      color: '#DC3545',
      bg: 'rgba(220, 53, 69, 0.1)',
      gradient: 'linear-gradient(90deg, #DC3545, #F56575)',
      Icon: FaTimesCircle,
    },
    {
      key: 'archived',
      label: 'مؤرشف',
      value: stats.archived,
      color: '#6B4226',
      bg: 'rgba(107, 66, 38, 0.1)',
      gradient: 'linear-gradient(90deg, #6B4226, #8B5A2B)',
      Icon: FaArchive,
    },
  ];

  const infoCards: StatCard[] = [
    {
      label: 'إجمالي المشاهدات',
      value: stats.total_views ?? 0,
      color: FUND_THEME.accent,
      bg: `${FUND_THEME.accent}15`,
      gradient: FUND_THEME.gradient,
      Icon: FaEye,
    },
    {
      label: 'وارد اليوم',
      value: stats.today_new,
      color: '#E87A20',
      bg: 'rgba(232, 122, 32, 0.1)',
      gradient: 'linear-gradient(90deg, #E87A20, #F5A623)',
      Icon: FaInbox,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      dir="rtl"
      className="admin-hr-stats"
    >
      {/* Row 1: Status filters */}
      <div className="admin-hr-stats__status-grid">
        {statusCards.map((card) => (
          <StatusCard
            key={card.key || card.label}
            card={card}
            isActive={activeFilter === card.key}
            clickable={!!onFilterClick && !!card.key}
            onClick={() => card.key && onFilterClick?.(card.key)}
          />
        ))}
      </div>

      {/* Row 2: Info cards */}
      <div className="admin-hr-stats__info-grid">
        {infoCards.map((card, i) => (
          <InfoCard key={i} card={card} />
        ))}
      </div>

      <style>{`
        .admin-hr-stats__status-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 12px;
        }

        .admin-hr-stats__info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        @media (min-width: 768px) {
          .admin-hr-stats__status-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 12px;
          }
          .admin-hr-stats__info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
        }

        @media (max-width: 380px) {
          .admin-hr-stats__status-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
      `}</style>
    </motion.div>
  );
};

// ============================================
// StatusCard
// ============================================
interface StatusCardProps {
  card: StatCard;
  isActive: boolean;
  clickable: boolean;
  onClick: () => void;
}

const StatusCard = ({ card, isActive, clickable, onClick }: StatusCardProps) => {
  const Icon = card.Icon;
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  return (
    <div ref={attachRef} {...hoverHandlers} style={{ height: '100%', minWidth: 0 }}>
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
          {card.key === 'pending' ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-flex' }}
            >
              <Icon size={17} />
            </motion.span>
          ) : (
            <Icon size={17} />
          )}
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
            {card.value.toLocaleString('en-US')}
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

// ============================================
// InfoCard
// ============================================
interface InfoCardProps {
  card: StatCard;
}

const InfoCard = ({ card }: InfoCardProps) => {
  const Icon = card.Icon;
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  return (
    <div ref={attachRef} {...hoverHandlers} style={{ height: '100%', minWidth: 0 }}>
      <motion.div
        variants={itemVariants}
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '1rem 1.15rem',
          boxShadow: isDrawn
            ? '0 8px 24px var(--shadow-md)'
            : '0 2px 8px var(--shadow-sm)',
          overflow: 'hidden',
          height: '100%',
          fontFamily: 'Cairo, sans-serif',
          boxSizing: 'border-box',
          transition: 'box-shadow 0.25s ease',
        }}
      >
        <AnimatedCardBorder
          isDrawn={isDrawn}
          side="right"
          background={card.gradient}
          drawFrom="start"
          height={4}
          duration={0.55}
          idleOpacity={0}
          rounded
          cardRadius={14}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
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
              boxShadow: `0 4px 12px ${card.color}55`,
            }}
          >
            <Icon size={17} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 700,
                marginBottom: '3px',
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                color: 'var(--text-primary)',
                fontSize: 'clamp(1.05rem, 3.4vw, 1.3rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                fontFamily:
                  "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                fontVariantNumeric: 'lining-nums tabular-nums',
              }}
            >
              {card.value.toLocaleString('en-US')}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminHelpRequestStatsCards;