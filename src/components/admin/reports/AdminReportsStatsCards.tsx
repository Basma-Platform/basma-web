import { Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaLayerGroup,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaFlag,
  FaBullhorn,
  FaUser,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminReportsStats } from '../../../types';
import { formatReportNumber } from '../../../utils/reportHelpers';

interface AdminReportsStatsCardsProps {
  stats: AdminReportsStats;
  activeStatus?: 'all' | 'pending' | 'reviewed' | 'rejected';
  onStatusClick?: (
    status: 'all' | 'pending' | 'reviewed' | 'rejected'
  ) => void;
}

interface StatCard {
  key?: 'all' | 'pending' | 'reviewed' | 'rejected';
  label: string;
  value: number;
  color: string;
  gradient: string;
  bg: string;
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

const AdminReportsStatsCards = ({
  stats,
  activeStatus = 'all',
  onStatusClick,
}: AdminReportsStatsCardsProps) => {
  const statusCards: StatCard[] = [
    {
      key: 'all',
      label: 'الكل',
      value: stats.reports.total,
      color: '#8B5A2B',
      gradient: 'linear-gradient(135deg, #8B5A2B, #C49A6C)',
      bg: 'rgba(139, 90, 43, 0.1)',
      Icon: FaLayerGroup,
    },
    {
      key: 'pending',
      label: 'قيد المراجعة',
      value: stats.reports.pending,
      color: '#FFC107',
      gradient: 'linear-gradient(135deg, #FFC107, #FFD966)',
      bg: 'rgba(255, 193, 7, 0.1)',
      Icon: FaHourglassHalf,
    },
    {
      key: 'reviewed',
      label: 'تمت المعالجة',
      value: stats.reports.reviewed,
      color: '#28A745',
      gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
      bg: 'rgba(40, 167, 69, 0.1)',
      Icon: FaCheckCircle,
    },
    {
      key: 'rejected',
      label: 'مرفوضة',
      value: stats.reports.rejected,
      color: '#6C757D',
      gradient: 'linear-gradient(135deg, #6C757D, #9CA3AF)',
      bg: 'rgba(108, 117, 125, 0.1)',
      Icon: FaTimesCircle,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      dir="rtl"
      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      {/* ============================================
          Row 1: Status cards (clickable filters)
          ============================================ */}
      <Row className="g-3">
        {statusCards.map((card) => {
          const isActive = activeStatus === card.key;
          const clickable = !!onStatusClick && !!card.key;
          const Icon = card.Icon;

          return (
            <Col key={card.key || card.label} xs={6} lg={3}>
              <motion.button
                variants={itemVariants}
                type="button"
                whileHover={clickable ? { y: -4 } : {}}
                whileTap={clickable ? { scale: 0.98 } : {}}
                onClick={() =>
                  clickable && card.key && onStatusClick?.(card.key)
                }
                style={{
                  width: '100%',
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
                }}
                onMouseEnter={(e) => {
                  if (!clickable || isActive) return;
                  e.currentTarget.style.borderColor = card.color + '60';
                  e.currentTarget.style.backgroundColor = card.bg;
                }}
                onMouseLeave={(e) => {
                  if (!clickable || isActive) return;
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    height: '3px',
                    background: card.gradient,
                    opacity: isActive ? 1 : 0.5,
                  }}
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

                <div
                  style={{ flex: 1, minWidth: 0, textAlign: 'right' }}
                >
                  <div
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      lineHeight: 1.1,
                      fontFamily:
                        "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                      fontVariantNumeric: 'lining-nums tabular-nums',
                      marginBottom: '2px',
                    }}
                  >
                    {formatReportNumber(card.value)}
                  </div>
                  <div
                    style={{
                      color: isActive ? card.color : 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
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
            </Col>
          );
        })}
      </Row>

      {/* ============================================
          Row 2: Priority + Target + Today
          ============================================ */}
      <Row className="g-3">
        {/* Priority Card */}
        <Col xs={12} md={6} lg={4}>
          <motion.div
            variants={itemVariants}
            style={{
              position: 'relative',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1rem 1.15rem',
              boxShadow: '0 2px 8px var(--shadow-sm)',
              overflow: 'hidden',
              height: '100%',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(180deg, #DC3545, #F56575)',
                opacity: 0.7,
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #DC3545, #F56575)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(220,53,69,0.35)',
                }}
              >
                <FaExclamationTriangle size={14} />
              </div>
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                }}
              >
                حسب الأولوية
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <PriorityRow
                label="عالية"
                value={stats.by_priority.high}
                color="#DC3545"
              />
              <PriorityRow
                label="متوسطة"
                value={stats.by_priority.medium}
                color="#FFC107"
              />
              <PriorityRow
                label="منخفضة"
                value={stats.by_priority.low}
                color="#17A2B8"
              />
            </div>
          </motion.div>
        </Col>

        {/* Target Type Card */}
        <Col xs={12} md={6} lg={4}>
          <motion.div
            variants={itemVariants}
            style={{
              position: 'relative',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1rem 1.15rem',
              boxShadow: '0 2px 8px var(--shadow-sm)',
              overflow: 'hidden',
              height: '100%',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(180deg, #E87A20, #F5A623)',
                opacity: 0.7,
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(232,122,32,0.35)',
                }}
              >
                <FaFlag size={14} />
              </div>
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                }}
              >
                حسب النوع
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <TargetRow
                Icon={FaUser}
                label="بلاغات مستخدمين"
                value={stats.by_target.user}
                color="#E87A20"
              />
              <TargetRow
                Icon={FaBullhorn}
                label="بلاغات إعلانات"
                value={stats.by_target.announcement}
                color="#17A2B8"
              />
            </div>
          </motion.div>
        </Col>

        {/* Today Card */}
        <Col xs={12} lg={4}>
          <motion.div
            variants={itemVariants}
            style={{
              position: 'relative',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1rem 1.15rem',
              boxShadow: '0 2px 8px var(--shadow-sm)',
              overflow: 'hidden',
              height: '100%',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(180deg, #17A2B8, #20C9E0)',
                opacity: 0.7,
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(23,162,184,0.35)',
                }}
              >
                <FaHourglassHalf size={14} />
              </div>
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                }}
              >
                نشاط اليوم
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              <TodayChip
                label="بلاغات جديدة"
                value={stats.today.new}
                color="#FFC107"
              />
              <TodayChip
                label="تمت معالجتها"
                value={stats.today.processed}
                color="#28A745"
              />
            </div>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

// ============================================
// Helpers
// ============================================

const PriorityRow = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      padding: '6px 10px',
      borderRadius: '8px',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
    }}
  >
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 6px ${color}80`,
        }}
      />
      {label}
    </span>
    <span
      style={{
        color,
        fontSize: '0.85rem',
        fontWeight: 800,
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {formatReportNumber(value)}
    </span>
  </div>
);

const TargetRow = ({
  Icon,
  label,
  value,
  color,
}: {
  Icon: IconType;
  label: string;
  value: number;
  color: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      padding: '6px 10px',
      borderRadius: '8px',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
    }}
  >
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      <Icon size={11} color={color} />
      {label}
    </span>
    <span
      style={{
        color,
        fontSize: '0.85rem',
        fontWeight: 800,
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {formatReportNumber(value)}
    </span>
  </div>
);

const TodayChip = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div
    style={{
      padding: '10px 8px',
      borderRadius: '10px',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        color,
        fontSize: '1.3rem',
        fontWeight: 900,
        lineHeight: 1.1,
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        fontVariantNumeric: 'tabular-nums',
        marginBottom: '4px',
      }}
    >
      {formatReportNumber(value)}
    </div>
    <div
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.68rem',
        fontWeight: 600,
      }}
    >
      {label}
    </div>
  </div>
);

export default AdminReportsStatsCards;