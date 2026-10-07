import { motion } from 'framer-motion';
import {
  FaLayerGroup,
  FaCheckCircle,
  FaPauseCircle,
  FaStar,
  FaFlagCheckered,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { UserAnnouncementStats } from '../../../../types';
import { useCardBorderAnimation } from '../../../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../../../ui/AnimatedCardBorder';

interface MyAnnouncementStatsProps {
  stats: UserAnnouncementStats;
  activeFilter?: 'all' | 'active' | 'disabled' | 'completed' | 'featured';
  onFilterClick?: (
    filter: 'all' | 'active' | 'disabled' | 'completed' | 'featured'
  ) => void;
}

interface StatCard {
  key: 'all' | 'active' | 'disabled' | 'completed' | 'featured';
  label: string;
  value: number;
  color: string;
  bg: string;
  gradient: string;
  Icon: IconType;
}

const MyAnnouncementStats = ({
  stats,
  activeFilter = 'all',
  onFilterClick,
}: MyAnnouncementStatsProps) => {
  const cards: StatCard[] = [
    {
      key: 'all',
      label: 'الكل',
      value: stats.total,
      color: '#8B5A2B',
      bg: 'rgba(139, 90, 43, 0.1)',
      gradient: 'linear-gradient(135deg, #8B5A2B, #C49A6C)',
      Icon: FaLayerGroup,
    },
    {
      key: 'active',
      label: 'نشط',
      value: stats.active,
      color: '#28A745',
      bg: 'rgba(40, 167, 69, 0.1)',
      gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
      Icon: FaCheckCircle,
    },
    {
      key: 'disabled',
      label: 'معطل',
      value: stats.disabled,
      color: '#FFC107',
      bg: 'rgba(255, 193, 7, 0.1)',
      gradient: 'linear-gradient(135deg, #FFC107, #FFD966)',
      Icon: FaPauseCircle,
    },
    {
      key: 'completed',
      label: 'مكتمل',
      value: stats.completed || 0,
      color: '#17A2B8',
      bg: 'rgba(23, 162, 184, 0.1)',
      gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
      Icon: FaFlagCheckered,
    },
    {
      key: 'featured',
      label: 'مميز',
      value: stats.featured,
      color: '#E87A20',
      bg: 'rgba(232, 122, 32, 0.1)',
      gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
      Icon: FaStar,
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
    >
      {/* 5 cards → responsive auto-fit grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
          marginBottom: '1rem',
        }}
      >
        {cards.map((card) => (
          <motion.div key={card.key} variants={itemVariants}>
            <StatCardItem
              card={card}
              isActive={activeFilter === card.key}
              clickable={!!onFilterClick}
              onClick={() => onFilterClick?.(card.key)}
            />
          </motion.div>
        ))}
      </div>

      {/* Monthly Limit Indicator */}
      {!stats.is_verified && stats.monthly_limit !== null && (
        <div style={{ marginBottom: '1rem' }}>
          <MonthlyLimitInline
            used={stats.monthly_used}
            limit={stats.monthly_limit}
            remaining={stats.monthly_remaining || 0}
            canCreateMore={stats.can_create_more}
          />
        </div>
      )}

      {/* Verified Unlimited Banner */}
      {stats.is_verified && (
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
            marginBottom: '1rem',
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
            حسابك موثق - خدمات غير محدودة ✨
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================
// StatCardItem — one card, with its own hook instance
// ============================================
interface StatCardItemProps {
  card: StatCard;
  isActive: boolean;
  clickable: boolean;
  onClick: () => void;
}

const StatCardItem = ({
  card,
  isActive,
  clickable,
  onClick,
}: StatCardItemProps) => {
  const Icon = card.Icon;

  // ✨ Single hook drives BOTH:
  //    - top border draw animation
  //    - background/border hover highlight
  const { ref, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  // Card is "highlighted" when: active filter OR being drawn (hover/in-view)
  // But if it's touch (in-view trigger), we don't want to auto-highlight all cards
  // → only apply highlight on hover devices
  const isHoverHighlighted = isDrawn && !isActive && clickable;
  const isVisuallyActive = isActive || isHoverHighlighted;

  return (
    // ✨ The outer div carries the IntersectionObserver ref
    //    and the hover handlers — the button is pure presentation
    <div ref={ref} {...hoverHandlers} style={{ height: '100%' }}>
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
        {/* ============================================ */}
        {/* ✨ Animated Top Accent Bar */}
        {/* Idle       → hidden                    */}
        {/* Hovered    → draws from right to left  */}
        {/* Active     → stays fully drawn         */}
        {/* ============================================ */}
        <AnimatedCardBorder
          isDrawn={isDrawn || isActive}
          background={card.gradient}
          drawFrom="start"
          height={3}
          duration={0.55}
          idleOpacity={isActive ? 1 : 0}
          rounded
        />

        {/* Icon */}
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

        {/* Value + Label */}
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
            {card.value.toLocaleString('en-US')}
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

        {/* Active dot — only for the currently-active filter */}
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
// Inline Monthly Limit Component (unchanged)
// ============================================
interface MonthlyLimitInlineProps {
  used: number;
  limit: number;
  remaining: number;
  canCreateMore: boolean;
}

const MonthlyLimitInline = ({
  used,
  limit,
  remaining,
  canCreateMore,
}: MonthlyLimitInlineProps) => {
  const percentage = Math.min((used / limit) * 100, 100);

  const getColor = (): string => {
    if (percentage >= 100) return '#DC3545';
    if (percentage >= 80) return '#FFC107';
    return '#28A745';
  };

  const color = getColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        padding: '14px 16px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        boxShadow: '0 2px 8px var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        flexWrap: 'wrap',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flex: '1 1 200px',
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            flexShrink: 0,
          }}
        >
          <FaLayerGroup size={15} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '2px',
            }}
          >
            الحد الشهري
          </div>
          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
            }}
          >
            {canCreateMore
              ? `يمكنك نشر ${remaining} ${
                  remaining === 1 ? 'عرض/طلب' : 'عروض/طلبات'
                } إضافية`
              : 'لقد وصلت للحد الأقصى هذا الشهر'}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: '0 1 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '2px',
            direction: 'ltr',
            unicodeBidi: 'isolate',
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
            fontVariantNumeric: 'lining-nums tabular-nums',
          }}
        >
          <span
            style={{
              color: color,
              fontSize: '1.4rem',
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {used}
          </span>
          <span
            style={{
              color: color,
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            /
          </span>
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {limit}
          </span>
        </div>

        <div
          style={{
            width: '100px',
            height: '8px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '4px',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${color}, ${color}CC)`,
              borderRadius: '4px',
              boxShadow: `0 0 8px ${color}50`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MyAnnouncementStats;