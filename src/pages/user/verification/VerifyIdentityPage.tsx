import { useState, useMemo } from 'react';
import { Container } from 'react-bootstrap';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaHome,
  FaHandHoldingHeart,
  FaNewspaper,
  FaStar,
  FaBullhorn,
  FaLock,
  FaPlusCircle,
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

// ============================================
// Redirect message config — dynamic per destination
//
// ⚠️ IMPORTANT: These are USER-SIDE pages (user's own items).
// Public browsing pages (e.g., /basma-fund, /community) are NOT
// gated — anyone can browse them without verification.
// ============================================
type RedirectIconKey =
  | 'help-create'
  | 'help-list'
  | 'community-create'
  | 'community-list'
  | 'featured'
  | 'services'
  | 'create'
  | 'default';

interface RedirectMessageConfig {
  label: string;
  message: string;
  icon: RedirectIconKey;
}

// ============================================
// ✅ CORRECTED REDIRECT MAP
// All paths match the CURRENT sidebar paths.
// ============================================
const REDIRECT_MESSAGES: Record<string, RedirectMessageConfig> = {
  // ============================================
  // Basma Fund — Help Requests (Section 02)
  // ============================================
  '/user/basma-fund/help-requests/create': {
    label: 'تقديم طلب مساعدة',
    message:
      'لتقديم طلب مساعدة في صندوق بصمة، يجب توثيق هويتك أولاً. التوثيق يضمن جدية الطلبات، ويحمي المتبرعين والمستفيدين على حدٍ سواء. سيراجع فريقنا طلبك خلال 24-48 ساعة.',
    icon: 'help-create',
  },
  '/user/basma-fund/help-requests': {
    label: 'طلبات المساعدة',
    message:
      'لمتابعة طلبات المساعدة التي قدّمتها ومعرفة حالتها، يجب توثيق هويتك أولاً. التوثيق شرط أساسي للمشاركة في صندوق بصمة.',
    icon: 'help-list',
  },

  // ---- Legacy paths (safety net) ----
  '/user/help-requests/create': {
    label: 'تقديم طلب مساعدة',
    message: 'لتقديم طلب مساعدة في صندوق بصمة، يجب توثيق هويتك أولاً.',
    icon: 'help-create',
  },
  '/user/help-requests': {
    label: 'طلبات المساعدة',
    message: 'لمتابعة طلبات المساعدة، يجب توثيق هويتك أولاً.',
    icon: 'help-list',
  },

  // ============================================
  // Community Posts (Section 03)
  // ============================================
  '/user/community-posts/create': {
    label: 'إنشاء منشور جديد',
    message:
      'لنشر تحذير أو إعلان مفقود/موجود في مجتمعك، يجب توثيق هويتك أولاً. كل منشور يمر بمراجعة لضمان جودة المحتوى وحماية المجتمع من المعلومات الكاذبة.',
    icon: 'community-create',
  },
  '/user/community-posts': {
    label: 'منشوراتي',
    message:
      'لمتابعة المنشورات التي نشرتها ومعرفة حالتها (قيد المراجعة / منشورة / تم حل)، يجب توثيق هويتك أولاً.',
    icon: 'community-list',
  },

  // ============================================
  // Exchange (Section 01)
  // ============================================
  '/user/featured-requests': {
    label: 'طلبات التمييز',
    message:
      'لعرض طلبات تمييز خدماتك ومتابعة حالتها، يجب توثيق هويتك أولاً.',
    icon: 'featured',
  },
  '/user/my-announcements': {
    label: 'خدماتي',
    message: 'لإدارة عروضك وطلباتك ومتابعة حالتها، يجب توثيق هويتك أولاً.',
    icon: 'services',
  },
  '/user/announcements/create': {
    label: 'نشر عرض أو طلب',
    message:
      'لنشر عرض أو طلب جديد في مجتمعك، يجب توثيق هويتك أولاً. التوثيق يمنحك نشراً غير محدود.',
    icon: 'create',
  },
};

// ============================================
// ✅ URL-SEGMENT FALLBACK MAP
// Applied when a path isn't found in REDIRECT_MESSAGES.
// Ensures we NEVER show a raw URL segment as the label.
// ============================================
const SEGMENT_TO_ARABIC: Record<string, string> = {
  'basma-fund': 'صندوق بصمة',
  'help-requests': 'طلبات المساعدة',
  create: 'تقديم طلب',
  'community-posts': 'منشورات المجتمع',
  announcements: 'تبادل الخدمات',
  'my-announcements': 'خدماتي',
  'featured-requests': 'طلبات التمييز',
  'my-reviews': 'تقييماتي',
  'verify-identity': 'التحقق من الهوية',
};

const GENERIC_REDIRECT_MESSAGE =
  'للوصول إلى هذه الميزة، يجب توثيق هويتك أولاً. التوثيق يضمن مجتمعاً آمناً وموثوقاً للجميع.';

const ARABIC_REGEX = /[\u0600-\u06FF]/;

/**
 * ✅ SAFE getRedirectConfig — never returns a raw URL segment.
 *
 * Priority:
 *   1. Exact match on full path
 *   2. Trimmed trailing slash match
 *   3. Walk parent paths (longest first)
 *   4. Last-segment match against SEGMENT_TO_ARABIC
 *   5. Generic Arabic fallback
 */
const getRedirectConfig = (path: string): RedirectMessageConfig => {
  // 1. Exact match
  if (REDIRECT_MESSAGES[path]) return REDIRECT_MESSAGES[path];

  // 2. Trailing slash trimmed
  const cleaned = path.replace(/\/+$/, '');
  if (REDIRECT_MESSAGES[cleaned]) return REDIRECT_MESSAGES[cleaned];

  // 3. Walk parent paths
  const parts = cleaned.split('/').filter(Boolean);
  for (let i = parts.length; i > 0; i--) {
    const subPath = '/' + parts.slice(0, i).join('/');
    if (REDIRECT_MESSAGES[subPath]) return REDIRECT_MESSAGES[subPath];
  }

  // 4. Last segment lookup
  const lastSegment = parts[parts.length - 1];
  if (lastSegment && SEGMENT_TO_ARABIC[lastSegment]) {
    return {
      label: SEGMENT_TO_ARABIC[lastSegment],
      message: GENERIC_REDIRECT_MESSAGE,
      icon: 'default',
    };
  }

  // 5. Absolute fallback — Arabic generic
  return {
    label: 'ميزة محمية',
    message: GENERIC_REDIRECT_MESSAGE,
    icon: 'default',
  };
};

// ============================================
// Icon map
// ============================================
const REDIRECT_ICONS: Record<
  RedirectIconKey,
  React.ComponentType<{ size?: number }>
> = {
  'help-create': FaHandHoldingHeart,
  'help-list': FaHandHoldingHeart,
  'community-create': FaNewspaper,
  'community-list': FaNewspaper,
  featured: FaStar,
  services: FaBullhorn,
  create: FaPlusCircle,
  default: FaLock,
};

// ============================================
// VerifyIdentityPage
// ============================================
const VerifyIdentityPage = () => {
  const { user } = useAuth();
  const { status, requirements, loading, uploading, uploadId } =
    useVerification();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ============================================
  // Read redirect target from URL (?redirect=/path)
  // ============================================
  const redirectTo = useMemo(() => {
    const raw = searchParams.get('redirect');
    if (!raw) return null;
    if (!raw.startsWith('/')) return null;
    return raw;
  }, [searchParams]);

  // ============================================
  // Read location state
  // ============================================
  const locationState = location.state as LocationState | null;
  const stateMessage = locationState?.message;
  const stateReason = locationState?.reason;

  // Fresh onboarding flow state
  const [onboardingStep, setOnboardingStep] =
    useState<OnboardingStep>('intro');

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
      return (
        <ApprovedState
          redirectTo={redirectTo}
          onNavigate={() => {
            if (redirectTo) navigate(redirectTo);
          }}
        />
      );
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
          {/* Breadcrumb + Page Title */}
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

          {/* Redirect Context Banner — Dynamic */}
          {redirectTo && !status?.is_verified && !user.is_verified && (
            <RedirectContextBanner redirectTo={redirectTo} />
          )}

          {/* State Message Banner */}
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

          {/* Dynamic Content */}
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
// Redirect Context Banner
// ============================================
interface RedirectContextBannerProps {
  redirectTo: string;
}

const RedirectContextBanner = ({
  redirectTo,
}: RedirectContextBannerProps) => {
  const config = getRedirectConfig(redirectTo);
  const Icon = REDIRECT_ICONS[config.icon];

  // ✅ Guard: if config.label somehow contains no Arabic, use a safe fallback
  const safeLabel = ARABIC_REGEX.test(config.label)
    ? config.label
    : 'ميزة محمية';

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        position: 'relative',
        maxWidth: '760px',
        margin: '0 auto 1.25rem',
        padding: '16px 18px',
        borderRadius: '16px',
        overflow: 'hidden',
        fontFamily: 'Cairo, sans-serif',
        boxSizing: 'border-box',
        backgroundColor: 'var(--bg-card)',
        border: '1.5px solid rgba(232,122,32,0.35)',
        boxShadow:
          '0 8px 24px rgba(232,122,32,0.12), 0 0 0 1px rgba(232,122,32,0.05)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
      }}
    >
      {/* Animated gradient shimmer */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 0.5,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(232,122,32,0.9) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(232,122,32,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Icon bubble with pulse */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 18,
          delay: 0.15,
        }}
        style={{
          flexShrink: 0,
          position: 'relative',
          width: '42px',
          height: '42px',
        }}
      >
        <motion.span
          animate={{
            scale: [1, 1.35, 1.35],
            opacity: [0.4, 0, 0],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeOut',
            repeatDelay: 0.4,
          }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '12px',
            border: '1.5px solid #E87A20',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #E87A20, #F5A623)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(232,122,32,0.35)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Icon size={17} />
        </div>
      </motion.div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header line */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '6px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(232,122,32,0.12)',
              color: '#E87A20',
              fontSize: '0.72rem',
              fontWeight: 800,
              border: '1px solid rgba(232,122,32,0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            <FaLock size={9} />
            ميزة تتطلب التوثيق
          </span>

          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28, duration: 0.3 }}
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.86rem',
              fontWeight: 800,
              whiteSpace: 'nowrap',
            }}
          >
            {safeLabel}
          </motion.span>
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          style={{
            margin: 0,
            fontSize: '0.82rem',
            lineHeight: 1.7,
            color: 'var(--text-muted)',
          }}
        >
          {config.message}
        </motion.p>
      </div>
    </motion.div>
  );
};

// ============================================
// Approved State Component
// ============================================
interface ApprovedStateProps {
  redirectTo: string | null;
  onNavigate: () => void;
}

const ApprovedState = ({ redirectTo, onNavigate }: ApprovedStateProps) => (
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
      تم التحقق من هويتك بنجاح. يمكنك الآن نشر عروض وطلبات غير محدودة والاستفادة
      من جميع المزايا.
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
        marginBottom: '1.25rem',
      }}
    >
      <FaCheckCircle size={12} />
      شارة موثق مُفعّلة
    </div>

    {/* CTA */}
    <div
      style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '1rem',
      }}
    >
      {redirectTo ? (
        <>
          <motion.button
            onClick={onNavigate}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #E87A20, #F5A623)',
              color: '#FFFFFF',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(232,122,32,0.35)',
            }}
          >
            <FaArrowLeft size={13} />
            الانتقال إلى {getRedirectConfig(redirectTo).label}
          </motion.button>

          <Link
            to="/user/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '12px',
              border: '1.5px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <FaHome size={12} />
            لوحة التحكم
          </Link>
        </>
      ) : (
        <Link
          to="/user/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-orange)',
            color: '#FFFFFF',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.88rem',
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '0 6px 20px rgba(232,122,32,0.35)',
          }}
        >
          <FaHome size={13} />
          العودة إلى لوحة التحكم
        </Link>
      )}
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