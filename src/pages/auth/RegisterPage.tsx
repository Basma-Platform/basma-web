import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { getPostAuthPath } from '../../utils/authRedirect';
import RegisterForm from '../../components/auth/RegisterForm';
import type { RegisterFormData } from '../../components/auth/RegisterForm';
import logo from '../../assets/logo.png';
import SEO from '../../components/SEO'; // ✅ إضافة

const RegisterPage = () => {
  const { register: registerUser, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getPostAuthPath(user));
    }
  }, [isAuthenticated, user, navigate]);

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

  // 4 Badges - always visible on desktop
  const floatingItems = [
    { 
      icon: '🤝', 
      label: 'تبادل آمن', 
      left: '-3%',
      top: '-12px',
      color: '#28A745',
      delay: 0.1,
      hoverScale: 1.25,
      hoverRotate: -8,
    },
    { 
      icon: '🛡️', 
      label: 'تسجيل آمن', 
      left: '23%',
      top: '-28px',
      color: '#E87A20',
      delay: 0.15,
      hoverScale: 1.3,
      hoverRotate: 0,
    },
    { 
      icon: '✅', 
      label: 'هوية موثقة', 
      left: '49%',
      top: '-28px',
      color: '#17A2B8',
      delay: 0.2,
      hoverScale: 1.25,
      hoverRotate: 8,
    },
    { 
      icon: '👥', 
      label: 'مجتمع متكافل', 
      left: '75%',
      top: '-12px',
      color: '#8B5A2B',
      delay: 0.25,
      hoverScale: 1.25,
      hoverRotate: -8,
    },
  ];

  return (
    <>
      {/* ✅ إضافة SEO */}
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
          style={{
            width: '100%',
            maxWidth: '580px', // ✅ كما هو - واسع للتسجيل
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            boxShadow: '0 8px 32px var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            position: 'relative',
            overflow: 'visible',
          }}
        >
          {/* Logo & Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ 
              textAlign: 'center', 
              marginBottom: '0.5rem',
              position: 'relative',
            }}
          >
            {/* Logo Container */}
            <div
              style={{
                display: 'inline-block',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <Link to="/" style={{ display: 'inline-block' }}>
                <img
                  src={logo}
                  alt="بصمة"
                  style={{
                    height: '55px',
                    width: 'auto',
                    transition: 'transform 0.3s ease',
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </Link>

              {/* ===== DESKTOP: 4 Floating Badges ===== */}
              <div
                style={{
                  display: 'none', // Hidden by default, shown on desktop
                  position: 'absolute',
                  top: '-48px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '480px',
                  height: '60px',
                  pointerEvents: 'none',
                  zIndex: 30,
                }}
                className="desktop-badges"
              >
                {floatingItems.map((item, index) => {
                  const isHovered = hoveredIndex === index;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0, y: 15 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                          delay: item.delay,
                          type: 'spring',
                          stiffness: 200,
                          damping: 15,
                        },
                      }}
                      style={{
                        position: 'absolute',
                        top: item.top,
                        left: item.left,
                        transform: 'translateX(-50%)',
                        pointerEvents: 'auto',
                        cursor: 'default',
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <motion.div
                        animate={{
                          y: isHovered ? -12 : [0, -5, 0],
                          scale: isHovered ? item.hoverScale : 1,
                          rotate: isHovered ? item.hoverRotate : 0,
                          boxShadow: isHovered 
                            ? '0 12px 40px rgba(0,0,0,0.2)' 
                            : '0 8px 30px var(--shadow-md)',
                        }}
                        transition={{
                          y: isHovered 
                            ? { duration: 0.3 }
                            : { duration: 2.5 + index * 0.15, repeat: Infinity, ease: 'easeInOut', delay: index * 0.1 },
                          scale: { duration: 0.3, type: 'spring', stiffness: 300 },
                          rotate: { duration: 0.3 },
                          boxShadow: { duration: 0.3 },
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '5px 14px',
                          background: 'var(--bg-card)',
                          borderRadius: '16px',
                          border: `2px solid ${isHovered ? item.color : item.color + '35'}`,
                          boxShadow: '0 8px 30px var(--shadow-md)',
                          whiteSpace: 'nowrap',
                          pointerEvents: 'auto',
                          backdropFilter: 'blur(12px)',
                          transition: 'border-color 0.3s ease',
                        }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>{item.icon}</span>
                        <span
                          style={{
                            color: isHovered ? item.color : 'var(--text-secondary)',
                            fontSize: '0.7rem',
                            fontWeight: isHovered ? 800 : 700,
                            fontFamily: 'Cairo, sans-serif',
                            transition: 'color 0.3s ease, font-weight 0.3s ease',
                          }}
                        >
                          {item.label}
                        </span>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ===== MOBILE: Single Static Badge ===== */}
              <div
                style={{
                  display: 'block', // Shown by default, hidden on desktop
                  position: 'absolute',
                  top: '-38px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none',
                  zIndex: 30,
                }}
                className="mobile-badge"
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 14px',
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    border: '2px solid #E87A2035',
                    boxShadow: '0 4px 16px var(--shadow-md)',
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span style={{ fontSize: '0.85rem' }}>🛡️</span>
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

          {/* Register Form */}
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
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
              لديك حساب بالفعل؟{' '}
              <Link to="/login" style={{ color: 'var(--primary-orange)', textDecoration: 'none', fontWeight: 600 }}>
                تسجيل الدخول
              </Link>
            </p>
            <Link
              to="/forgot-password"
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                textDecoration: 'none',
                fontFamily: 'Cairo, sans-serif',
                opacity: 0.6,
                transition: 'opacity 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.color = 'var(--primary-orange)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.6';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              نسيت كلمة المرور؟
            </Link>
          </motion.div>
        </motion.div>

        {/* CSS for responsive display */}
        <style>{`
          /* Desktop: show 4 badges, hide mobile badge */
          @media (min-width: 768px) {
            .desktop-badges {
              display: block !important;
            }
            .mobile-badge {
              display: none !important;
            }
          }

          /* Mobile: show single badge, hide 4 badges */
          @media (max-width: 767px) {
            .desktop-badges {
              display: none !important;
            }
            .mobile-badge {
              display: block !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default RegisterPage;