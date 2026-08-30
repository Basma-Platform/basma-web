import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { getPostAuthPath } from '../../utils/authRedirect';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import type { ForgotPasswordFormData } from '../../components/auth/ForgotPasswordForm';
import logo from '../../assets/logo.png';
import SEO from '../../components/SEO'; // ✅ إضافة

const ForgotPasswordPage = () => {
  const { forgotPassword, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getPostAuthPath(user));
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await forgotPassword(data.email);
      setSuccessMessage('✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    } catch (error: any) {
      const message = error.response?.data?.message || 'حدث خطأ، يرجى المحاولة مرة أخرى';
      setErrorMessage(message);
    }
  };

  return (
    <>
      {/* ✅ إضافة SEO */}
      <SEO
        title="نسيت كلمة المرور"
        description="أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور في منصة بصمة."
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            boxShadow: '0 8px 32px var(--shadow-sm)',
            border: '1px solid var(--border-color)',
          }}
        >
          {/* Logo & Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ textAlign: 'center', marginBottom: '1.5rem' }}
          >
            <Link to="/">
              <img
                src={logo}
                alt="بصمة"
                style={{
                  height: '50px',
                  width: 'auto',
                  marginBottom: '0.5rem',
                }}
              />
            </Link>
            <h1
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.8rem',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '0.25rem',
              }}
            >
              نسيت كلمة المرور
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
            </p>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'rgba(232,122,32,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <FaLock size={32} color="var(--primary-orange)" />
          </motion.div>

          {/* Form */}
          <ForgotPasswordForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            successMessage={successMessage}
            errorMessage={errorMessage}
          />

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              marginTop: '1.5rem',
              textAlign: 'center',
            }}
          >
            <Link
              to="/login"
              style={{
                color: 'var(--primary-orange)',
                textDecoration: 'none',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              العودة إلى تسجيل الدخول
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;