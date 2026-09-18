import { Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaLayerGroup,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface AdminVerificationStatsProps {
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  activeFilter?: 'all' | 'pending' | 'approved' | 'rejected';
  onFilterClick?: (
    filter: 'all' | 'pending' | 'approved' | 'rejected'
  ) => void;
}

interface StatCard {
  key: 'all' | 'pending' | 'approved' | 'rejected';
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

const AdminVerificationStats = ({
  stats,
  activeFilter = 'all',
  onFilterClick,
}: AdminVerificationStatsProps) => {
  const cards: StatCard[] = [
    {
      key: 'all',
      label: 'الكل',
      value: stats?.total ?? 0,
      color: '#8B5A2B',
      gradient: 'linear-gradient(135deg, #8B5A2B, #C49A6C)',
      bg: 'rgba(139, 90, 43, 0.1)',
      Icon: FaLayerGroup,
    },
    {
      key: 'pending',
      label: 'قيد المراجعة',
      value: stats?.pending ?? 0,
      color: '#FFC107',
      gradient: 'linear-gradient(135deg, #FFC107, #FFD966)',
      bg: 'rgba(255, 193, 7, 0.1)',
      Icon: FaHourglassHalf,
    },
    {
      key: 'approved',
      label: 'تمت الموافقة',
      value: stats?.approved ?? 0,
      color: '#28A745',
      gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
      bg: 'rgba(40, 167, 69, 0.1)',
      Icon: FaCheckCircle,
    },
    {
      key: 'rejected',
      label: 'مرفوضة',
      value: stats?.rejected ?? 0,
      color: '#DC3545',
      gradient: 'linear-gradient(135deg, #DC3545, #F56575)',
      bg: 'rgba(220, 53, 69, 0.1)',
      Icon: FaTimesCircle,
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
        {cards.map((card) => {
          const isActive = activeFilter === card.key;
          const clickable = !!onFilterClick;
          const Icon = card.Icon;

          return (
            <Col key={card.key} xs={6} lg={3}>
              <motion.button
                variants={itemVariants}
                whileHover={clickable ? { y: -4 } : {}}
                whileTap={clickable ? { scale: 0.98 } : {}}
                onClick={() => clickable && onFilterClick(card.key)}
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
                {/* Top Accent Bar */}
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
                    {card.value.toLocaleString('en-US')}
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
    </motion.div>
  );
};

export default AdminVerificationStats;