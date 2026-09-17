import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaCheckCircle, FaClock, FaTimesCircle, 
  FaShieldAlt, FaArrowLeft, FaCalendarAlt,
  FaInfoCircle 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { formatProfileDate } from '../../../utils/profileHelpers';
import type { ProfileVerificationStatus } from '../../../types';

interface ProfileVerificationCardProps {
  verification: ProfileVerificationStatus;
}

const ProfileVerificationCard = ({ verification }: ProfileVerificationCardProps) => {
  const { is_verified, status, request_date, review_date, rejection_reason } = verification;

  // ============================================
  // Status Configuration Handler
  // ============================================
  const getStatusConfig = () => {
    // Approved
    if (is_verified) {
      return {
        icon: <FaCheckCircle size={24} color="#FFFFFF" />,
        iconBg: 'linear-gradient(135deg, #28A745, #4FCB6E)',
        title: 'الحساب موثق',
        description: 'تم التحقق من هويتك بنجاح. يمكنك الآن نشر إعلانات غير محدودة والاستفادة من جميع المزايا.',
        color: '#28A745',
        bgColor: 'rgba(40,167,69,0.08)',
        borderColor: 'rgba(40,167,69,0.25)',
        button: null,
        badge: (
          <Badge
            style={{
              backgroundColor: '#28A745',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              padding: '4px 12px',
              borderRadius: '8px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <FaCheckCircle size={10} /> موثق
          </Badge>
        ),
      };
    }

    // Pending
    if (status === 'pending') {
      return {
        icon: <FaClock size={24} color="#FFFFFF" />,
        iconBg: 'linear-gradient(135deg, #FFC107, #FFD966)',
        title: 'قيد المراجعة',
        description: 'طلب التحقق من هويتك قيد المراجعة من قبل الإدارة. سيتم إعلامك عند الانتهاء.',
        color: '#FFC107',
        bgColor: 'rgba(255,193,7,0.08)',
        borderColor: 'rgba(255,193,7,0.25)',
        button: null,
        badge: (
          <Badge
            style={{
              backgroundColor: 'rgba(255,193,7,0.15)',
              color: '#856404',
              border: '1px solid rgba(255,193,7,0.3)',
              fontSize: '0.65rem',
              padding: '4px 12px',
              borderRadius: '8px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <FaClock size={10} /> قيد المراجعة
          </Badge>
        ),
      };
    }

    // Rejected
    if (status === 'rejected') {
      return {
        icon: <FaTimesCircle size={24} color="#FFFFFF" />,
        iconBg: 'linear-gradient(135deg, #DC3545, #F56575)',
        title: 'تم رفض الطلب',
        description: rejection_reason || 'لم يتم تحديد سبب الرفض. يرجى إعادة رفع الطلب بجودة أوضح.',
        color: '#DC3545',
        bgColor: 'rgba(220,53,69,0.08)',
        borderColor: 'rgba(220,53,69,0.25)',
        button: (
          <Button
            as={Link as any}
            to="/user/verify-identity"
            style={{
              backgroundColor: '#DC3545',
              borderColor: '#DC3545',
              color: '#FFFFFF',
              borderRadius: '10px',
              padding: '10px 20px',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              width: '100%',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            <FaTimesCircle size={14} /> إعادة رفع الطلب
          </Button>
        ),
        badge: (
          <Badge
            style={{
              backgroundColor: 'rgba(220,53,69,0.15)',
              color: '#DC3545',
              border: '1px solid rgba(220,53,69,0.3)',
              fontSize: '0.65rem',
              padding: '4px 12px',
              borderRadius: '8px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <FaTimesCircle size={10} /> مرفوض
          </Badge>
        ),
      };
    }

    // Unverified / No Request (Blue background with fully white text & white icon)
    return {
      icon: <FaShieldAlt size={24} color="#FFFFFF" />,
      iconBg: 'linear-gradient(135deg, #E87A20, #F5A623)',
      title: 'الحساب غير موثق',
      description: 'وثّق هويتك للحصول على إعلانات غير محدودة، شارة التوثيق، وثقة أكبر من المجتمع.',
      color: '#E87A20',
      bgColor: 'rgba(232,122,32,0.08)',
      borderColor: 'rgba(232,122,32,0.25)',
      button: (
        <Button
          as={Link as any}
          to="/user/verify-identity"
          style={{
            background: 'linear-gradient(135deg, #E87A20, #F5A623)',
            borderColor: 'transparent',
            color: '#FFFFFF',
            borderRadius: '10px',
            padding: '10px 20px',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            width: '100%',
            justifyContent: 'center',
            textDecoration: 'none',
          }}
        >
          <FaShieldAlt size={14} /> وثّق حسابك الآن
          <FaArrowLeft size={12} />
        </Button>
      ),
      badge: (
        <Badge
          style={{
            backgroundColor: 'rgba(13, 202, 240, 0.25)',
            color: '#FFFFFF',
            border: '1px solid rgba(13, 202, 240, 0.4)',
            fontSize: '0.65rem',
            padding: '4px 12px',
            borderRadius: '8px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <FaShieldAlt size={10} color="#FFFFFF" /> غير موثق
        </Badge>
      ),
    };
  };

  const config = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        style={{
          backgroundColor: 'var(--bg-card)',
          border: `1px solid ${config.borderColor}`,
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: `0 4px 16px ${config.bgColor}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: config.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {config.icon}
            </div>

            {config.badge}
          </div>

          {/* Title & Description */}
          <h5
            style={{
              color: 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '1rem',
              marginBottom: '6px',
            }}
          >
            {config.title}
          </h5>

          <p
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              marginBottom: '1rem',
            }}
          >
            {config.description}
          </p>

          {/* Dates Metadata Panel */}
          {(request_date || review_date) && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                marginBottom: '1rem',
              }}
            >
              {request_date && (
                <DateInfo
                  icon={<FaCalendarAlt size={11} />}
                  label="تاريخ الطلب"
                  value={formatProfileDate(request_date)}
                  color="#17A2B8"
                />
              )}
              {review_date && (
                <DateInfo
                  icon={<FaCalendarAlt size={11} />}
                  label="تاريخ المراجعة"
                  value={formatProfileDate(review_date)}
                  color="#28A745"
                />
              )}
            </div>
          )}

          {/* Rejection Notice */}
          {status === 'rejected' && rejection_reason && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                backgroundColor: 'rgba(220,53,69,0.06)',
                borderRadius: '10px',
                border: '1px solid rgba(220,53,69,0.2)',
                marginBottom: '1rem',
              }}
            >
              <FaInfoCircle size={13} color="#DC3545" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div
                  style={{
                    color: '#DC3545',
                    fontSize: '0.7rem',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 700,
                    marginBottom: '2px',
                  }}
                >
                  سبب الرفض:
                </div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontFamily: 'Cairo, sans-serif',
                    lineHeight: 1.5,
                  }}
                >
                  {rejection_reason}
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {config.button && (
            <div style={{ marginBottom: is_verified ? '1rem' : '0' }}>
              {config.button}
            </div>
          )}

          {/* Verified Benefits List */}
          {is_verified && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '6px',
              }}
            >
              {[
                'إعلانات غير محدودة',
                'شارة موثق رسمية',
                'ثقة أكبر بالمجتمع',
              ].map((text, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <FaCheckCircle size={10} color="#28A745" />
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.65rem',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

// Helper Component: Date Info Row
interface DateInfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const DateInfo = ({ icon, label, value, color }: DateInfoProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-muted)',
        fontSize: '0.7rem',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <span style={{ color }}>{icon}</span>
      {label}
    </div>
    <span
      style={{
        color: 'var(--text-secondary)',
        fontSize: '0.75rem',
        fontFamily: 'Cairo, sans-serif',
        fontWeight: 600,
      }}
    >
      {value}
    </span>
  </div>
);

export default ProfileVerificationCard;