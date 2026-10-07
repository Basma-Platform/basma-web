import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  FaUserPlus,
  FaBullhorn,
  FaWhatsapp,
  FaHandshake,
  FaCheckCircle,
  FaArrowLeft,
  FaHandHoldingHeart,
  FaCamera,
  FaClock,
  FaUsers,
  FaEye,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

// ============================================
// Three pillars — three flows
// ============================================
type PillarKey = 'exchange' | 'fund' | 'community';

const HowItWorksSection = () => {
  const { isDark } = useTheme();
  const [activePillar, setActivePillar] = useState<PillarKey>('exchange');

  // ============================================
  // PILLAR 1 — تبادل الخدمات
  // ============================================
  const exchangeFlow = {
    id: 'exchange',
    title: 'تبادل الخدمات',
    tagline: 'اعرض ما تجيده، واطلب ما تحتاجه',
    color: '#E87A20',
    colorLight: '#F5A623',
    gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
    badgeText: 'تبادل، بيع، أو مقايضة — كل شيء في مكان واحد',
    ctaText: 'ابدأ التبادل الآن',
    ctaLink: '/announcements',
    steps: [
      {
        icon: <FaUserPlus size={18} />,
        title: 'سجّل حسابك',
        desc: 'أنشئ حسابك المجاني خلال دقيقة واحدة، ووثّق هويتك للحصول على مميزات إضافية.',
      },
      {
        icon: <FaBullhorn size={18} />,
        title: 'انشر عرضك أو طلبك',
        desc: 'أضف تفاصيل ما تقدّمه أو تبحث عنه مع الصور، وحدّد السعر أو نوع المقايضة.',
      },
      {
        icon: <FaWhatsapp size={18} />,
        title: 'تواصل وتفاوض',
        desc: 'تواصل مباشرة مع الطرف الآخر عبر واتساب، وناقش التفاصيل بكل سهولة.',
      },
      {
        icon: <FaHandshake size={18} />,
        title: 'أتمّ التبادل',
        desc: 'التقيا في مكان آمن، أتمّا التبادل، وأضِفا تقييماً لبناء الثقة داخل المجتمع.',
      },
    ],
  };

  // ============================================
  // PILLAR 2 — صندوق بصمة
  // ============================================
  const fundFlow = {
    id: 'fund',
    title: 'صندوق بصمة',
    tagline: 'تبرّع، ساند، وابنِ الأمل',
    color: '#17A2B8',
    colorLight: '#20C9E0',
    gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
    badgeText: 'كل تبرّع، بغض النظر عن حجمه، يصنع فرقاً حقيقياً',
    ctaText: 'اكتشف صندوق بصمة',
    ctaLink: '/basma-fund',
    steps: [
      {
        icon: <FaEye size={18} />,
        title: 'تصفّح طلبات المساعدة',
        desc: 'استعرض الحالات الموثّقة التي تحتاج دعماً، واحصل على تفاصيل كافية دون كشف خصوصية المتقدمين.',
      },
      {
        icon: <FaHandHoldingHeart size={18} />,
        title: 'اختر الحالة التي تلمس قلبك',
        desc: 'شاهد الفيديو التعريفي، واقرأ عن حاجة كل شخص — لتتأكد أن تبرّعك سيصل إلى مستحقّه.',
      },
      {
        icon: <FaWhatsapp size={18} />,
        title: 'تواصل مع فريق بصمة',
        desc: 'تواصل مباشرة مع فريقنا عبر واتساب للتحقق من الحالة والتنسيق بشأن مساهمتك.',
      },
      {
        icon: <FaCheckCircle size={18} />,
        title: 'وثّق إنجازك',
        desc: 'نوثّق كل عملية مساعدة كإنجاز مجتمعي، لتبقى بصمتك حاضرة ويُلهم عطاؤك الآخرين.',
      },
    ],
  };

  // ============================================
  // PILLAR 3 — منشورات المجتمع
  // ============================================
  const communityFlow = {
    id: 'community',
    title: 'منشورات المجتمع',
    tagline: 'انشر، حذّر، وساهم في الحماية',
    color: '#9C27B0',
    colorLight: '#BA68C8',
    gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
    badgeText: 'صوتك قد ينقذ شخصاً — شارك ما يهم مجتمعك',
    ctaText: 'تصفّح منشورات المجتمع',
    ctaLink: '/community',
    steps: [
      {
        icon: <FaUserPlus size={18} />,
        title: 'سجّل حسابك ووثّقه',
        desc: 'التوثيق متطلب للنشر، لضمان مصداقية المحتوى وحماية المجتمع من الأخبار الكاذبة.',
      },
      {
        icon: <FaCamera size={18} />,
        title: 'اختر نوع المنشور',
        desc: 'تحذير أمني، منشور مفقود أو موجود، أو إعلان عام يخدم أهالي منطقتك.',
      },
      {
        icon: <FaClock size={18} />,
        title: 'مراجعة سريعة',
        desc: 'يراجع فريقنا المنشور خلال ساعات قليلة، للتأكد من صحته وتوافقه مع قيم المجتمع.',
      },
      {
        icon: <FaUsers size={18} />,
        title: 'يصل إلى مجتمعك',
        desc: 'ينتشر منشورك لأهالي منطقتك، ويصبح جزءاً من شبكة حماية اجتماعية ترعاها بصمة.',
      },
    ],
  };

  const flows: Record<PillarKey, typeof exchangeFlow> = {
    exchange: exchangeFlow,
    fund: fundFlow,
    community: communityFlow,
  };

  const currentFlow = flows[activePillar];

  return (
    <section
      style={{
        padding: '4.5rem 0',
        backgroundColor: 'var(--bg-white)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '0.5rem',
            }}
          >
            كيف تعمل بصمة؟
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
              fontFamily: 'Cairo, sans-serif',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.8,
              textAlign: 'center',
            }}
          >
            اختر الفرع الذي يهمك، وتعرّف على خطوات بسيطة تصل بك إلى هدفك في
            دقائق معدودة. بصمة معك في كل خطوة.
          </p>
        </motion.div>

        {/* Pillar switcher tabs */}
        <div
          className="how-it-works-tabs"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '2.5rem',
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
            padding: '6px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
          }}
        >
          {(Object.keys(flows) as PillarKey[]).map((key) => {
            const flow = flows[key];
            const isActive = activePillar === key;
            return (
              <motion.button
                key={key}
                onClick={() => setActivePillar(key)}
                whileTap={{ scale: 0.97 }}
                style={{
                  position: 'relative',
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? flow.color : 'var(--text-muted)',
                  border: 'none',
                  padding: '12px 10px',
                  borderRadius: '12px',
                  fontSize: 'clamp(0.75rem, 1.6vw, 0.92rem)',
                  fontWeight: 800,
                  fontFamily: 'Cairo, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? '0 4px 16px var(--shadow-sm)' : 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {flow.title}
                {isActive && (
                  <motion.div
                    layoutId="how-active-tab"
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '20%',
                      left: '20%',
                      height: '3px',
                      borderRadius: '3px',
                      backgroundColor: flow.color,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Flow content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar}
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ maxWidth: '960px', margin: '0 auto' }}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '24px',
                padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.75rem)',
                border: `2px solid ${currentFlow.color}30`,
                boxShadow: isDark
                  ? '0 12px 40px var(--shadow-md)'
                  : '0 12px 40px var(--shadow-sm)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative glow */}
              <div
                style={{
                  position: 'absolute',
                  top: -60,
                  right: -60,
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  backgroundColor: `${currentFlow.color}10`,
                  pointerEvents: 'none',
                }}
              />

              {/* Card subheader */}
              <div className="text-center mb-4 position-relative">
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: `${currentFlow.color}15`,
                    color: currentFlow.color,
                    padding: '6px 18px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    marginBottom: '10px',
                  }}
                >
                  {currentFlow.badgeText}
                </span>
                <h3
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  {currentFlow.tagline}
                </h3>
              </div>

              {/* Desktop — 4-col grid */}
              <Row className="g-3 position-relative d-none d-md-flex">
                {currentFlow.steps.map((step, index) => (
                  <Col key={index} md={6} lg={3}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.4 }}
                      whileHover={{
                        y: -6,
                        boxShadow: `0 10px 25px ${currentFlow.color}20`,
                        transition: { duration: 0.2 },
                      }}
                      style={{
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.02)'
                          : `${currentFlow.color}04`,
                        border: `1px solid ${
                          isDark
                            ? 'rgba(255,255,255,0.05)'
                            : `${currentFlow.color}18`
                        }`,
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
                      {/* Step number badge */}
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

                      {/* Icon circle */}
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

                      <p
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.8rem',
                          fontFamily: 'Cairo, sans-serif',
                          lineHeight: 1.7,
                          margin: 0,
                          textAlign: 'justify',
                          textJustify: 'inter-word',
                          minHeight: '4.5rem',
                        }}
                      >
                        {step.desc}
                      </p>
                    </motion.div>
                  </Col>
                ))}
              </Row>

              {/* Mobile — vertical chain */}
              <div
                className="d-md-none position-relative"
                style={{ padding: '0.5rem 0' }}
              >
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
                      marginBottom:
                        index === currentFlow.steps.length - 1
                          ? '0'
                          : '1.25rem',
                    }}
                  >
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
                      }}
                    >
                      {step.icon}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.025)'
                          : `${currentFlow.color}05`,
                        border: `1px solid ${
                          isDark
                            ? 'rgba(255,255,255,0.06)'
                            : `${currentFlow.color}20`
                        }`,
                        borderRadius: '16px',
                        padding: '14px 16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        position: 'relative',
                      }}
                    >
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
                          lineHeight: 1.6,
                          margin: 0,
                          textAlign: 'justify',
                          textJustify: 'inter-word',
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA inside card */}
              <div
                style={{
                  marginTop: '2rem',
                  paddingTop: '1.25rem',
                  borderTop: `1px solid ${
                    isDark
                      ? 'rgba(255,255,255,0.06)'
                      : `${currentFlow.color}15`
                  }`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                    fontFamily: 'Cairo, sans-serif',
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  جاهز لتكون جزءاً من التغيير؟ ابدأ الآن وشارك في بناء مجتمع
                  متكافل.
                </p>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ width: '100%', maxWidth: '320px' }}
                >
                  <Link
                    to={currentFlow.ctaLink}
                    style={{
                      backgroundColor: currentFlow.color,
                      color: '#FFFFFF',
                      padding: '13px 28px',
                      borderRadius: '30px',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      fontFamily: 'Cairo, sans-serif',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: `0 4px 16px ${currentFlow.color}40`,
                      width: '100%',
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