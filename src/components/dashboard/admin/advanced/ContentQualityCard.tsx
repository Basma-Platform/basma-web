import { motion } from 'framer-motion';
import { FaBalanceScale } from 'react-icons/fa';
import type { AdminDashboardAdvanced } from '../../../../types';

interface ContentQualityCardProps {
  data: AdminDashboardAdvanced['content_quality'];
  delay?: number;
}

interface QualityStat {
  label: string;
  value: number;
  color: string;
}

/**
 * Content Quality Card
 * - 3 progress bars: reported / deleted / featured ratios
 * - Percentage display
 */
const ContentQualityCard = ({ data, delay = 0 }: ContentQualityCardProps) => {
  const stats: QualityStat[] = [
    {
      label: 'نسبة المحتوى المُبلّغ عنه',
      value: data.reported_ratio,
      color: '#DC3545',
    },
    {
      label: 'نسبة المحتوى المحذوف',
      value: data.deleted_ratio,
      color: '#FFC107',
    },
    {
      label: 'نسبة المحتوى المميز',
      value: data.featured_ratio,
      color: '#28A745',
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
          background: 'linear-gradient(90deg, #FFC107, #E87A20)',
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
            background: 'linear-gradient(135deg, #FFC107, #E87A20)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(255,193,7,0.3)',
          }}
        >
          <FaBalanceScale size={14} />
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
            جودة المحتوى
          </h4>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.68rem',
              margin: '2px 0 0',
            }}
          >
            نسب البلاغات والحذف والتمييز
          </p>
        </div>
      </div>

      {/* Progress Bars */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {stats.map((stat, index) => (
          <div key={stat.label}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                marginBottom: '6px',
              }}
            >
              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  color: stat.color,
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  fontFamily: 'system-ui, sans-serif',
                  fontVariantNumeric: 'tabular-nums',
                  direction: 'ltr',
                }}
              >
                {stat.value.toFixed(2)}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(stat.value, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${stat.color}, ${stat.color}CC)`,
                  borderRadius: '4px',
                  boxShadow: `0 0 8px ${stat.color}50`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ContentQualityCard;