import { motion } from 'framer-motion';
import {
  FaLayerGroup,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaCalendarDay,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminFeaturedStats } from '../../../types';
import {
  formatFeaturedPrice,
  formatFeaturedNumber,
} from '../../../utils/featuredHelpers';

interface AdminFeaturedStatsCardsProps {
  stats: AdminFeaturedStats;
  activeFilter?: 'all' | 'pending' | 'approved' | 'rejected';
  onFilterClick?: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void;
}

interface StatCard {
  key?: 'all' | 'pending' | 'approved' | 'rejected';
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

const AdminFeaturedStatsCards = ({
  stats,
  activeFilter = 'all',
  onFilterClick,
}: AdminFeaturedStatsCardsProps) => {
  // ============================================
  // Status cards (clickable filters)
  // Note: `pending` uses the same #FFB800 yellow as the FeaturedStatusBadge
  // ============================================
  const statusCards: StatCard[] = [
    {
      key: 'all',
      label: 'الكل',
      value: stats.requests.total,
      color: '#8B5A2B',
      gradient: 'linear-gradient(135deg, #8B5A2B, #C49A6C)',
      bg: 'rgba(139, 90, 43, 0.1)',
      Icon: FaLayerGroup,
    },
    {
      key: 'pending',
      label: 'قيد المراجعة',
      value: stats.requests.pending,
      color: '#FFB800',
      gradient: 'linear-gradient(135deg, #FFB800, #F5A623)',
      bg: 'rgba(255, 184, 0, 0.1)',
      Icon: FaHourglassHalf,
    },
    {
      key: 'approved',
      label: 'تمت الموافقة',
      value: stats.requests.approved,
      color: '#28A745',
      gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
      bg: 'rgba(40, 167, 69, 0.1)',
      Icon: FaCheckCircle,
    },
    {
      key: 'rejected',
      label: 'مرفوضة',
      value: stats.requests.rejected,
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
      className="admin-featured-stats"
    >
      {/* ============================================
          Row 1: Status cards (filterable)
          ============================================ */}
      <div className="admin-featured-stats__status-grid">
        {statusCards.map((card) => {
          const isActive = activeFilter === card.key;
          const clickable = !!onFilterClick && !!card.key;
          const Icon = card.Icon;

          return (
            <motion.button
              key={card.key || card.label}
              variants={itemVariants}
              type="button"
              whileHover={clickable ? { y: -4 } : {}}
              whileTap={clickable ? { scale: 0.98 } : {}}
              onClick={() =>
                clickable && card.key && onFilterClick?.(card.key)
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
                boxSizing: 'border-box',
                minWidth: 0,
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
              {/* Top accent bar */}
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
                {card.key === 'pending' ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
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
                  {formatFeaturedNumber(card.value)}
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
          );
        })}
      </div>

      {/* ============================================
          Row 2: Revenue + Today
          ============================================ */}
      <div className="admin-featured-stats__info-grid">
        {/* Revenue card */}
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
            boxSizing: 'border-box',
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
              gap: '12px',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(232,122,32,0.35)',
              }}
            >
              <FaMoneyBillWave size={17} />
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
                إجمالي الإيرادات
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
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {formatFeaturedPrice(
                  stats.revenue.total,
                  stats.revenue.currency
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>هذا الشهر</span>
            <span
              style={{
                color: 'var(--primary-orange)',
                fontWeight: 800,
                fontFamily:
                  "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                fontVariantNumeric: 'lining-nums tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              {formatFeaturedPrice(
                stats.revenue.this_month,
                stats.revenue.currency
              )}
            </span>
          </div>
        </motion.div>

        {/* Today card */}
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
            boxSizing: 'border-box',
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
              gap: '12px',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(23,162,184,0.35)',
              }}
            >
              <FaCalendarDay size={17} />
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
                نشاط اليوم
              </div>
              <div
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <span
                  style={{
                    color: '#17A2B8',
                    fontFamily:
                      "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                    fontVariantNumeric: 'lining-nums tabular-nums',
                  }}
                >
                  {formatFeaturedNumber(stats.today.new_requests)}
                </span>{' '}
                طلب جديد
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>تمت مراجعته</span>
            <span
              style={{
                color: '#28A745',
                fontWeight: 800,
                fontFamily:
                  "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                fontVariantNumeric: 'lining-nums tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              {formatFeaturedNumber(stats.today.reviewed)} طلب
            </span>
          </div>
        </motion.div>
      </div>

      {/* Responsive styles */}
      <style>{`
        .admin-featured-stats__status-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 12px;
        }

        .admin-featured-stats__info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        @media (min-width: 768px) {
          .admin-featured-stats__status-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
          }
          .admin-featured-stats__info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
        }

        @media (max-width: 380px) {
          .admin-featured-stats__status-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AdminFeaturedStatsCards;