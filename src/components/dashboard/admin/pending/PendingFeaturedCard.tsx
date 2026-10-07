import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaArrowLeft, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import type { PendingFeatured } from '../../../../types';

interface PendingFeaturedCardProps {
  data: PendingFeatured;
  delay?: number;
}

/**
 * Pending Featured Requests Card
 */
const PendingFeaturedCard = ({ data, delay = 0 }: PendingFeaturedCardProps) => {
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

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

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
        border: `1.5px solid ${hasAny ? 'rgba(156,39,176,0.25)' : 'var(--border-color)'}`,
        borderRadius: '16px',
        padding: '1.15rem',
        overflow: 'hidden',
        boxShadow: hasAny
          ? '0 4px 16px rgba(156,39,176,0.08)'
          : '0 4px 16px var(--shadow-sm)',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Cairo, sans-serif',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          '0 12px 32px rgba(156,39,176,0.15)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = hasAny
          ? '0 4px 16px rgba(156,39,176,0.08)'
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
          background: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
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
              background: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 6px 14px rgba(156,39,176,0.3)',
            }}
          >
            <FaStar size={16} />
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
              طلبات التمييز
            </h4>
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.68rem',
                fontWeight: 500,
              }}
            >
              في انتظار الموافقة
            </span>
          </div>
        </div>

        <div
          style={{
            color: '#9C27B0',
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

      {/* Expected Revenue */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          backgroundColor: 'rgba(156,39,176,0.06)',
          borderRadius: '10px',
          border: '1px solid rgba(156,39,176,0.2)',
          marginBottom: '10px',
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
          <FaMoneyBillWave size={11} />
          إيرادات متوقعة
        </span>
        <span
          style={{
            color: '#9C27B0',
            fontSize: '0.85rem',
            fontWeight: 900,
            fontFamily: 'system-ui, sans-serif',
            fontVariantNumeric: 'tabular-nums',
            direction: 'ltr',
          }}
        >
          {formatCurrency(data.expected_revenue)} ₪
        </span>
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
            color: '#9C27B0',
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
          backgroundColor: 'rgba(156,39,176,0.08)',
          border: '1px solid rgba(156,39,176,0.2)',
          color: '#9C27B0',
          textDecoration: 'none',
          fontSize: '0.78rem',
          fontWeight: 700,
          transition: 'all 0.2s ease',
          marginTop: 'auto',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#9C27B0';
          e.currentTarget.style.color = '#FFFFFF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(156,39,176,0.08)';
          e.currentTarget.style.color = '#9C27B0';
        }}
      >
        <span>مراجعة الطلبات</span>
        <FaArrowLeft size={11} />
      </Link>
    </motion.div>
  );
};

export default PendingFeaturedCard;