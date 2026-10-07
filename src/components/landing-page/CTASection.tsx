import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaExchangeAlt,
  FaHandHoldingHeart,
  FaBullhorn,
  FaArrowLeft,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { getPostAuthPath } from '../../utils/authRedirect';
import { useCardBorderAnimation } from '../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../ui/AnimatedCardBorder';

const CTASection = () => {
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const authedLink = user ? getPostAuthPath(user) : '/dashboard';

  // ============================================
  // 3 pillars — one per branch
  // ============================================
  const pillars = [
    {
      Icon: FaExchangeAlt,
      title: 'تبادل الخدمات',
      description:
        'اعرض ما تجيده أو اطلب ما تحتاجه، وتواصل مباشرة مع أهالي منطقتك.',
      cta: 'تصفّح الخدمات',
      path: '/announcements',
      color: '#E87A20',
      colorLight: '#F5A623',
    },
    {
      Icon: FaHandHoldingHeart,
      title: 'صندوق بصمة',
      description:
        'تبرّع لحالة موثّقة، وكن جزءاً من إنجاز مجتمعي يوصل العطاء لمن يحتاجه.',
      cta: 'ادعم الآن',
      path: '/basma-fund',
      color: '#17A2B8',
      colorLight: '#20C9E0',
    },
    {
      Icon: FaBullhorn,
      title: 'منشورات المجتمع',
      description:
        'انشر تحذيراً، أعلن عن مفقود، أو شارك معلومة تحمي أهالي منطقتك.',
      cta: 'تصفّح المنشورات',
      path: '/community',
      color: '#9C27B0',
      colorLight: '#BA68C8',
    },
  ];

  return (
    <section
      style={{
        padding: '4.5rem 0 5rem',
        backgroundColor: isDark ? 'var(--bg-body)' : 'var(--bg-white)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        {/* ============================================ */}
        {/* Header */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
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
              marginBottom: '0.6rem',
            }}
          >
            {isAuthenticated ? 'تابع رحلتك في بصمة' : 'كن جزءاً من التغيير'}
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
              fontFamily: 'Cairo, sans-serif',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.9,
              textAlign: 'center',
            }}
          >
            {isAuthenticated
              ? 'استكشف الفروع الثلاثة وشارك في بناء مجتمع متكافل. كل خطوة تقوم بها تترك بصمة إيجابية في حياة الآخرين.'
              : 'انضم إلى مجتمع بصمة واختر الطريقة التي تريد أن تبدأ بها — تبادل خدمة، دعم محتاج، أو نشر وعي. بصمتك معنا تصنع الفرق.'}
          </p>
        </motion.div>

        {/* ============================================ */}
        {/* Pillars grid */}
        {/* ============================================ */}
        <Row className="g-4">
          {pillars.map((p, index) => (
            <Col key={p.title} xs={12} md={4}>
              <PillarCTA pillar={p} index={index} />
            </Col>
          ))}
        </Row>

        {/* ============================================ */}
        {/* Big CTA band */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            marginTop: '3rem',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px',
            background:
              'linear-gradient(135deg, #E87A20 0%, #D46A1A 50%, #8B5A2B 100%)',
            padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
            textAlign: 'center',
            boxShadow: '0 16px 48px rgba(232, 122, 32, 0.35)',
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.08)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: '-40px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '0.85rem',
                lineHeight: 1.35,
                textShadow: '0 2px 10px rgba(0,0,0,0.15)',
              }}
            >
              {isAuthenticated
                ? 'استكشف لوحة التحكم وتابع بصمتك'
                : 'انضم إلى مجتمع بصمة اليوم'}
            </h2>

            <p
              style={{
                color: 'rgba(255,255,255,0.95)',
                fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.85,
                maxWidth: '560px',
                margin: '0 auto 2rem',
                textAlign: 'center',
              }}
            >
              بصمة ليست مجرد منصة — إنها حركة مجتمعية نحو التكافل والتعاون.
              انضم إلينا، وشارك بجزء من وقتك أو مالك أو خبرتك، ولنبنِ معاً
              مجتمعاً يقف إلى جانب أفراده في السرّاء والضرّاء.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  as={Link as any}
                  to={isAuthenticated ? authedLink : '/register'}
                  className="rounded-pill fw-bold"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#FFFFFF',
                    color: '#E87A20',
                    padding: '13px 36px',
                    fontSize: '1rem',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 800,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isAuthenticated ? 'لوحة التحكم' : 'أنشئ حسابك مجاناً'}
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  as={Link as any}
                  to="/about"
                  className="rounded-pill fw-bold"
                  style={{
                    backgroundColor: 'transparent',
                    borderWidth: '2px',
                    borderColor: 'rgba(255,255,255,0.6)',
                    color: '#FFFFFF',
                    padding: '13px 32px',
                    fontSize: '1rem',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(255,255,255,0.15)';
                    e.currentTarget.style.borderColor = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.6)';
                  }}
                >
                  تعرّف على رسالتنا
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

// ============================================
// PillarCTA — with animated top border
// ============================================
interface PillarCTAProps {
  pillar: {
    Icon: React.ComponentType<{ size?: number }>;
    title: string;
    description: string;
    cta: string;
    path: string;
    color: string;
    colorLight: string;
  };
  index: number;
}

const PillarCTA = ({ pillar, index }: PillarCTAProps) => {
  const Icon = pillar.Icon;

  // ✅ Shared hook — hover + in-view
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.4,
    rootMargin: '-50px 0px',
    triggerOnce: true,
  });

  return (
    // ✅ OUTER: ref + hover handlers. NO motion.
    <div
      ref={attachRef}
      {...hoverHandlers}
      style={{ height: '100%' }}
    >
      {/* ✅ INNER: motion only. */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        style={{ height: '100%' }}
      >
        <div
          style={{
            height: '100%',
            padding: '1.75rem 1.5rem',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-card)',
            border: `1.5px solid ${
              isDrawn ? pillar.color : `${pillar.color}25`
            }`,
            boxShadow: isDrawn
              ? `0 12px 40px ${pillar.color}25`
              : '0 6px 24px var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            transition:
              'border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease',
            position: 'relative',
            overflow: 'hidden',
            transform: isDrawn ? 'translateY(-6px)' : 'translateY(0)',
            boxSizing: 'border-box',
          }}
        >
          {/* ✅ Animated top border */}
          <AnimatedCardBorder
            isDrawn={isDrawn}
            side="top"
            background={`linear-gradient(90deg, ${pillar.color}, ${pillar.colorLight})`}
            drawFrom="start"
            height={4}
            duration={0.7}
            idleOpacity={0}
            rounded
            cardRadius={20}
          />

          {/* Icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: `linear-gradient(135deg, ${pillar.color}, ${pillar.colorLight})`,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: `0 6px 18px ${pillar.color}35`,
              transition: 'transform 0.35s ease',
              transform: isDrawn ? 'scale(1.06)' : 'scale(1)',
            }}
          >
            <Icon size={26} />
          </div>

          <h3
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.2rem',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '0.65rem',
            }}
          >
            {pillar.title}
          </h3>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              fontFamily: 'Cairo, sans-serif',
              lineHeight: 1.85,
              marginBottom: '1.5rem',
              textAlign: 'center',
              flex: 1,
            }}
          >
            {pillar.description}
          </p>

          <Link
            to={pillar.path}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 22px',
              borderRadius: '30px',
              backgroundColor: 'transparent',
              border: `1.5px solid ${pillar.color}`,
              color: pillar.color,
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 800,
              textDecoration: 'none',
              transition: 'all 0.25s ease',
              alignSelf: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = pillar.color;
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 20px ${pillar.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = pillar.color;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {pillar.cta}
            <FaArrowLeft size={11} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CTASection;