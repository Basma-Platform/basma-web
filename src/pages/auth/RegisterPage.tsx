import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHandshake, FaShieldAlt, FaUserCheck, FaUsers,
  FaExchangeAlt
} from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { getPostAuthPath } from '../../utils/authRedirect';
import RegisterForm from '../../components/auth/RegisterForm';
import type { RegisterFormData } from '../../components/auth/RegisterForm';
import logo from '../../assets/logo.png';
import SEO from '../../components/SEO';

const RegisterPage = () => {
  const { isDark } = useTheme();
  const { register: registerUser, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getPostAuthPath(user));
    }
  }, [isAuthenticated, user, navigate]);

  // ✅ 6 seconds per bubble
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 6000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const fullWhatsapp = `${data.countryCode}${data.whatsappNumber}`;
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        whatsapp: fullWhatsapp,
        governorate_id: Number(data.governorate_id),
        city_id: Number(data.city_id),
        terms_accepted: data.terms_accepted,
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const features = [
    { 
      icon: <FaExchangeAlt />, 
      label: 'تبادل آمن', 
      desc: 'تواصل وتبادل موثوق بين أفراد المجتمع',
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      glowColor: 'rgba(16, 185, 129, 0.4)',
    },
    { 
      icon: <FaShieldAlt />, 
      label: 'تسجيل آمن', 
      desc: 'بياناتك محمية بأعلى معايير الأمان والتشفير',
      color: '#E87A20',
      bgColor: 'rgba(232, 122, 32, 0.15)',
      glowColor: 'rgba(232, 122, 32, 0.4)',
    },
    { 
      icon: <FaUserCheck />, 
      label: 'هوية موثقة', 
      desc: 'نظام توثيق يبني الثقة بين جميع الأعضاء',
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.15)',
      glowColor: 'rgba(59, 130, 246, 0.4)',
    },
    { 
      icon: <FaUsers />, 
      label: 'مجتمع متكافل', 
      desc: 'مجتمع متنامٍ يتبادل الخدمات والموارد بروح التعاون',
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.15)',
      glowColor: 'rgba(139, 92, 246, 0.4)',
    },
  ];

  const activeFeature = features[activeStep];

  const dotPositions = [
    { top: '-15px', left: '50%', transform: 'translateX(-50%)' },
    { top: '50%', right: '-15px', transform: 'translateY(-50%)' },
    { bottom: '-15px', left: '50%', transform: 'translateX(-50%)' },
    { top: '50%', left: '-15px', transform: 'translateY(-50%)' },
  ];

  return (
    <>
      <SEO
        title="إنشاء حساب"
        description="أنشئ حسابك في منصة بصمة وانضم إلى مجتمع التبادل والتكافل في غزة."
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
          className="register-shell"
          style={{
            width: '100%',
            maxWidth: '1080px',
            display: 'grid',
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px var(--shadow-sm)',
            border: '1px solid var(--border-color)',
          }}
        >
          {/* ===== FORM PANEL ===== */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              padding: '2.5rem 2rem',
              position: 'relative',
            }}
          >
            {/* ✅ Logo & Header - Logo يظهر فقط على الموبايل */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ textAlign: 'center', marginBottom: '0.5rem', position: 'relative' }}
            >
              {/* ✅ Logo - يظهر على الموبايل فقط مع لون مناسب للوضع */}
              <div className="mobile-logo" style={{ marginBottom: '0.5rem' }}>
                <Link to="/" style={{ display: 'inline-block' }}>
                  <img
                    src={logo}
                    alt="بصمة"
                    style={{ 
                      height: '50px', 
                      width: 'auto', 
                      display: 'block', 
                      margin: '0 auto',
                      // ✅ في الوضع الداكن: يصبح أبيض، في الوضع الفاتح: لونه الطبيعي
                      filter: isDark ? 'brightness(0) invert(1)' : 'none',
                      transition: 'filter 0.3s ease',
                    }}
                  />
                </Link>
              </div>

              {/* ✅ Mobile Badge - يظهر على الموبايل فقط */}
              <div className="mobile-badge">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 14px',
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    border: '2px solid rgba(232,122,32,0.2)',
                    boxShadow: '0 4px 16px var(--shadow-md)',
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <FaShieldAlt size={14} color="#E87A20" />
                  <span
                    style={{
                      color: '#E87A20',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    تسجيل آمن
                  </span>
                </div>
              </div>

              <h1
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '0.15rem',
                  marginTop: '0.5rem',
                }}
              >
                إنشاء حساب جديد
              </h1>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                انضم إلى مجتمع بصمة وابدأ بالمشاركة والتبادل
              </p>
            </motion.div>

            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                marginTop: '1.5rem',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                لديك حساب بالفعل؟{' '}
                <Link to="/login" style={{ color: 'var(--primary-orange)', textDecoration: 'none', fontWeight: 600 }}>
                  تسجيل الدخول
                </Link>
              </p>
            </motion.div>
          </div>

          {/* ===== BRANDING PANEL - مع ألوان متغيرة من index.css ===== */}
          <div
            className="register-brand-panel"
            style={{
              background: 'var(--brand-gradient)',
              padding: '3rem 2.5rem',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Decorative blurred circles */}
            <div
              style={{
                position: 'absolute',
                top: '-60px',
                left: '-60px',
                width: '220px',
                height: '220px',
                borderRadius: '50%',
                background: 'var(--brand-glow)',
                filter: 'blur(10px)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-80px',
                right: '-40px',
                width: '260px',
                height: '260px',
                borderRadius: '50%',
                background: 'var(--brand-glow)',
                filter: 'blur(10px)',
              }}
            />

            {/* Brand Logo - بحجم أكبر مع ألوانه الطبيعية */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ marginBottom: '1.5rem' }}
            >
              <img
                src={logo}
                alt="بصمة"
                style={{ 
                  height: '80px', 
                  width: 'auto', 
                  display: 'block',
                  margin: '0 auto',
                  // ✅ في الوضع الداكن: يصبح أبيض، في الوضع الفاتح: لونه الطبيعي
                  filter: isDark ? 'brightness(0) invert(1)' : 'none',
                  transition: 'filter 0.3s ease',
                }}
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                color: 'var(--brand-text)',
                fontSize: '1.8rem',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '0.5rem',
                lineHeight: 1.3,
              }}
            >
              مجتمع التبادل والتكافل لأهل غزة
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                color: 'var(--brand-text-secondary)',
                fontSize: '0.95rem',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.8,
                marginBottom: '2rem',
                maxWidth: '400px',
              }}
            >
              منصة تبادل مجتمعية تربط بين أبناء غزة لتبادل السلع والخدمات بروح التعاون والثقة.
            </motion.p>

            {/* ===== CYCLE CONTAINER ===== */}
            <div
              style={{
                position: 'relative',
                width: '280px',
                height: '280px',
                margin: '0 auto',
              }}
            >
              {/* Rotating Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: '2px dashed rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                }}
              />

              {/* Center Core */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  background: 'var(--brand-core-bg)',
                  backdropFilter: 'blur(4px)',
                  border: `2px solid ${activeFeature.color}60`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3,
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.6, 1.6, 1],
                    boxShadow: [
                      `0 0 20px ${activeFeature.glowColor}`,
                      `0 0 80px ${activeFeature.glowColor}`,
                      `0 0 80px ${activeFeature.glowColor}`,
                      `0 0 20px ${activeFeature.glowColor}`,
                    ],
                  }}
                  transition={{
                    scale: {
                      duration: 6,
                      times: [0, 0.5, 0.5, 1],
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    boxShadow: {
                      duration: 6,
                      times: [0, 0.5, 0.5, 1],
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaHandshake color="var(--brand-icon)" size={40} />
                </motion.div>
              </div>

              {/* 4 Dots */}
              {features.map((feature, index) => {
                const isActive = activeStep === index;
                const pos = dotPositions[index];

                return (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      ...pos,
                      zIndex: 4,
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: isActive ? 1.4 : 1,
                        borderColor: isActive ? feature.color : 'rgba(255,255,255,0.25)',
                        backgroundColor: isActive ? feature.bgColor : 'rgba(255,255,255,0.06)',
                        boxShadow: isActive 
                          ? `0 0 40px ${feature.glowColor}` 
                          : 'none',
                      }}
                      whileHover={{
                        scale: 1.25,
                        borderColor: feature.color,
                        boxShadow: `0 0 30px ${feature.glowColor}`,
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(4px)',
                        color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                      }}
                      onClick={() => {
                        setActiveStep(index);
                        if (intervalRef.current) {
                          clearInterval(intervalRef.current);
                          intervalRef.current = null;
                        }
                        setTimeout(() => {
                          intervalRef.current = setInterval(() => {
                            setActiveStep((prev) => (prev + 1) % 4);
                          }, 6000);
                        }, 3000);
                      }}
                      aria-label={feature.label}
                    >
                      <span style={{ 
                        fontSize: '1.2rem',
                        color: isActive ? feature.color : '#FFFFFF',
                        transition: 'color 0.3s ease',
                      }}>
                        {feature.icon}
                      </span>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Cycle Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                style={{
                  marginTop: '2rem',
                  textAlign: 'center',
                  minHeight: '80px',
                  backgroundColor: 'var(--brand-content-bg)',
                  borderRadius: '16px',
                  padding: '16px 24px',
                  border: '1px solid var(--brand-border)',
                  width: '100%',
                  maxWidth: '320px',
                }}
              >
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--brand-text)',
                    fontFamily: 'Cairo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ color: activeFeature.color, marginLeft: '8px' }}>
                    {activeFeature.icon}
                  </span>
                  {activeFeature.label}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--brand-text-secondary)',
                    fontFamily: 'Cairo, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  {activeFeature.desc}
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    width: '60px',
                    height: '3px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                    margin: '10px auto 0',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    key={activeStep}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 6, ease: 'linear' }}
                    style={{
                      height: '100%',
                      backgroundColor: activeFeature.color,
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dot Indicators */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginTop: '2rem',
              }}
            >
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveStep(index);
                    if (intervalRef.current) {
                      clearInterval(intervalRef.current);
                      intervalRef.current = null;
                    }
                    setTimeout(() => {
                      intervalRef.current = setInterval(() => {
                        setActiveStep((prev) => (prev + 1) % 4);
                      }, 6000);
                    }, 3000);
                  }}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: activeStep === index 
                      ? feature.color 
                      : 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                    boxShadow: activeStep === index 
                      ? `0 0 15px ${feature.glowColor}` 
                      : 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = feature.color;
                    e.currentTarget.style.boxShadow = `0 0 15px ${feature.glowColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = activeStep === index 
                      ? feature.color 
                      : 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.boxShadow = activeStep === index 
                      ? `0 0 15px ${feature.glowColor}` 
                      : 'none';
                  }}
                  aria-label={feature.label}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <style>{`
          .register-shell {
            grid-template-columns: 1fr;
          }
          .register-brand-panel {
            display: none;
          }
          .mobile-badge {
            display: none;
          }
          .mobile-logo {
            display: block;
          }

          @media (min-width: 992px) {
            .register-shell {
              grid-template-columns: 1fr 1fr;
            }
            .register-brand-panel {
              display: flex;
            }
            .mobile-badge {
              display: none !important;
            }
            .mobile-logo {
              display: none !important;
            }
          }

          @media (max-width: 991px) {
            .register-shell {
              grid-template-columns: 1fr;
            }
            .register-brand-panel {
              display: none !important;
            }
            .mobile-badge {
              display: block !important;
            }
            .mobile-logo {
              display: block !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default RegisterPage;