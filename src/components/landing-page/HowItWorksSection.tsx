import { Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaBullhorn, FaWhatsapp, FaSearch, FaHandshake, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const HowItWorksSection = () => {
  const { isDark } = useTheme();

  const flows = [
    {
      id: 'offer',
      title: 'لديّ خدمة أو سلعة',
      color: '#E87A20',
      steps: [
        {
          icon: <FaUserPlus size={24} />,
          title: 'سجل حسابك',
          desc: 'أنشئ حساب مجاني باستخدام بريدك الإلكتروني',
        },
        {
          icon: <FaBullhorn size={24} />,
          title: 'انشر إعلانك',
          desc: 'أضف تفاصيل السلعة أو الخدمة التي تقدمها',
        },
        {
          icon: <FaWhatsapp size={24} />,
          title: 'تواصل مع المهتمين',
          desc: 'استقبل طلبات المهتمين وتواصل عبر واتساب',
        },
        {
          icon: <FaHandshake size={24} />,
          title: 'أتم الصفقة',
          desc: 'التق بالطرف الآخر وأتم عملية التبادل',
        },
      ],
    },
    {
      id: 'request',
      title: 'أبحث عن خدمة أو سلعة',
      color: '#8B5A2B',
      steps: [
        {
          icon: <FaUserPlus size={24} />,
          title: 'سجل حسابك',
          desc: 'أنشئ حساب مجاني للوصول إلى جميع الإعلانات',
        },
        {
          icon: <FaSearch size={24} />,
          title: 'ابحث عن حاجتك',
          desc: 'تصفح الإعلانات أو استخدم البحث للعثور على ما تريد',
        },
        {
          icon: <FaWhatsapp size={24} />,
          title: 'تواصل مع المعلن',
          desc: 'اطلع على رقم واتساب المعلن وتواصل معه مباشرة',
        },
        {
          icon: <FaCheckCircle size={24} />,
          title: 'أتم الصفقة',
          desc: 'التق بالطرف الآخر واحصل على ما تريد',
        },
      ],
    },
  ];

  // ✅ Animation variants with proper easing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeInOut' as const },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
  };

  return (
    <section
      style={{
        padding: '5rem 0',
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
          className="text-center mb-5"
        >
          <div
            style={{
              width: '60px',
              height: '4px',
              backgroundColor: '#E87A20',
              borderRadius: '2px',
              margin: '0 auto 1.5rem',
            }}
          />
          <h2
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(2rem, 3vw, 2.8rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '0.5rem',
            }}
          >
            كيف تعمل المنصة؟
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '1.1rem',
              fontFamily: 'Cairo, sans-serif',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            اختر المسار المناسب لك وابدأ رحلتك في دقائق
          </p>
        </motion.div>

        {/* Two Flows */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Row className="g-4">
            {flows.map((flow) => (
              <Col key={flow.id} xs={12} md={6}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '24px',
                    padding: '2.5rem 2rem',
                    height: '100%',
                    border: `2px solid ${flow.color}20`,
                    boxShadow: isDark
                      ? '0 8px 32px var(--shadow-md)'
                      : '0 8px 32px var(--shadow-sm)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative Dot Pattern */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -40,
                      right: -40,
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      backgroundColor: `${flow.color}08`,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Flow Title */}
                  <div className="text-center mb-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      style={{
                        display: 'inline-block',
                        backgroundColor: flow.color,
                        color: '#FFFFFF',
                        padding: '8px 28px',
                        borderRadius: '30px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        fontFamily: 'Cairo, sans-serif',
                        boxShadow: `0 4px 16px ${flow.color}40`,
                      }}
                    >
                      {flow.title}
                    </motion.div>
                  </div>

                  {/* Steps */}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {flow.steps.map((step, stepIndex) => (
                      <motion.div
                        key={stepIndex}
                        variants={stepVariants}
                        custom={stepIndex}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          marginBottom: '1.5rem',
                          padding: '12px 16px',
                          borderRadius: '14px',
                          backgroundColor: isDark
                            ? 'rgba(255,255,255,0.03)'
                            : 'rgba(139,90,43,0.03)',
                          transition: 'all 0.3s ease',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(139,90,43,0.04)'}`,
                        }}
                        whileHover={{
                          backgroundColor: isDark
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(139,90,43,0.06)',
                          x: 6,
                        }}
                      >
                        {/* Step Number Circle */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          style={{
                            minWidth: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: `${flow.color}15`,
                            border: `2px solid ${flow.color}30`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: flow.color,
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            fontFamily: 'Cairo, sans-serif',
                            flexShrink: 0,
                          }}
                        >
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + stepIndex * 0.1 }}
                          >
                            {stepIndex + 1}
                          </motion.span>
                        </motion.div>

                        {/* Icon + Content */}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              marginBottom: '2px',
                            }}
                          >
                            <span style={{ color: flow.color, fontSize: '1.1rem' }}>
                              {step.icon}
                            </span>
                            <span
                              style={{
                                color: 'var(--text-secondary)',
                                fontSize: '1rem',
                                fontWeight: 700,
                                fontFamily: 'Cairo, sans-serif',
                              }}
                            >
                              {step.title}
                            </span>
                          </div>
                          <p
                            style={{
                              color: 'var(--text-muted)',
                              fontSize: '0.85rem',
                              marginRight: '2.5rem',
                              marginBottom: 0,
                              fontFamily: 'Cairo, sans-serif',
                              lineHeight: 1.5,
                            }}
                          >
                            {step.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Flow Footer */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={{
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(139,90,43,0.06)'}`,
                      textAlign: 'center',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        fontFamily: 'Cairo, sans-serif',
                        opacity: 0.6,
                      }}
                    >
                      {flow.id === 'offer'
                        ? 'ابدأ الآن وانشر إعلانك مجاناً'
                        : 'ابحث عن حاجتك وتواصل مع المعلنين'}
                    </span>
                  </motion.div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;