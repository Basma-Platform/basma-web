import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaChartLine, FaInfinity, FaCheckCircle, 
  FaExclamationTriangle, FaPlusCircle, FaShieldAlt,
  FaArrowLeft 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { isUnlimited, getMonthlyUsagePercentage, getMonthlyUsageColor } from '../../../utils/profileHelpers';
import type { ProfileStats } from '../../../types';

interface ProfileMonthlyLimitProps {
  stats: ProfileStats;
  isVerified: boolean;
}

const ProfileMonthlyLimit = ({ stats, isVerified }: ProfileMonthlyLimitProps) => {
  const { monthly_limit, monthly_used, monthly_remaining, can_create_more } = stats;

  const unlimited = isUnlimited(monthly_limit);
  const percentage = getMonthlyUsagePercentage(monthly_used, monthly_limit);
  const usageColor = getMonthlyUsageColor(percentage);
  const isFull = percentage >= 100;
  const isNearLimit = percentage >= 80 && !isFull;

  // ============================================
  // VERIFIED USER - Unlimited Badge
  // ============================================
  if (unlimited || isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          style={{
            background: 'linear-gradient(135deg, rgba(40,167,69,0.08) 0%, rgba(40,167,69,0.03) 100%)',
            border: '2px solid rgba(40,167,69,0.25)',
            borderRadius: '16px',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(40,167,69,0.08)',
          }}
        >
          {/* Decorative Background Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'rgba(40,167,69,0.08)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            {/* Infinity Icon Container */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: '0 8px 24px rgba(40,167,69,0.3)',
              }}
            >
              <FaInfinity size={36} color="#FFFFFF" />
            </motion.div>

            <h5
              style={{
                color: '#28A745',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '6px',
              }}
            >
              إعلانات غير محدودة
            </h5>

            <p
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                lineHeight: 1.7,
                marginBottom: '16px',
              }}
            >
              بصفتك مستخدماً موثقاً، يمكنك نشر عدد غير محدود من الإعلانات دون أي قيود شهرية.
            </p>

            {/* Benefits List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '16px',
                textAlign: 'right',
              }}
            >
              {[
                'نشر إعلانات غير محدودة شهرياً',
                'ظهور أسرع في نتائج البحث',
                'ثقة أكبر من المجتمع والمستخدمين',
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderRadius: '10px',
                  }}
                >
                  <FaCheckCircle size={14} color="#28A745" style={{ flexShrink: 0 }} />
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              as={Link as any}
              to="/user/create-announcement"
              style={{
                background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
                borderColor: 'transparent',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '12px 24px',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(40,167,69,0.3)',
                width: '100%',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(40,167,69,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(40,167,69,0.3)';
              }}
            >
              <FaPlusCircle size={16} />
              انشر إعلاناً جديداً
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  // ============================================
  // REGULAR USER - Progress Widget
  // ============================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 16px var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
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
              backgroundColor: 'rgba(232,122,32,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-orange)',
            }}
          >
            <FaChartLine size={16} />
          </div>
          <div>
            <h5
              style={{
                color: 'var(--text-secondary)',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                fontSize: '1rem',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              الحد الشهري للإعلانات
            </h5>
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              إعلانات هذا الشهر
            </span>
          </div>
        </div>

        {/* Big Number Counter Display with Entry Animation */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '14px',
            border: `1px solid ${usageColor}30`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: `${usageColor}10`,
              pointerEvents: 'none',
            }}
          />

          {/* Fixed Layout for Used / Limit Numbers */}
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              fontFeatureSettings: '"lnum" 1, "tnum" 1',
              fontVariantNumeric: 'lining-nums tabular-nums',
              color: usageColor,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <span>{monthly_used}</span>
            <span
              style={{
                fontSize: '1.5rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
              }}
            >
              / {monthly_limit}
            </span>
          </div>

          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontFamily: 'Cairo, sans-serif',
              marginTop: '6px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {monthly_used} إعلان مستخدم من أصل {monthly_limit}
          </div>
        </motion.div>

        {/* Progress Bar Section */}
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              نسبة الاستخدام
            </span>
            <span
              style={{
                color: usageColor,
                fontSize: '0.85rem',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 700,
              }}
            >
              {Math.round(percentage)}%
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${usageColor}, ${usageColor}CC)`,
                borderRadius: '10px',
                boxShadow: `0 0 12px ${usageColor}50`,
              }}
            />
          </div>
        </div>

        {/* Dynamic Status Notification Box - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{
            padding: '12px 14px',
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
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '8px',
          }}
        >
          {isNearLimit && <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠️</span>}
          <span
            style={{
              color: isFull
                ? '#DC3545'
                : isNearLimit
                ? '#856404'
                : '#28A745',
              fontSize: '0.8rem',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            {isFull
              ? 'لقد وصلت إلى الحد الأقصى. يمكنك النشر الشهر القادم أو توثيق حسابك.'
              : isNearLimit
              ? `متبقي لك ${monthly_remaining} إعلان فقط لهذا الشهر.`
              : `يمكنك نشر ${monthly_remaining} إعلان إضافي هذا الشهر.`}
          </span>
        </motion.div>

        {/* Action Button or Verification Prompt */}
        {can_create_more ? (
          <Button
            as={Link as any}
            to="/user/create-announcement"
            style={{
              backgroundColor: 'var(--primary-orange)',
              borderColor: 'var(--primary-orange)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '12px 24px',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
              width: '100%',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,122,32,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,122,32,0.3)';
            }}
          >
            <FaPlusCircle size={16} />
            انشر إعلاناً جديداً
          </Button>
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '8px',
              }}
            >
              <FaExclamationTriangle size={12} />
              هل تريد إعلانات غير محدودة؟
            </div>
            <Link
              to="/user/verify-identity"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--primary-orange)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <FaShieldAlt size={12} />
              وثّق حسابك الآن
              <FaArrowLeft size={10} />
            </Link>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ProfileMonthlyLimit;