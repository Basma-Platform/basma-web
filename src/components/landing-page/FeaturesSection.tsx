import { Container, Row, Col } from 'react-bootstrap';
import {
  FaExchangeAlt,
  FaHandHoldingHeart,
  FaBullhorn,
  FaHandshake,
  FaShieldAlt,
  FaUsers,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useCardBorderAnimation } from '../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../ui/AnimatedCardBorder';

const FeaturesSection = () => {
  const { isDark } = useTheme();

  // ============================================
  // Three pillars
  // ============================================
  const pillars = [
    {
      Icon: FaExchangeAlt,
      title: 'تبادل الخدمات',
      accent: '#E87A20',
      accentSoft: 'rgba(232, 122, 32, 0.10)',
      short: 'أنشئ عرضاً أو طلباً في دقائق',
      description:
        'منصة تتيح لأهل غزة نشر عروضهم وطلباتهم للخدمات والسلع بحرية. اعرض ما تجيده، أو ابحث عمّا تحتاجه، وتواصل مباشرة مع الطرف الآخر عبر واتساب. تبادل، بيع، أو مقايضة — كل ذلك في مكان واحد موثوق.',
      features: [
        'عروض وطلبات غير محدودة',
        'مقايضة و مدفوع',
        'تواصل مباشر عبر واتساب',
      ],
    },
    {
      Icon: FaHandHoldingHeart,
      title: 'صندوق بصمة',
      accent: '#17A2B8',
      accentSoft: 'rgba(23, 162, 184, 0.10)',
      short: 'تبرّع، ساند، وابنِ الأمل',
      description:
        'صندوق خيري مجتمعي يجمع طلبات المساعدة الحقيقية في مكان واحد، ويتيح للمتبرعين الوصول إليها بسهولة وأمان. كل حالة موثّقة، وكل تبرّع يُترجم إلى إنجاز ملموس يوثّق أثرك في حياة الآخرين.',
      features: [
        'طلبات مساعدة موثّقة',
        'حماية خصوصية المتقدمين',
        'توثيق الإنجازات',
      ],
    },
    {
      Icon: FaBullhorn,
      title: 'منشورات المجتمع',
      accent: '#9C27B0',
      accentSoft: 'rgba(156, 39, 176, 0.10)',
      short: 'انشر، حذّر، وساهم في الحماية',
      description:
        'مساحة مجتمعية للتوعية والتنبيه: تحذيرات أمنية، منشورات مفقود/موجود، وإعلانات عامة تفيد المجتمع. كل منشور يُراجع قبل النشر لضمان المصداقية، وتصبح أنت جزءاً من شبكة حماية اجتماعية لمدينتك.',
      features: [
        'تحذيرات أمنية موثوقة',
        'مفقود وموجود',
        'محتوى مراجَع قبل النشر',
      ],
    },
  ];

  return (
    <section
      style={{
        padding: '4.5rem 0',
        backgroundColor: 'var(--bg-white)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        {/* ============================================ */}
        {/* Section header */}
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
              marginBottom: '1rem',
            }}
          >
            ثلاثة أعمدة، هدف واحد
          </h2>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
              fontFamily: 'Cairo, sans-serif',
              maxWidth: '680px',
              margin: '0 auto 0.9rem',
              lineHeight: 1.9,
              textAlign: 'center',
            }}
          >
            بنينا بصمة على ثلاث ركائز متكاملة، كل واحدة تكمل الأخرى في طريق
            بناء مجتمع متكافل ومترابط. تبادل الخدمات يعزّز التعاون، صندوق بصمة
            يحقق العطاء، ومنشورات المجتمع تنشر الوعي.
          </p>

          <p
            style={{
              color: '#E87A20',
              fontSize: 'clamp(1.05rem, 1.4vw, 1.2rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              margin: 0,
              lineHeight: 1.6,
              letterSpacing: '0.2px',
            }}
          >
            ومعاً نصنع مجتمعاً أقوى.
          </p>
        </motion.div>

        {/* ============================================ */}
        {/* Three pillars grid */}
        {/* ============================================ */}
        <Row className="g-4">
          {pillars.map((pillar, index) => (
            <Col key={pillar.title} xs={12} lg={4}>
              <PillarCard pillar={pillar} index={index} isDark={isDark} />
            </Col>
          ))}
        </Row>

        {/* ============================================ */}
        {/* Bottom trust badges */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            marginTop: '3rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          {[
            {
              icon: <FaHandshake size={14} color="#E87A20" />,
              label: 'مجتمع متعاون',
            },
            {
              icon: <FaShieldAlt size={14} color="#17A2B8" />,
              label: 'بيئة آمنة وموثوقة',
            },
            {
              icon: <FaUsers size={14} color="#9C27B0" />,
              label: 'مجتمع متكافل',
            },
          ].map((badge, i) => (
            <div
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '30px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                boxShadow: '0 2px 8px var(--shadow-sm)',
              }}
            >
              {badge.icon}
              {badge.label}
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

// ============================================
// PillarCard — shared hook + AnimatedCardBorder
// ============================================
interface PillarCardProps {
  pillar: {
    Icon: React.ComponentType<{ size?: number }>;
    title: string;
    accent: string;
    accentSoft: string;
    short: string;
    description: string;
    features: string[];
  };
  index: number;
  isDark: boolean;
}

const PillarCard = ({ pillar, index, isDark }: PillarCardProps) => {
  const Icon = pillar.Icon;

  // ✅ Shared hook — hover (desktop) + in-view (touch)
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
            padding: '2rem 1.75rem',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-card)',
            border: `1.5px solid ${
              isDrawn ? pillar.accent : `${pillar.accent}25`
            }`,
            boxShadow: isDrawn
              ? `0 12px 40px ${pillar.accent}25`
              : isDark
                ? '0 6px 24px var(--shadow-sm)'
                : '0 6px 24px rgba(0, 0, 0, 0.04)',
            transition:
              'border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease',
            display: 'flex',
            flexDirection: 'column',
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
            background={`linear-gradient(90deg, ${pillar.accent}, ${pillar.accent}90)`}
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
              background: pillar.accentSoft,
              color: pillar.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: `0 4px 14px ${pillar.accent}20`,
              transition: 'transform 0.35s ease',
              transform: isDrawn ? 'scale(1.06)' : 'scale(1)',
            }}
          >
            <Icon size={28} />
          </div>

          <h3
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.3rem',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '0.35rem',
              lineHeight: 1.25,
            }}
          >
            {pillar.title}
          </h3>

          <p
            style={{
              color: pillar.accent,
              fontSize: '0.85rem',
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '1rem',
              opacity: 0.9,
            }}
          >
            {pillar.short}
          </p>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              fontFamily: 'Cairo, sans-serif',
              lineHeight: 1.9,
              marginBottom: '1.25rem',
              textAlign: 'justify',
              textJustify: 'inter-word',
              flex: 1,
            }}
          >
            {pillar.description}
          </p>

          {/* Mini features list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              paddingTop: '1rem',
              borderTop: `1px dashed ${pillar.accent}30`,
            }}
          >
            {pillar.features.map((f) => (
              <div
                key={f}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  fontFamily: 'Cairo, sans-serif',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: pillar.accent,
                    flexShrink: 0,
                  }}
                />
                {f}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturesSection;