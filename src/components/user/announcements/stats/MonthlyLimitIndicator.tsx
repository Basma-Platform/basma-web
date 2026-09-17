import { motion } from 'framer-motion';
import { FaInfinity, FaExclamationTriangle, FaPlusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { isUnlimited, getMonthlyUsagePercentage, getMonthlyUsageColor } from '../../../../utils/profileHelpers';
import type { UserAnnouncementStats } from '../../../../types';

interface MonthlyLimitIndicatorProps {
  stats: UserAnnouncementStats;
  variant?: 'compact' | 'detailed';
}

const MonthlyLimitIndicator = ({
  stats,
  variant = 'compact',
}: MonthlyLimitIndicatorProps) => {
  const unlimited = isUnlimited(stats.monthly_limit || 0) || stats.is_verified;
  const limit = stats.monthly_limit || 0;
  const used = stats.monthly_used;
  const remaining = stats.monthly_remaining || 0;
  const percentage = getMonthlyUsagePercentage(used, limit);
  const usageColor = getMonthlyUsageColor(percentage);
  const isFull = percentage >= 100;
  const isNearLimit = percentage >= 80 && !isFull;

  // ============================================
  // Unlimited User View
  // ============================================
  if (unlimited) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          background:
            'linear-gradient(135deg, rgba(40,167,69,0.08) 0%, rgba(40,167,69,0.03) 100%)',
          border: '1.5px solid rgba(40,167,69,0.25)',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontFamily: 'Cairo, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            left: '-30px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(40,167,69,0.1)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
            boxShadow: '0 6px 16px rgba(40,167,69,0.35)',
          }}
        >
          <FaInfinity size={22} />
        </motion.div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: '#28A745',
              fontSize: '0.95rem',
              fontWeight: 800,
              marginBottom: '2px',
            }}
          >
            إعلانات غير محدودة
          </div>
          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              lineHeight: 1.5,
            }}
          >
            بصفتك مستخدماً موثقاً، يمكنك نشر عدد غير محدود من الإعلانات
          </div>
        </div>

        <Link
          to="/user/announcements/create"
          style={{ textDecoration: 'none', flexShrink: 0 }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              backgroundColor: '#28A745',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 16px',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(40,167,69,0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            <FaPlusCircle size={12} />
            انشر إعلاناً
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  // ============================================
  // Compact Variant
  // ============================================
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            backgroundColor: `${usageColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: usageColor,
            flexShrink: 0,
            fontSize: '1.1rem',
            fontWeight: 900,
            fontFamily: 'system-ui, sans-serif',
            direction: 'ltr',
          }}
        >
          {used}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
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
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              الحد الشهري
            </span>
            <span
              style={{
                color: usageColor,
                fontSize: '0.78rem',
                fontWeight: 800,
                fontFamily: 'system-ui, sans-serif',
                direction: 'ltr',
              }}
            >
              {used}/{limit}
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${usageColor}, ${usageColor}CC)`,
                borderRadius: '3px',
              }}
            />
          </div>

          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.68rem',
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isFull ? (
              <>
                <FaExclamationTriangle size={10} color="#DC3545" />
                <span style={{ color: '#DC3545' }}>
                  وصلت للحد الأقصى - جدد الشهر القادم
                </span>
              </>
            ) : isNearLimit ? (
              <>
                <FaExclamationTriangle size={10} color="#856404" />
                <span style={{ color: '#856404' }}>
                  متبقي {remaining} {remaining === 1 ? 'إعلان' : 'إعلانات'}
                </span>
              </>
            ) : (
              <span>
                متبقي {remaining} {remaining === 1 ? 'إعلان' : 'إعلانات'} هذا الشهر
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================
  // Detailed Variant
  // ============================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        fontFamily: 'Cairo, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: '-40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: `${usageColor}10`,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
          >
            الحد الشهري للإعلانات
          </span>
          <span
            style={{
              backgroundColor: `${usageColor}15`,
              color: usageColor,
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.7rem',
              fontWeight: 700,
            }}
          >
            {Math.round(percentage)}%
          </span>
        </div>

        {/* Big Number */}
        <div
          style={{
            textAlign: 'center',
            padding: '1rem',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '12px',
            marginBottom: '12px',
            border: `1px solid ${usageColor}30`,
          }}
        >
          <div
            style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              color: usageColor,
              lineHeight: 1,
              fontFamily:
                "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              fontVariantNumeric: 'lining-nums tabular-nums',
              direction: 'ltr',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>{used}</span>
            <span
              style={{
                fontSize: '1.3rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
              }}
            >
              / {limit}
            </span>
          </div>
          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              marginTop: '6px',
            }}
          >
            {used} إعلان من أصل {limit} هذا الشهر
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '10px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '5px',
            overflow: 'hidden',
            marginBottom: '12px',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${usageColor}, ${usageColor}CC)`,
              borderRadius: '5px',
              boxShadow: `0 0 12px ${usageColor}50`,
            }}
          />
        </div>

        {/* Status Message */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '10px',
            backgroundColor: isFull
              ? 'rgba(220,53,69,0.06)'
              : isNearLimit
                ? 'rgba(255,193,7,0.06)'
                : 'rgba(40,167,69,0.06)',
            border: `1px solid ${
              isFull
                ? 'rgba(220,53,69,0.15)'
                : isNearLimit
                  ? 'rgba(255,193,7,0.15)'
                  : 'rgba(40,167,69,0.15)'
            }`,
            marginBottom: '12px',
          }}
        >
          {isNearLimit && (
            <FaExclamationTriangle
              size={13}
              color={isFull ? '#DC3545' : '#856404'}
            />
          )}
          <span
            style={{
              color: isFull ? '#DC3545' : isNearLimit ? '#856404' : '#28A745',
              fontSize: '0.78rem',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {isFull
              ? 'لقد وصلت للحد الأقصى. جدد الشهر القادم أو وثق حسابك.'
              : isNearLimit
                ? `متبقي لك ${remaining} ${
                    remaining === 1 ? 'إعلان' : 'إعلانات'
                  } فقط`
                : `يمكنك نشر ${remaining} ${
                    remaining === 1 ? 'إعلان' : 'إعلانات'
                  } إضافية`}
          </span>
        </div>

        {/* CTA */}
        {stats.can_create_more ? (
          <Link
            to="/user/announcements/create"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                backgroundColor: 'var(--primary-orange)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              <FaPlusCircle size={14} />
              انشر إعلاناً جديداً
            </motion.button>
          </Link>
        ) : (
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-input)',
              border: '1px dashed var(--border-color)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                marginBottom: '8px',
              }}
            >
              هل تريد إعلانات غير محدودة؟
            </div>
            <Link
              to="/user/verify-identity"
              style={{
                color: 'var(--primary-orange)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              وثّق حسابك الآن ←
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MonthlyLimitIndicator;