import { motion } from 'framer-motion';
import {
  FaLayerGroup,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaArchive,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { HelpRequestLimits } from '../../../../types';
import { useCardBorderAnimation } from '../../../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../../../ui/AnimatedCardBorder';

export type HelpRequestStatusFilter =
  | 'all'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'archived';

interface HelpRequestStatsCardsProps {
  limits: HelpRequestLimits | null;
  activeFilter?: HelpRequestStatusFilter;
  onFilterClick?: (filter: HelpRequestStatusFilter) => void;
  loading?: boolean;
}

interface StatCard {
  key: HelpRequestStatusFilter;
  label: string;
  value: number;
  color: string;
  bg: string;
  gradient: string;
  Icon: IconType;
}

/**
 * Stats cards for the owner's Help Requests.
 * Clickable — clicking a card sets the status tab filter below.
 * Design mirrors MyAnnouncementStats.
 */
const HelpRequestStatsCards = ({
  limits,
  activeFilter = 'all',
  onFilterClick,
  loading = false,
}: HelpRequestStatsCardsProps) => {
  const cards: StatCard[] = [
    {
      key: 'all',
      label: 'الكل',
      value:
        (limits?.pending_count ?? 0) +
        (limits?.approved_count ?? 0) +
        (limits?.rejected_count ?? 0) +
        (limits?.archived_count ?? 0),
      color: '#8B5A2B',
      bg: 'rgba(139, 90, 43, 0.1)',
      gradient: 'linear-gradient(135deg, #8B5A2B, #C49A6C)',
      Icon: FaLayerGroup,
    },
    {
      key: 'pending',
      label: 'قيد المراجعة',
      value: limits?.pending_count ?? 0,
      color: '#FFB800',
      bg: 'rgba(255, 184, 0, 0.1)',
      gradient: 'linear-gradient(135deg, #FFB800, #F5A623)',
      Icon: FaHourglassHalf,
    },
    {
      key: 'approved',
      label: 'منشور',
      value: limits?.approved_count ?? 0,
      color: '#28A745',
      bg: 'rgba(40, 167, 69, 0.1)',
      gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
      Icon: FaCheckCircle,
    },
    {
      key: 'rejected',
      label: 'مرفوض',
      value: limits?.rejected_count ?? 0,
      color: '#DC3545',
      bg: 'rgba(220, 53, 69, 0.1)',
      gradient: 'linear-gradient(135deg, #DC3545, #F56575)',
      Icon: FaTimesCircle,
    },
    {
      key: 'archived',
      label: 'مؤرشف',
      value: limits?.archived_count ?? 0,
      color: '#6B4226',
      bg: 'rgba(107, 66, 38, 0.1)',
      gradient: 'linear-gradient(135deg, #6B4226, #8B5A2B)',
      Icon: FaArchive,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir="rtl"
      style={{ marginBottom: '1rem' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
        }}
      >
        {cards.map((card) => (
          <motion.div key={card.key} variants={itemVariants}>
            <StatCardItem
              card={card}
              isActive={activeFilter === card.key}
              clickable={!!onFilterClick}
              loading={loading}
              onClick={() => onFilterClick?.(card.key)}
            />
          </motion.div>
        ))}
      </div>

      {limits && limits.max_active >= 9999 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '12px 16px',
            marginTop: '1rem',
            background:
              'linear-gradient(135deg, rgba(40,167,69,0.08), rgba(40,167,69,0.03))',
            border: '1px solid rgba(40,167,69,0.25)',
            borderRadius: '12px',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <FaCheckCircle size={16} color="#28A745" />
          <span
            style={{
              color: '#28A745',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            حسابك موثق — طلبات غير محدودة ✨
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================
// StatCardItem
// ============================================
interface StatCardItemProps {
  card: StatCard;
  isActive: boolean;
  clickable: boolean;
  loading: boolean;
  onClick: () => void;
}

const StatCardItem = ({
  card,
  isActive,
  clickable,
  loading,
  onClick,
}: StatCardItemProps) => {
  const Icon = card.Icon;

  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  const isHoverHighlighted = isDrawn && !isActive && clickable;
  const isVisuallyActive = isActive || isHoverHighlighted;

  return (
    <div ref={attachRef} {...hoverHandlers} style={{ height: '100%' }}>
      <motion.button
        type="button"
        whileHover={clickable ? { y: -3 } : {}}
        whileTap={clickable ? { scale: 0.98 } : {}}
        onClick={() => clickable && onClick()}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: isVisuallyActive ? card.bg : 'var(--bg-card)',
          border: isVisuallyActive
            ? `1.5px solid ${card.color}`
            : '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '14px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: clickable ? 'pointer' : 'default',
          transition:
            'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          overflow: 'hidden',
          boxShadow: isVisuallyActive
            ? `0 4px 16px ${card.color}25`
            : '0 2px 8px var(--shadow-sm)',
          fontFamily: 'Cairo, sans-serif',
          textAlign: 'right',
        }}
      >
        <AnimatedCardBorder
          isDrawn={isDrawn || isActive}
          background={card.gradient}
          drawFrom="start"
          height={3}
          duration={0.55}
          idleOpacity={isActive ? 1 : 0}
          rounded
          cardRadius={14}
        />

        <motion.div
          whileHover={clickable ? { rotate: 6, scale: 1.08 } : {}}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
          }}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: card.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '1rem',
            flexShrink: 0,
            boxShadow: `0 4px 12px ${card.color}35`,
          }}
        >
          <Icon size={17} />
        </motion.div>

        <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
          <div
            style={{
              color: 'var(--text-primary)',
              fontSize: '1.4rem',
              fontWeight: 900,
              lineHeight: 1.1,
              fontFamily:
                "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              fontVariantNumeric: 'lining-nums tabular-nums',
              direction: 'ltr',
              textAlign: 'right',
              marginBottom: '2px',
            }}
          >
            {loading ? (
              <span
                className="hr-stat-skel"
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
              color: isVisuallyActive ? card.color : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'color 0.3s ease',
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

        <style>{`
          .hr-stat-skel {
            background-color: var(--border-color);
            animation: hrStatPulse 1.4s ease-in-out infinite;
          }
          @keyframes hrStatPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.85; }
          }
        `}</style>
      </motion.button>
    </div>
  );
};

export default HelpRequestStatsCards;