import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaBullhorn, FaWhatsapp, FaSearch, FaHandshake, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

const HowItWorksSection = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'offer' | 'request'>('offer');

  const flows = {
    offer: {
      id: 'offer',
      title: 'لديّ خدمة أو سلعة',
      color: '#E87A20',
      badgeText: 'تريد تقديم مساعدة أو تبادل عرض؟',
      ctaText: 'ابدأ نشر إعلانك الآن',
      ctaLink: '/register',
      steps: [
        {
          icon: <FaUserPlus size={18} />,
          title: 'سجل حسابك',
          desc: 'أنشئ حساباً مجانياً خلال ثوانٍ معدودة بريدك الإلكتروني.',
        },
        {
          icon: <FaBullhorn size={18} />,
          title: 'انشر إعلانك',
          desc: 'أضف تفاصيل السلعة أو الخدمة التي تقدمها مع الصور.',
        },
        {
          icon: <FaWhatsapp size={18} />,
          title: 'تواصل مع المهتمين',
          desc: 'استقبل طلبات الراغبين وتواصل معهم مباشرة عبر واتساب.',
        },
        {
          icon: <FaHandshake size={18} />,
          title: 'أتم الصفقة',
          desc: 'التق بالطرف الآخر وأتم عملية التبادل بكل سهولة ومحبة.',
        },
      ],
    },
    request: {
      id: 'request',
      title: 'أبحث عن خدمة أو سلعة',
      color: '#A06533', // Enhanced richer warm bronze/mocha tone
      badgeText: 'تحتاج إلى مساعدة أو تبحث عن شيء محدد؟',
      ctaText: 'تصفح الإعلانات الآن',
      ctaLink: '/announcements',
      steps: [
        {
          icon: <FaUserPlus size={18} />,
          title: 'سجل حسابك',
          desc: 'أنشئ حساباً مجانياً للوصول الكامل لجميع الإعلانات والتفاصيل.',
        },
        {
          icon: <FaSearch size={18} />,
          title: 'ابحث عن حاجتك',
          desc: 'تصفح الأقسام أو استخدم محرك البحث للعثور على ما تريده بدقة.',
        },
        {
          icon: <FaWhatsapp size={18} />,
          title: 'تواصل مع المعلن',
          desc: 'اطلع على رقم واتساب الخاص بالمعلن وتواصل معه مباشرة.',
        },
        {
          icon: <FaCheckCircle size={18} />,
          title: 'احصل على طلبك',
          desc: 'التق بالمعلن واحصل على ما تحتاج إليه بروح التكافل.',
        },
      ],
    },
  };

  const currentFlow = flows[activeTab];

  return (
    <section
      style={{
        padding: '4rem 0',
        backgroundColor: 'var(--bg-white)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <div
            style={{
              width: '60px',
              height: '4px',
              backgroundColor: '#E87A20',
              borderRadius: '2px',
              margin: '0 auto 1.25rem',
            }}
          />
          <h2
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '0.4rem',
            }}
          >
            كيف تعمل المنصة؟
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
              fontFamily: 'Cairo, sans-serif',
              maxWidth: '500px',
              margin: '0 auto',
              padding: '0 1rem',
            }}
          >
            خطوات بسيطة وواضحة لبدء رحلتك معنا بكل سهولة
          </p>
        </motion.div>

        {/* Interactive Role Switcher Tabs */}
        <div
          className="how-it-works-tabs"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '2.5rem',
            padding: '0 0.5rem',
          }}
        >
          {(['offer', 'request'] as const).map((tabKey) => {
            const flow = flows[tabKey];
            const isActive = activeTab === tabKey;
            return (
              <motion.button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  backgroundColor: isActive ? flow.color : 'var(--bg-card)',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: `2px solid ${isActive ? flow.color : 'var(--border-color)'}`,
                  padding: '10px 20px',
                  borderRadius: '30px',
                  fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                  fontWeight: 800,
                  fontFamily: 'Cairo, sans-serif',
                  cursor: 'pointer',
                  boxShadow: isActive ? `0 6px 20px ${flow.color}40` : 'none',
                  transition: 'all 0.3s ease',
                  flex: '0 1 auto',
                  whiteSpace: 'nowrap',
                }}
              >
                {flow.title}
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Flow Content View with Smooth Animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ maxWidth: '900px', margin: '0 auto' }}
          >
            <div
              className="how-it-works-main-card"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '24px',
                padding: '2.5rem 1.75rem',
                border: `2px solid ${currentFlow.color}30`,
                boxShadow: isDark
                  ? '0 12px 40px var(--shadow-md)'
                  : '0 12px 40px var(--shadow-sm)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative Background Accent */}
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: `${currentFlow.color}10`,
                  pointerEvents: 'none',
                }}
              />

              {/* Sub-header inside card */}
              <div className="text-center mb-4">
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: `${currentFlow.color}15`,
                    color: currentFlow.color,
                    padding: '5px 16px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    marginBottom: '8px',
                  }}
                >
                  {currentFlow.badgeText}
                </span>
                <h3
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  رحلتك كـ "{currentFlow.title}"
                </h3>
              </div>

              {/* ========================================== */}
              {/* DESKTOP VIEW: 4-Column Row Grid */}
              {/* ========================================== */}
              <Row className="g-4 position-relative d-none d-md-flex">
                {currentFlow.steps.map((step, index) => (
                  <Col key={index} md={6} lg={3}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.4 }}
                      whileHover={{ 
                        y: -6, 
                        boxShadow: `0 10px 25px ${currentFlow.color}20`,
                        transition: { duration: 0.2 } 
                      }}
                      style={{
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.02)'
                          : `${currentFlow.color}04`,
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : `${currentFlow.color}18`}`,
                        borderRadius: '20px',
                        padding: '1.75rem 1.25rem',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        position: 'relative',
                      }}
                    >
                      {/* Step Number Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: `${currentFlow.color}15`,
                          color: currentFlow.color,
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        0{index + 1}
                      </div>

                      {/* Icon Circle */}
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '50%',
                          backgroundColor: `${currentFlow.color}15`,
                          border: `2px solid ${currentFlow.color}35`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: currentFlow.color,
                          marginBottom: '1rem',
                        }}
                      >
                        {step.icon}
                      </motion.div>

                      {/* Step Title */}
                      <h4
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '1rem',
                          fontWeight: 800,
                          fontFamily: 'Cairo, sans-serif',
                          marginBottom: '0.5rem',
                          minHeight: '2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {step.title}
                      </h4>

                      {/* Step Description */}
                      <p
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.81rem',
                          fontFamily: 'Cairo, sans-serif',
                          lineHeight: 1.6,
                          margin: 0,
                          minHeight: '4.2rem',
                        }}
                      >
                        {step.desc}
                      </p>
                    </motion.div>
                  </Col>
                ))}
              </Row>

              {/* ========================================== */}
              {/* MOBILE VIEW: Specialized Clean Vertical Chain Timeline */}
              {/* ========================================== */}
              <div className="d-md-none position-relative" style={{ padding: '0.5rem 0' }}>
                {currentFlow.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      position: 'relative',
                      marginBottom: index === currentFlow.steps.length - 1 ? '0' : '1.25rem',
                    }}
                  >
                    {/* Vertical Connecting Dotted/Solid Line behind icons */}
                    {index !== currentFlow.steps.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          right: '20px',
                          top: '44px',
                          bottom: '-20px',
                          width: '2px',
                          backgroundColor: `${currentFlow.color}30`,
                          zIndex: 1,
                        }}
                      />
                    )}

                    {/* Step Icon & Number Indicator */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: `${currentFlow.color}15`,
                        border: `2px solid ${currentFlow.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: currentFlow.color,
                        flexShrink: 0,
                        boxShadow: `0 4px 12px ${currentFlow.color}15`,
                      }}
                    >
                      {step.icon}
                    </div>

                    {/* Content Card Box */}
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.025)'
                          : `${currentFlow.color}05`,
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : `${currentFlow.color}20`}`,
                        borderRadius: '16px',
                        padding: '14px 16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        position: 'relative',
                      }}
                    >
                      {/* Step Number Tag inside card top-left */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          color: currentFlow.color,
                          backgroundColor: `${currentFlow.color}12`,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        الخطوة 0{index + 1}
                      </span>

                      <h4
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          fontFamily: 'Cairo, sans-serif',
                          marginBottom: '4px',
                          marginTop: '2px',
                        }}
                      >
                        {step.title}
                      </h4>
                      <p
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.79rem',
                          fontFamily: 'Cairo, sans-serif',
                          lineHeight: 1.5,
                          margin: 0,
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action Footer inside card */}
              <div
                style={{
                  marginTop: '2rem',
                  paddingTop: '1.25rem',
                  borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : `${currentFlow.color}15`}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  جاهز للخطوة الأولى؟ انضم لمجتمع بصمة الآن.
                </span>

                <motion.div 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  <Link
                    to={currentFlow.ctaLink}
                    style={{
                      backgroundColor: currentFlow.color,
                      color: '#FFFFFF',
                      padding: '11px 28px',
                      borderRadius: '30px',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      fontFamily: 'Cairo, sans-serif',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: `0 4px 16px ${currentFlow.color}40`,
                      width: '100%',
                      maxWidth: '280px',
                    }}
                  >
                    {currentFlow.ctaText}
                    <FaArrowLeft size={12} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
};

export default HowItWorksSection;