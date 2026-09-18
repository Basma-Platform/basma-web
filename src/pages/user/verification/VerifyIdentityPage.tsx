import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAuth } from '../../../hooks/useAuth';
import { useVerification } from '../../../hooks/useVerification';
import {
  VerificationIntroCard,
  VerificationUploadBox,
  VerificationStatusCard,
  VerificationRejectedCard,
  VerificationSkeleton,
} from '../../../components/user/verification';

const VerifyIdentityPage = () => {
  const { user } = useAuth();
  const { status, loading, uploading, uploadId } = useVerification();
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
    // ⚠️ Already verified (server-side check)
    if (status?.is_verified || user.is_verified) {
      return <ApprovedState />;
    }

    // Pending
    if (status?.status === 'pending') {
      return (
        <VerificationStatusCard requestDate={status.request_date} />
      );
    }

    // Rejected — show rejection + re-upload (or just rejection card until reupload clicked)
    if (status?.status === 'rejected') {
      if (showReupload) {
        return (
          <VerificationUploadBox
            onSubmit={uploadId}
            uploading={uploading}
          />
        );
      }
      return (
        <VerificationRejectedCard
          rejectionReason={status.rejection_reason}
          requestDate={status.request_date}
          onReupload={() => setShowReupload(true)}
        />
      );
    }

    // Default: no request yet — show intro + upload
    return (
      <>
        <VerificationIntroCard />
        <div style={{ marginTop: '1.25rem' }}>
          <VerificationUploadBox
            onSubmit={uploadId}
            uploading={uploading}
          />
        </div>
      </>
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
                }}
              >
                <FaShieldAlt size={22} color="#FFFFFF" />
              </div>
              <div>
                <h1
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.4rem, 2vw, 1.7rem)',
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
                    fontSize: '0.85rem',
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
          {/* Dynamic Content */}
          {/* ============================================ */}
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
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
        fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
        fontWeight: 900,
        marginBottom: '10px',
      }}
    >
      حسابك موثق 🎉
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
      }}
    >
      <FaCheckCircle size={12} />
      شارة موثق مُفعّلة
    </div>
  </motion.div>
);

export default VerifyIdentityPage;