import { motion } from 'framer-motion';
import { FaTachometerAlt, FaFlag, FaShieldAlt, FaStar } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminDashboardAdvanced } from '../../../../types';

interface ModerationEfficiencyCardProps {
  data: AdminDashboardAdvanced['moderation_efficiency'];
  delay?: number;
}

interface EfficiencyStat {
  label: string;
  minutes: number;
  Icon: IconType;
  color: string;
  bg: string;
}

/**
 * Moderation Efficiency Card
 * - Avg processing time for: reports / verifications / featured
 * - Converted to human-readable format (hours/days)
 */
const ModerationEfficiencyCard = ({
  data,
  delay = 0,
}: ModerationEfficiencyCardProps) => {
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)} دقيقة`;
    const hours = minutes / 60;
    if (hours < 24) return `${hours.toFixed(1)} ساعة`;
    const days = hours / 24;
    return `${days.toFixed(1)} يوم`;
  };

  const stats: EfficiencyStat[] = [
    {
      label: 'متوسط مراجعة البلاغات',
      minutes: data.avg_report_processing_minutes,
      Icon: FaFlag,
      color: '#DC3545',
      bg: 'rgba(220,53,69,0.1)',
    },
    {
      label: 'متوسط مراجعة التوثيق',
      minutes: data.avg_verification_processing_minutes,
      Icon: FaShieldAlt,
      color: '#17A2B8',
      bg: 'rgba(23,162,184,0.1)',
    },
    {
      label: 'متوسط مراجعة التمييز',
      minutes: data.avg_featured_processing_minutes,
      Icon: FaStar,
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
          background: 'linear-gradient(90deg, #17A2B8, #20C9E0)',
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
            background: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(23,162,184,0.3)',
          }}
        >
          <FaTachometerAlt size={14} />
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
            كفاءة الإشراف
          </h4>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.68rem',
              margin: '2px 0 0',
            }}
          >
            متوسط وقت المعالجة
          </p>
        </div>
      </div>

      {/* Stats List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.Icon;
          return (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '12px',
                backgroundColor: stat.bg,
                border: `1px solid ${stat.color}25`,
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={13} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    marginBottom: '2px',
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    color: stat.color,
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  {formatDuration(stat.minutes)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ModerationEfficiencyCard;