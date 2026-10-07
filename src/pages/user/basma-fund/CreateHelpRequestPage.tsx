import { useCallback, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronRight,
  FaHandHoldingHeart,
  FaLock,
  FaInfoCircle,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';

import { CreateHelpRequestForm } from '../../../components/user/basma-fund/forms';
import { useHelpRequestRequirements } from '../../../hooks/useHelpRequestRequirements';
import { useAuth } from '../../../hooks/useAuth';
import { FUND_THEME } from '../../../utils/helpRequestHelpers';

const CreateHelpRequestPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { requirements, loading: requirementsLoading } =
    useHelpRequestRequirements();

  const [verified, setVerified] = useState(true);

  // ============================================
  // Verification guard
  // ============================================
  useEffect(() => {
    if (!user) return;
    if (!user.is_verified) {
      setVerified(false);
    }
  }, [user]);

  const handleSuccess = useCallback(
    (id: number) => {
      navigate('/user/basma-fund/help-requests', {
        state: {
          justCreatedId: id,
          message: 'تم استلام طلبك وسيتم مراجعته من قِبل الإدارة.',
        },
      });
    },
    [navigate]
  );

  // ============================================
  // Unverified guard
  // ============================================
  if (!verified) {
    return (
      <>
        <SEO title="تقديم طلب مساعدة" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
          }}
        >
          <div
            style={{
              maxWidth: '460px',
              padding: '2.25rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                margin: '0 auto 1rem',
                borderRadius: '50%',
                background: 'rgba(220,53,69,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DC3545',
              }}
            >
              <FaLock size={28} />
            </div>
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                fontWeight: 800,
                margin: '0 0 8px',
              }}
            >
              توثيق الهوية مطلوب
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                lineHeight: 1.7,
                margin: '0 0 1.25rem',
              }}
            >
              يجب توثيق هويتك أولاً قبل تقديم طلب مساعدة. هذا يضمن جدية الطلبات
              وحماية جميع الأطراف.
            </p>
            <Link
              to="/user/verify-identity"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                borderRadius: '11px',
                background: FUND_THEME.gradient,
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 800,
                boxShadow: `0 6px 18px ${FUND_THEME.shadow}`,
              }}
            >
              <FaLock size={12} />
              توثيق الهوية الآن
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO
        title="تقديم طلب مساعدة | صندوق بصمة"
        description="قدّم طلب مساعدة في صندوق بصمة — آمن، مشفّر، وموثوق"
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '2rem',
          paddingBottom: '3rem',
        }}
        dir="rtl"
      >
        <Container className="px-3 px-md-4" style={{ maxWidth: '820px' }}>
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
              fontFamily: 'Cairo, sans-serif',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/user/basma-fund/help-requests"
              style={{
                color: FUND_THEME.accent,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              طلباتي
            </Link>
            <FaChevronRight
              size={9}
              style={{ opacity: 0.4, transform: 'rotate(180deg)' }}
            />
            <span style={{ opacity: 0.75 }}>تقديم طلب جديد</span>
          </motion.nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1], rotate: [0, 4, -4, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: FUND_THEME.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: `0 8px 22px ${FUND_THEME.shadow}`,
                flexShrink: 0,
              }}
            >
              <FaHandHoldingHeart size={24} />
            </motion.div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(1.3rem, 4vw, 1.65rem)',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                تقديم طلب مساعدة
              </h1>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontFamily: 'Cairo, sans-serif',
                  margin: '4px 0 0',
                  lineHeight: 1.5,
                }}
              >
                املأ الحقول بعناية — سيتم مراجعة الطلب من قِبل الإدارة قبل
                النشر.
              </p>
            </div>
          </motion.div>

          {/* Info banner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            style={{
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--notice-info-bg)',
              border: '1px solid var(--notice-info-border)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <FaInfoCircle
              size={13}
              color={FUND_THEME.accent}
              style={{ flexShrink: 0, marginTop: '2px' }}
            />
            <span
              style={{
                color: 'var(--notice-info-text)',
                fontSize: '0.78rem',
                lineHeight: 1.65,
                fontWeight: 600,
              }}
            >
              جميع الحقول المعلّمة بـ{' '}
              <span style={{ color: '#DC3545' }}>*</span> إلزامية. يمكنك
              تعديل أي شيء قبل الإرسال.
            </span>
          </motion.div>

          {/* Form */}
          {requirementsLoading && !requirements ? (
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              <span
                className="spinner-border"
                style={{
                  width: '32px',
                  height: '32px',
                  color: FUND_THEME.accent,
                }}
              />
              <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                جاري تحميل متطلبات الطلب...
              </div>
            </div>
          ) : (
            <CreateHelpRequestForm
              requirements={requirements}
              defaultWhatsapp={user?.whatsapp}
              defaultFullName={user?.name}
              onSuccess={handleSuccess}
            />
          )}
        </Container>
      </div>
    </>
  );
};

export default CreateHelpRequestPage;