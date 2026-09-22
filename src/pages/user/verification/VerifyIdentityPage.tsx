import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAuth } from '../../../hooks/useAuth';
import { useVerification } from '../../../hooks/useVerification';
import {
  VerificationIntroCard,
  VerificationRequirementsCard,
  VerificationUploadBox,
  VerificationStatusCard,
  VerificationRejectedCard,
  VerificationSkeleton,
} from '../../../components/user/verification';

// ============================================
// Page States (for fresh users)
// ============================================
type OnboardingStep = 'intro' | 'requirements' | 'upload';

// ============================================
// Location State Type
// ============================================
interface LocationState {
  message?: string;
  reason?: 'name_changed' | 'rejected' | 'other';
}

const VerifyIdentityPage = () => {
  const { user } = useAuth();
  const { status, requirements, loading, uploading, uploadId } =
    useVerification();
  const location = useLocation();

  // ============================================
  // Read location state (from redirect after name change)
  // ============================================
  const locationState = location.state as LocationState | null;
  const stateMessage = locationState?.message;
  const stateReason = locationState?.reason;

  // Fresh onboarding flow state
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('intro');

  // Reupload flow state (for rejected users)
  const [showReupload, setShowReupload] = useState(false);

  // ============================================
  // Loading
  // ============================================
  if (loading && !status) {
    return (
      <>
        <SEO title="توثيق الهوية" />
        <VerificationSkeleton />
      </>
    );
  }

  // ============================================
  // Guard
  // ============================================
  if (!user) return null;

  // ============================================
  // Determine what to render
  // ============================================
  const renderContent = () => {
    // Already verified
    if (status?.is_verified || user.is_verified) {
      return <ApprovedState />;
    }

    // Pending
    if (status?.status === 'pending') {
      return (
        <VerificationStatusCard
          requestDate={status.request_date}
          documentTypeLabel={status.document_type_label}
          documentType={status.document_type}
        />
      );
    }

    // Rejected
    if (status?.status === 'rejected') {
      if (showReupload) {
        return (
          <VerificationUploadBox
            onSubmit={uploadId}
            uploading={uploading}
            documentTypes={requirements?.document_types}
          />
        );
      }
      return (
        <VerificationRejectedCard
          rejectionReason={status.rejection_reason}
          requestDate={status.request_date}
          documentTypeLabel={status.document_type_label}
          documentType={status.document_type}
          onReupload={() => setShowReupload(true)}
        />
      );
    }

    // ============================================
    // Fresh onboarding flow (no request yet)
    // ============================================
    if (onboardingStep === 'intro') {
      return (
        <>
          <VerificationIntroCard />
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setOnboardingStep('requirements')}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              marginTop: '1.25rem',
              padding: '14px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #E87A20, #F5A623)',
              color: '#FFFFFF',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
            }}
          >
            <FaCheckCircle size={14} />
            ابدأ التوثيق
          </motion.button>
        </>
      );
    }

    if (onboardingStep === 'requirements') {
      return (
        <VerificationRequirementsCard
          requirements={requirements}
          loading={loading}
          onContinue={() => setOnboardingStep('upload')}
          onCancel={() => setOnboardingStep('intro')}
        />
      );
    }

    // upload
    return (
      <VerificationUploadBox
        onSubmit={uploadId}
        uploading={uploading}
        documentTypes={requirements?.document_types}
      />
    );
  };

  return (
    <>
      <SEO
        title="توثيق الهوية"
        description="وثّق هويتك على منصة بصمة للاستفادة من جميع المزايا"
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '1rem',
          paddingBottom: '3rem',
        }}
        dir="rtl"
      >
        <Container fluid="xl" className="px-3 px-md-4">
          {/* ============================================ */}
          {/* Breadcrumb + Page Title */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
                flexWrap: 'wrap',
              }}
            >
              <Link
                to="/user/dashboard"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                لوحة التحكم
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ opacity: 0.7 }}>توثيق الهوية</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                  flexShrink: 0,
                }}
              >
                <FaShieldAlt size={22} color="#FFFFFF" />
              </div>
              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  توثيق الهوية
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  احصل على شارة موثق واستفد من جميع مزايا المنصة
                </p>
              </div>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* State Message Banner (from redirect) */}
          {/* ============================================ */}
          {stateMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                maxWidth: '760px',
                margin: '0 auto 1.25rem',
                padding: '14px 16px',
                backgroundColor:
                  stateReason === 'name_changed'
                    ? 'rgba(245,166,35,0.08)'
                    : 'rgba(23,162,184,0.06)',
                border:
                  stateReason === 'name_changed'
                    ? '1px solid rgba(245,166,35,0.3)'
                    : '1px solid rgba(23,162,184,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontFamily: 'Cairo, sans-serif',
                boxSizing: 'border-box',
              }}
            >
              <FaExclamationTriangle
                size={14}
                color={stateReason === 'name_changed' ? '#F5A623' : '#17A2B8'}
                style={{ flexShrink: 0, marginTop: '2px' }}
              />
              <div
                style={{
                  fontSize: '0.82rem',
                  color:
                    stateReason === 'name_changed' ? '#D97706' : '#17A2B8',
                  lineHeight: 1.6,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {stateMessage}
              </div>
            </motion.div>
          )}

          {/* ============================================ */}
          {/* Dynamic Content */}
          {/* ============================================ */}
          <div
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {renderContent()}
          </div>
        </Container>
      </div>
    </>
  );
};

// ============================================
// Approved State Component
// ============================================
const ApprovedState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    style={{
      backgroundColor: 'var(--bg-card)',
      border: '1.5px solid rgba(40,167,69,0.35)',
      borderRadius: '20px',
      padding: '2.5rem 1.75rem',
      boxShadow: '0 8px 32px rgba(40,167,69,0.15)',
      background:
        'linear-gradient(135deg, rgba(40,167,69,0.08), rgba(40,167,69,0.02))',
      textAlign: 'center',
      fontFamily: 'Cairo, sans-serif',
    }}
  >
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: '96px',
        height: '96px',
        margin: '0 auto 1.25rem',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        boxShadow: '0 12px 32px rgba(40,167,69,0.4)',
      }}
    >
      <FaCheckCircle size={42} />
    </motion.div>

    <h2
      style={{
        color: 'var(--text-secondary)',
        fontSize: 'clamp(1.3rem, 4vw, 1.6rem)',
        fontWeight: 900,
        marginBottom: '10px',
      }}
    >
      حسابك موثق
    </h2>

    <p
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        lineHeight: 1.7,
        marginBottom: '1.5rem',
        maxWidth: '480px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      تم التحقق من هويتك بنجاح. يمكنك الآن نشر إعلانات غير محدودة والاستفادة من
      جميع المزايا.
    </p>

    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 16px',
        borderRadius: '20px',
        backgroundColor: 'rgba(40,167,69,0.15)',
        color: '#28A745',
        fontSize: '0.82rem',
        fontWeight: 800,
        marginBottom: '1rem',
      }}
    >
      <FaCheckCircle size={12} />
      شارة موثق مُفعّلة
    </div>

    {/* Privacy Note */}
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        padding: '10px 14px',
        backgroundColor: 'rgba(23,162,184,0.06)',
        border: '1px solid rgba(23,162,184,0.2)',
        borderRadius: '12px',
        textAlign: 'right',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        maxWidth: '480px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <FaShieldAlt
        size={12}
        color="#17A2B8"
        style={{ flexShrink: 0, marginTop: '3px' }}
      />
      <span>
        <strong>ملاحظة:</strong> سيتم حذف صورة هويتك تلقائياً بعد{' '}
        <strong>90 يوماً</strong> من الموافقة، حفاظاً على خصوصيتك. حسابك سيبقى
        موثقاً.
      </span>
    </div>
  </motion.div>
);

export default VerifyIdentityPage;