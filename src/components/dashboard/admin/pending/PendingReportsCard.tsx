import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFlag,
  FaArrowLeft,
  FaExclamationTriangle,
  FaClock,
} from 'react-icons/fa';
import type { PendingReports } from '../../../../types';

interface PendingReportsCardProps {
  data: PendingReports;
  delay?: number;
}

/**
 * Pending Reports Card
 * - Total pending count
 * - Priority breakdown (high/medium/low)
 * - Oldest age (converted from minutes, handles negative)
 * - Direct link to reports page
 */
const PendingReportsCard = ({ data, delay = 0 }: PendingReportsCardProps) => {
  // ✅ Handle negative values from backend (treat as "now")
  const formatAge = (minutes: number): string => {
    const absMinutes = Math.abs(minutes);
    if (absMinutes < 1) return 'الآن';
    if (absMinutes < 60) return `${Math.round(absMinutes)} دقيقة`;
    const hours = Math.floor(absMinutes / 60);
    if (hours < 24) return `${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `${days} يوم`;
  };

  const isUrgent = data.high > 0 && data.total > 0;
  const hasAny = data.total > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      dir="rtl"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: `1.5px solid ${hasAny ? 'rgba(220,53,69,0.25)' : 'var(--border-color)'}`,
        borderRadius: '16px',
        padding: '1.15rem',
        overflow: 'hidden',
        boxShadow: hasAny
          ? '0 4px 16px rgba(220,53,69,0.08)'
          : '0 4px 16px var(--shadow-sm)',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Cairo, sans-serif',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          '0 12px 32px rgba(220,53,69,0.15)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = hasAny
          ? '0 4px 16px rgba(220,53,69,0.08)'
          : '0 4px 16px var(--shadow-sm)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top Gradient Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '4px',
          background: 'linear-gradient(135deg, #DC3545, #F56575)',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #DC3545, #F56575)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 6px 14px rgba(220,53,69,0.3)',
            }}
          >
            <FaFlag size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h4
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.88rem',
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              بلاغات معلقة
            </h4>
            {isUrgent && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '3px',
                  padding: '1px 7px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(220,53,69,0.12)',
                  color: '#DC3545',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                }}
              >
                <FaExclamationTriangle size={8} />
                عالية الأولوية
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            color: '#DC3545',
            fontSize: 'clamp(1.5rem, 3vw, 1.85rem)',
            fontWeight: 900,
            fontFamily: 'system-ui, sans-serif',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
            direction: 'ltr',
          }}
        >
          {data.total}
        </div>
      </div>

      {/* Priority Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          marginBottom: '12px',
        }}
      >
        <PriorityPill label="عالية" count={data.high} color="#DC3545" />
        <PriorityPill label="متوسطة" count={data.medium} color="#FFC107" />
        <PriorityPill label="منخفضة" count={data.low} color="#6C757D" />
      </div>

      {/* Oldest Age */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-input)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 600,
          }}
        >
          <FaClock size={11} />
          أقدم بلاغ
        </span>
        <span
          style={{
            color: '#DC3545',
            fontSize: '0.75rem',
            fontWeight: 800,
          }}
        >
          {formatAge(data.oldest_age)}
        </span>
      </div>

      {/* Action Link */}
      <Link
        to={data.link}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '9px 14px',
          borderRadius: '10px',
          backgroundColor: 'rgba(220,53,69,0.08)',
          border: '1px solid rgba(220,53,69,0.2)',
          color: '#DC3545',
          textDecoration: 'none',
          fontSize: '0.78rem',
          fontWeight: 700,
          transition: 'all 0.2s ease',
          marginTop: 'auto',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#DC3545';
          e.currentTarget.style.color = '#FFFFFF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.08)';
          e.currentTarget.style.color = '#DC3545';
        }}
      >
        <span>مراجعة البلاغات</span>
        <FaArrowLeft size={11} />
      </Link>
    </motion.div>
  );
};

const PriorityPill = ({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) => (
  <div
    style={{
      textAlign: 'center',
      padding: '6px 4px',
      borderRadius: '8px',
      backgroundColor: `${color}10`,
      border: `1px solid ${color}30`,
    }}
  >
    <div
      style={{
        color: color,
        fontSize: '0.95rem',
        fontWeight: 900,
        fontFamily: 'system-ui, sans-serif',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
        direction: 'ltr',
      }}
    >
      {count}
    </div>
    <div
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.6rem',
        fontWeight: 600,
        marginTop: '2px',
      }}
    >
      {label}
    </div>
  </div>
);

export default PendingReportsCard;