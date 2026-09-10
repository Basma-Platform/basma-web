import { Card, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaBullhorn, FaInfinity, FaBolt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface DashboardMonthlyProgressProps {
  used: number;
  limit: number;
  isVerified?: boolean;
  verifyPath?: string;
}

const DashboardMonthlyProgress = ({
  used,
  limit,
  isVerified = false,
  verifyPath = '/dashboard/verify',
}: DashboardMonthlyProgressProps) => {
  const percentage = isVerified ? 100 : Math.min(100, Math.round((used / (limit || 1)) * 100));
  const remaining = Math.max(0, limit - used);
  const isNearLimit = percentage >= 80 && percentage < 100;
  const isFull = percentage >= 100;

  // Dynamic Theme Colors based on limit consumption
  const themeColor = isFull ? '#dc3545' : isNearLimit ? '#fd7e14' : '#e87a20';
  const badgeBg = isFull
    ? 'rgba(220, 53, 69, 0.12)'
    : isNearLimit
    ? 'rgba(253, 126, 20, 0.12)'
    : 'rgba(232, 122, 32, 0.12)';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-100"
    >
      <Card
        className="h-100 p-3 p-sm-4 d-flex flex-column justify-content-between position-relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px var(--shadow-sm)',
        }}
      >
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(232, 122, 32, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-orange)',
              }}
            >
              <FaBullhorn size={15} />
            </div>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 800,
                color: 'var(--text-secondary)',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              الحد الشهري للإعلانات
            </span>
          </div>

          {isVerified ? (
            <Badge
              style={{
                backgroundColor: 'rgba(40, 167, 69, 0.12)',
                color: '#28a745',
                border: '1px solid rgba(40, 167, 69, 0.3)',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: '20px',
                padding: '5px 10px',
              }}
              className="d-flex align-items-center gap-1"
            >
              <FaInfinity size={10} /> موثق
            </Badge>
          ) : (
            <Badge
              style={{
                backgroundColor: 'rgba(232, 122, 32, 0.12)',
                color: 'var(--primary-orange)',
                border: '1px solid rgba(232, 122, 32, 0.3)',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: '20px',
                padding: '5px 10px',
              }}
            >
              باقة مجانية
            </Badge>
          )}
        </div>

        {/* Content Section */}
        {isVerified ? (
          /* Verified State UI */
          <div className="py-2 text-center my-auto">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <FaCheckCircle size={20} style={{ color: '#28a745' }} />
              <span
                style={{
                  color: '#28a745',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}
              >
                إعلانات غير محدودة
              </span>
            </div>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                fontFamily: 'Cairo, sans-serif',
                margin: 0,
              }}
            >
              حسابك موثق بالكامل، يمكنك نشر عدد غير محدود من الإعلانات شهرياً.
            </p>
          </div>
        ) : (
          /* Unverified User - Redesigned Interactive Progress UI */
          <div className="d-flex flex-column justify-content-center flex-grow-1">
            {/* Number Display Row */}
            <div className="d-flex justify-content-between align-items-baseline mb-2">
              <div className="d-flex align-items-baseline gap-1">
                <span
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    color: 'var(--text-primary)',
                    fontFamily: 'Cairo, sans-serif',
                    lineHeight: 1,
                  }}
                >
                  <span className="en-nums">{used}</span>
                </span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  من <span className="en-nums">{limit}</span> إعلانات
                </span>
              </div>

              {/* Animated Percentage Badge */}
              <motion.span
                key={percentage}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: themeColor,
                  backgroundColor: badgeBg,
                  padding: '3px 9px',
                  borderRadius: '10px',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <span className="en-nums">{percentage}%</span> مستهلك
              </motion.span>
            </div>

            {/* Progress Bar Container */}
            <div
              style={{
                height: '10px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                position: 'relative',
                margin: '4px 0 10px 0',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: isFull
                    ? 'linear-gradient(90deg, #dc3545, #ff6b6b)'
                    : isNearLimit
                    ? 'linear-gradient(90deg, #fd7e14, #ffc107)'
                    : 'linear-gradient(90deg, #e87a20, #fcaa67)',
                  borderRadius: '12px',
                  boxShadow: percentage > 0 ? `0 0 10px ${themeColor}60` : 'none',
                }}
              />
            </div>

            {/* Status Info & Upgrade Call to Action Footer */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-1">
              <span
                style={{
                  fontSize: '0.75rem',
                  color: isFull ? '#dc3545' : 'var(--text-muted)',
                  fontWeight: isFull ? 700 : 600,
                  fontFamily: 'Cairo, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {isFull ? (
                  <>
                    <FaExclamationTriangle size={12} /> اكتمل الحد الشهري
                  </>
                ) : (
                  <>
                    متبقي لديك <strong className="en-nums">{remaining}</strong> إعلانات هذا الشهر
                  </>
                )}
              </span>

              <a
                href={verifyPath}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontFamily: 'Cairo, sans-serif',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(232, 122, 32, 0.08)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <FaBolt size={11} /> وثّق لترقية الحد
              </a>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default DashboardMonthlyProgress;