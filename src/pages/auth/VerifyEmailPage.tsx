import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Alert, Spinner, Button } from 'react-bootstrap';
import { FaEnvelopeOpenText, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardPath } from '../../utils/authRedirect';
import SEO from '../../components/SEO'; // ✅ إضافة

interface LocationState {
  email?: string;
  showToast?: boolean;
}

type VerifyStatus = 'idle' | 'verifying' | 'success' | 'error';

const VerifyEmailPage = () => {
  const { id, hash } = useParams<{ id: string; hash: string }>();
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const locationState = state as LocationState | null;
  const { verifyEmail, resendVerification, user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const hasRunRef = useRef(false);

  const email = locationState?.email || user?.email;

  // Redirect away if there's nothing to do on this page
  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user?.email_verified_at) {
      navigate(getDashboardPath(user.role), { replace: true });
      return;
    }

    if (!isAuthenticated && !user && !locationState?.email && !id) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, user, locationState?.email, id, navigate]);

  // Auto-verify when opened from the email link (id + hash present)
  useEffect(() => {
    if (!id || !hash) return;
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const run = async () => {
      setStatus('verifying');
      try {
        await verifyEmail({
          id,
          hash,
          expires: searchParams.get('expires') || undefined,
          signature: searchParams.get('signature') || undefined,
        });
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(
          err?.response?.data?.message || 'رابط التفعيل غير صالح أو منتهي الصلاحية'
        );
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, hash]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResendMessage(null);
    try {
      await resendVerification(email);
      setResendMessage('تم إرسال رابط تفعيل جديد إلى بريدك الإلكتروني');
    } catch (err: any) {
      setResendMessage(err?.response?.data?.message || 'تعذر إرسال رابط التفعيل');
    } finally {
      setResending(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated && !user && !locationState?.email && !id) {
    return null;
  }

  if (isAuthenticated && user?.email_verified_at) {
    return null;
  }

  const cardStyle = {
    maxWidth: 560,
    margin: '0 auto',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '24px',
    padding: '2.5rem 2rem',
    boxShadow: '0 8px 32px var(--shadow-sm)',
    border: '1px solid var(--border-color)',
  };

  const headingStyle = {
    color: 'var(--text-secondary)',
    fontSize: '1.6rem',
    fontWeight: 800,
    fontFamily: 'Cairo, sans-serif',
    marginBottom: '0.5rem',
  };

  const bodyStyle = {
    color: 'var(--text-muted)',
    lineHeight: 1.9,
    fontFamily: 'Cairo, sans-serif',
  };

  const resendButtonStyle = {
    backgroundColor: 'var(--primary-orange)',
    borderColor: 'var(--primary-orange)',
    fontFamily: 'Cairo, sans-serif',
  };

  return (
    <>
      {/* ✅ إضافة SEO */}
      <SEO
        title="تفعيل البريد الإلكتروني"
        description="قم بتفعيل بريدك الإلكتروني لتفعيل حسابك على منصة بصمة والوصول إلى جميع الخدمات."
      />

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          paddingTop: '100px',
          paddingBottom: '60px',
          backgroundColor: 'var(--bg-body)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
            style={cardStyle}
          >
            {status === 'verifying' && (
              <>
                <Spinner
                  animation="border"
                  style={{ color: 'var(--primary-orange)', width: '3rem', height: '3rem' }}
                  className="mb-4"
                />
                <h1 style={headingStyle}>جاري تفعيل حسابك...</h1>
              </>
            )}

            {status === 'success' && (
              <>
                <FaCheckCircle size={62} color="var(--success)" className="mb-4" />
                <h1 style={headingStyle}>تم تفعيل حسابك بنجاح!</h1>
                <p style={bodyStyle}>جاري تحويلك إلى لوحة التحكم...</p>
              </>
            )}

            {status === 'error' && (
              <>
                <FaTimesCircle size={62} color="var(--error)" className="mb-4" />
                <h1 style={headingStyle}>تعذر تفعيل الحساب</h1>
                <Alert variant="danger" className="text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {errorMessage}
                </Alert>
                {email && (
                  <Button
                    onClick={() => void handleResend()}
                    disabled={resending}
                    className="rounded-pill fw-bold px-4 mt-2"
                    style={resendButtonStyle}
                  >
                    {resending ? 'جاري الإرسال...' : 'إعادة إرسال رابط التفعيل'}
                  </Button>
                )}
                {resendMessage && (
                  <Alert variant="info" className="text-center mt-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {resendMessage}
                  </Alert>
                )}
                <div className="mt-4">
                  <Link to="/login" style={{ color: 'var(--primary-orange)', fontFamily: 'Cairo, sans-serif' }}>
                    العودة إلى تسجيل الدخول
                  </Link>
                </div>
              </>
            )}

            {status === 'idle' && !id && !hash && (
              <>
                <FaEnvelopeOpenText size={62} color="var(--primary-orange)" className="mb-4" />
                <h1 style={headingStyle}>تحقق من بريدك الإلكتروني</h1>
                <p style={bodyStyle}>
                  أرسلنا رابط تفعيل الحساب إلى{' '}
                  {email ? <strong dir="ltr">{email}</strong> : 'بريدك الإلكتروني'}. افتح الرسالة
                  واضغط رابط التفعيل لتفعيل حسابك والوصول إلى جميع مزايا المنصة.
                </p>

                {locationState?.showToast && (
                  <Alert variant="warning" className="text-center mt-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    يجب تفعيل بريدك الإلكتروني للوصول إلى هذه الصفحة
                  </Alert>
                )}

                {resendMessage && (
                  <Alert variant="info" className="text-center mt-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {resendMessage}
                  </Alert>
                )}

                {email && (
                  <Button
                    onClick={() => void handleResend()}
                    disabled={resending}
                    className="rounded-pill fw-bold px-4 mt-2"
                    style={resendButtonStyle}
                  >
                    {resending ? 'جاري الإرسال...' : 'إعادة إرسال رابط التفعيل'}
                  </Button>
                )}

                <div className="mt-4">
                  <Link to="/" style={{ color: 'var(--primary-orange)', fontFamily: 'Cairo, sans-serif' }}>
                    العودة إلى الصفحة الرئيسية
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </Container>
      </div>
    </>
  );
};

export default VerifyEmailPage;