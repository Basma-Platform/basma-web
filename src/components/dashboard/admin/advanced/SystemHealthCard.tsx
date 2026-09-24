import { motion } from 'framer-motion';
import {
  FaServer,
  FaBell,
  FaCog,
  FaExclamationTriangle,
  FaCheckCircle,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminDashboardAdvanced } from '../../../../types';

interface SystemHealthCardProps {
  data: AdminDashboardAdvanced['system_health'];
  delay?: number;
}

interface HealthStat {
  label: string;
  value: string | number;
  Icon: IconType;
  color: string;
  bg: string;
  status?: 'good' | 'warning' | 'error';
  suffix?: string;
}

/**
 * System Health Card
 * - Storage used (MB)
 * - Notifications today
 * - Pending jobs
 * - Failed jobs (with alert if > 0)
 */
const SystemHealthCard = ({ data, delay = 0 }: SystemHealthCardProps) => {
  const formatStorage = (mb: number): string => {
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
  };

  const stats: HealthStat[] = [
    {
      label: 'المساحة المستخدمة',
      value: formatStorage(data.storage_used_mb),
      Icon: FaServer,
      color: '#17A2B8',
      bg: 'rgba(23,162,184,0.1)',
      status: 'good',
    },
    {
      label: 'إشعارات اليوم',
      value: data.notifications_today,
      Icon: FaBell,
      color: '#E87A20',
      bg: 'rgba(232,122,32,0.1)',
      status: 'good',
    },
    {
      label: 'مهام معلقة',
      value: data.pending_jobs,
      Icon: FaCog,
      color: data.pending_jobs > 10 ? '#FFC107' : '#28A745',
      bg:
        data.pending_jobs > 10
          ? 'rgba(255,193,7,0.1)'
          : 'rgba(40,167,69,0.1)',
      status: data.pending_jobs > 10 ? 'warning' : 'good',
    },
    {
      label: 'مهام فاشلة',
      value: data.failed_jobs,
      Icon: FaExclamationTriangle,
      color: data.failed_jobs > 0 ? '#DC3545' : '#28A745',
      bg:
        data.failed_jobs > 0
          ? 'rgba(220,53,69,0.1)'
          : 'rgba(40,167,69,0.1)',
      status: data.failed_jobs > 0 ? 'error' : 'good',
    },
  ];

  const hasErrors = data.failed_jobs > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      dir="rtl"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: `1.5px solid ${hasErrors ? 'rgba(220,53,69,0.3)' : 'var(--border-color)'}`,
        borderRadius: '16px',
        padding: '1rem',
        overflow: 'hidden',
        boxShadow: hasErrors
          ? '0 4px 20px rgba(220,53,69,0.15)'
          : '0 4px 16px var(--shadow-sm)',
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
          background: hasErrors
            ? 'linear-gradient(90deg, #DC3545, #F56575)'
            : 'linear-gradient(90deg, #28A745, #4FCB6E)',
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
            background: hasErrors
              ? 'linear-gradient(135deg, #DC3545, #F56575)'
              : 'linear-gradient(135deg, #28A745, #4FCB6E)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: hasErrors
              ? '0 4px 12px rgba(220,53,69,0.3)'
              : '0 4px 12px rgba(40,167,69,0.3)',
          }}
        >
          {hasErrors ? (
            <FaExclamationTriangle size={14} />
          ) : (
            <FaCheckCircle size={14} />
          )}
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
            صحة النظام
          </h4>
          <p
            style={{
              color: hasErrors ? '#DC3545' : 'var(--text-muted)',
              fontSize: '0.68rem',
              margin: '2px 0 0',
              fontWeight: hasErrors ? 700 : 500,
            }}
          >
            {hasErrors ? 'تحذير: مهام فاشلة' : 'جميع الأنظمة تعمل بشكل طبيعي'}
          </p>
        </div>
      </div>

      {/* Stats List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
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
                padding: '8px 10px',
                borderRadius: '10px',
                backgroundColor: stat.bg,
                border: `1px solid ${stat.color}25`,
              }}
            >
              <Icon size={12} color={stat.color} style={{ flexShrink: 0 }} />
              <span
                style={{
                  flex: 1,
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  color: stat.color,
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  fontFamily: 'system-ui, sans-serif',
                  fontVariantNumeric: 'tabular-nums',
                  direction: 'ltr',
                }}
              >
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SystemHealthCard;