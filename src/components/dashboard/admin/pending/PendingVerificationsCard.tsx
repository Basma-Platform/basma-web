import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaArrowLeft, FaClock } from 'react-icons/fa';
import type { PendingVerifications } from '../../../../types';

interface PendingVerificationsCardProps {
  data: PendingVerifications;
  delay?: number;
}

/**
 * Pending Verification Requests Card
 */
const PendingVerificationsCard = ({
  data,
  delay = 0,
}: PendingVerificationsCardProps) => {
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
        border: `1.5px solid ${hasAny ? 'rgba(23,162,184,0.25)' : 'var(--border-color)'}`,
        borderRadius: '16px',
        padding: '1.15rem',
        overflow: 'hidden',
        boxShadow: hasAny
          ? '0 4px 16px rgba(23,162,184,0.08)'
          : '0 4px 16px var(--shadow-sm)',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Cairo, sans-serif',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          '0 12px 32px rgba(23,162,184,0.15)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = hasAny
          ? '0 4px 16px rgba(23,162,184,0.08)'
          : '0 4px 16px var(--shadow-sm)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '4px',
          background: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
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
              background: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 6px 14px rgba(23,162,184,0.3)',
            }}
          >
            <FaShieldAlt size={16} />
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
              طلبات التوثيق
            </h4>
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.68rem',
                fontWeight: 500,
              }}
            >
              في انتظار المراجعة
            </span>
          </div>
        </div>

        <div
          style={{
            color: '#17A2B8',
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
          أقدم طلب
        </span>
        <span
          style={{
            color: '#17A2B8',
            fontSize: '0.75rem',
            fontWeight: 800,
          }}
        >
          {formatAge(data.oldest_age)}
        </span>
      </div>

      {/* Info Note */}
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: 'rgba(23,162,184,0.06)',
          border: '1px dashed rgba(23,162,184,0.25)',
          borderRadius: '8px',
          marginBottom: '12px',
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          lineHeight: 1.55,
        }}
      >
        راجع الطلبات ووافق أو ارفض مع ذكر السبب.
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
          backgroundColor: 'rgba(23,162,184,0.08)',
          border: '1px solid rgba(23,162,184,0.2)',
          color: '#17A2B8',
          textDecoration: 'none',
          fontSize: '0.78rem',
          fontWeight: 700,
          transition: 'all 0.2s ease',
          marginTop: 'auto',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#17A2B8';
          e.currentTarget.style.color = '#FFFFFF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(23,162,184,0.08)';
          e.currentTarget.style.color = '#17A2B8';
        }}
      >
        <span>مراجعة الطلبات</span>
        <FaArrowLeft size={11} />
      </Link>
    </motion.div>
  );
};

export default PendingVerificationsCard;