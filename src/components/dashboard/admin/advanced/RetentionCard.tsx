import { motion } from 'framer-motion';
import { FaUserCheck, FaUserClock, FaRedo, FaCalendarWeek } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminDashboardAdvanced } from '../../../../types';

interface RetentionCardProps {
  data: AdminDashboardAdvanced['retention'];
  delay?: number;
}

interface RetentionStat {
  label: string;
  value: number;
  Icon: IconType;
  color: string;
  bg: string;
}

/**
 * Retention Card
 * - 4 KPI boxes: active today, active this week, returning 7d, returning 30d
 * - Compact grid layout
 */
const RetentionCard = ({ data, delay = 0 }: RetentionCardProps) => {
  const stats: RetentionStat[] = [
    {
      label: 'نشط اليوم',
      value: data.active_today,
      Icon: FaUserCheck,
      color: '#28A745',
      bg: 'rgba(40,167,69,0.1)',
    },
    {
      label: 'نشط هذا الأسبوع',
      value: data.active_this_week,
      Icon: FaCalendarWeek,
      color: '#17A2B8',
      bg: 'rgba(23,162,184,0.1)',
    },
    {
      label: 'عائدون (7 أيام)',
      value: data.returning_7d,
      Icon: FaRedo,
      color: '#E87A20',
      bg: 'rgba(232,122,32,0.1)',
    },
    {
      label: 'عائدون (30 يوم)',
      value: data.returning_30d,
      Icon: FaUserClock,
      color: '#9C27B0',
      bg: 'rgba(156,39,176,0.1)',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      dir="rtl"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1rem',
        overflow: 'hidden',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        fontFamily: 'Cairo, sans-serif',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Gradient Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #28A745, #4FCB6E)',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(40,167,69,0.3)',
          }}
        >
          <FaUserCheck size={14} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h4
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            معدل الاحتفاظ بالمستخدمين
          </h4>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.68rem',
              margin: '2px 0 0',
            }}
          >
            نسبة النشاط والعودة
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          flex: 1,
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.Icon;
          return (
            <div
              key={stat.label}
              style={{
                padding: '10px',
                borderRadius: '12px',
                backgroundColor: stat.bg,
                border: `1px solid ${stat.color}30`,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                }}
              >
                <Icon size={12} color={stat.color} />
                <span
                  style={{
                    color: stat.color,
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    fontFamily: 'system-ui, sans-serif',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                    direction: 'ltr',
                  }}
                >
                  {stat.value}
                </span>
              </div>
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RetentionCard;