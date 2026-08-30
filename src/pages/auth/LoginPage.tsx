import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { getPostAuthPath } from '../../utils/authRedirect';
import LoginForm from '../../components/auth/LoginForm';
import type { LoginFormData } from '../../components/auth/LoginForm';
import logo from '../../assets/logo.png';
import SEO from '../../components/SEO'; // ✅ إضافة

const LoginPage = () => {
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [successMessage] = useState<string | null>(location.state?.message || null);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getPostAuthPath(user));
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    setError(null);
    try {
      await login({
        email: data.email,
        password: data.password,
        remember: data.remember || false,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'حدث خطأ، يرجى المحاولة مرة أخرى';
      setError(message);
    }
  };

  return (
    <>
      {/* ✅ إضافة SEO */}
      <SEO
        title="تسجيل الدخول"
        description="سجل دخولك إلى منصة بصمة للوصول إلى حسابك وخدمات المنصة."
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
              مرحباً بعودتك
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              سجل دخولك للوصول إلى حسابك
            </p>
          </motion.div>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'rgba(40,167,69,0.08)',
                color: 'var(--success)',
                padding: '10px 14px',
                borderRadius: '10px',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                fontFamily: 'Cairo, sans-serif',
                textAlign: 'center',
                border: '1px solid rgba(40,167,69,0.15)',
              }}
            >
              {successMessage}
            </motion.div>
          )}

          {/* Login Form */}
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              ليس لديك حساب؟{' '}
              <Link to="/register" style={{ color: 'var(--primary-orange)', textDecoration: 'none', fontWeight: 600 }}>
                إنشاء حساب جديد
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;