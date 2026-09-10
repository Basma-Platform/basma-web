import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaClock, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import type { DashboardVerification } from '../../../types';

interface DashboardVerificationCardProps {
  verification: DashboardVerification;
}

const DashboardVerificationCard = ({ verification }: DashboardVerificationCardProps) => {
  if (verification.is_verified) return null;

  const renderContent = () => {
    if (verification.status === 'pending') {
      return {
        icon: <FaClock size={24} className="text-warning" />,
        bgColor: 'rgba(255, 193, 7, 0.08)',
        borderColor: 'rgba(255, 193, 7, 0.3)',
        title: 'طلب التحقق قيد المراجعة',
        description: `تم تقديم طلبك بتاريخ ${
          verification.request_date
            ? new Date(verification.request_date).toLocaleDateString('ar-EG')
            : ''
        }. يتم فحص مستنداتك حالياً من فريق الدعم.`,
        showButton: false,
      };
    }

    if (verification.status === 'rejected') {
      return {
        icon: <FaExclamationTriangle size={24} className="text-danger" />,
        bgColor: 'rgba(220, 53, 69, 0.08)',
        borderColor: 'rgba(220, 53, 69, 0.3)',
        title: 'تم رفض طلب التحقق',
        description:
          verification.rejection_reason || 'يرجى إعادة رفع صورة الهوية بشكل واضح لمتابعة التوثيق.',
        showButton: true,
      };
    }

    return {
      icon: <FaShieldAlt size={24} style={{ color: 'var(--primary-orange)' }} />,
      bgColor: 'rgba(232, 122, 32, 0.08)',
      borderColor: 'rgba(232, 122, 32, 0.3)',
      title: 'وثّق حسابك الآن لشارات موثوقة',
      description: 'توثيق الهوية يمنحك مصداقية أكبر ويزيد من فرصة وصول إعلاناتك للجمهور.',
      showButton: true,
    };
  };

  const content = renderContent();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        style={{
          backgroundColor: content.bgColor,
          border: `1px solid ${content.borderColor}`,
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px var(--shadow-sm)',
              }}
            >
              {content.icon}
            </div>
            <div>
              <h6
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 700,
                  marginBottom: '2px',
                }}
              >
                {content.title}
              </h6>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontFamily: 'Cairo, sans-serif',
                  margin: 0,
                }}
              >
                {content.description}
              </p>
            </div>
          </div>

          {content.showButton && (
            <Button
              as={Link as any}
              to="/dashboard/verify"
              className="btn-orange text-nowrap align-self-start align-self-md-center"
              style={{
                borderRadius: '10px',
                padding: '8px 18px',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              بدء التوثيق <FaArrowLeft size={12} />
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default DashboardVerificationCard;