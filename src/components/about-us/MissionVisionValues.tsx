import { Container, Row, Col } from 'react-bootstrap';
import {
  FaBullseye,
  FaEye,
  FaGem,
  FaHandshake,
  FaHeart,
  FaShieldAlt,
  FaStar,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useCardBorderAnimation } from '../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../ui/AnimatedCardBorder';

const MissionVisionValues = () => {
  const { isDark } = useTheme();

  const items = [
    {
      icon: <FaBullseye size={26} color="#FFFFFF" />,
      title: 'رسالتنا',
      short: 'التكافل الاجتماعي عبر التقنية',
      accent: '#E87A20',
      accentLight: '#F5A623',
      badge: 'لماذا وُجدنا',
      description:
        'أن نمنح أهل غزة منصة رقمية موثوقة تجمع ثلاث ركائز في مكان واحد: تبادل الخدمات بين الأفراد، ودعم المحتاجين عبر صندوق بصمة، ونشر الوعي المجتمعي من خلال منشورات المجتمع. نريد أن يتحوّل التكافل من شعار إلى فعل يومي ملموس، وأن يجد كل فرد في مجتمعه يداً تسانده وقت الحاجة، وشريكاً يشاركه العطاء وقت القدرة.',
    },
    {
      icon: <FaEye size={26} color="#FFFFFF" />,
      title: 'رؤيتنا',
      short: 'مجتمع متكافل ومترابط',
      accent: '#17A2B8',
      accentLight: '#20C9E0',
      badge: 'إلى أين نتجه',
      description:
        'أن نرى مجتمعاً فلسطينياً متماسكاً، تتحوّل فيه قيم التكافل والتعاون إلى سلوك يومي وتقنية راسخة، فيصبح كل فرد قادراً على العطاء والتأثير دون انتظار، ويجد فيه كل محتاج يداً ممدودة دون حاجة إلى سؤال. نطمح إلى أن تكون بصمة شبكة أمان اجتماعي تنمو وتتوسّع، حتى تصبح نموذجاً يحتذى به لكل مجتمع يؤمن بقوة التعاون.',
    },
    {
      icon: <FaGem size={26} color="#FFFFFF" />,
      title: 'قيمنا',
      short: 'الثقة، التكافل، والشفافية',
      accent: '#9C27B0',
      accentLight: '#BA68C8',
      badge: 'ما نؤمن به',
      description:
        'نؤمن بأن المجتمعات تُبنى على قيم راسخة لا تتغيّر: الثقة المتبادلة بين المستخدمين، والتكافل الفعلي بدل الشعارات، والشفافية في كل تعامل ومعلومة، والأمان الذي يحمي المستخدمين وبياناتهم، والاحترام الذي يجعل كل صوت مسموعاً ومُقدَّراً. هذه القيم ليست مجرد شعارات، بل مبادئ تُترجم إلى قرارات يومية وسمات في كل ميزة نبنيها.',
    },
  ];

  const subValues = [
    {
      icon: <FaHandshake size={14} color="#E87A20" />,
      label: 'التعاون',
      color: '#E87A20',
    },
    {
      icon: <FaHeart size={14} color="#17A2B8" />,
      label: 'العطاء',
      color: '#17A2B8',
    },
    {
      icon: <FaShieldAlt size={14} color="#9C27B0" />,
      label: 'الثقة',
      color: '#9C27B0',
    },
  ];

  return (
    <section
      style={{
        padding: '4.5rem 0 5rem',
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
              lineHeight: 1.25,
            }}
          >
            ما الذي يحركنا؟
          </h2>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
              fontFamily: 'Cairo, sans-serif',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.9,
              textAlign: 'center',
            }}
          >
            ثلاثة مبادئ تقف وراء كل قرار نتخذه وكل ميزة نبنيها — رسالة تُوجّهنا،
            رؤية تُلهمنا، وقيم تُعرّف من نحن.
          </p>
        </motion.div>

        {/* ============================================ */}
        {/* Three main cards */}
        {/* ============================================ */}
        <Row className="g-4">
          {items.map((item, index) => (
            <Col key={item.title} xs={12} md={4}>
              <MvvCard item={item} index={index} isDark={isDark} />
            </Col>
          ))}
        </Row>

        {/* ============================================ */}
        {/* Sub-value chips */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '2.5rem',
          }}
        >
          {subValues.map((v, i) => (
            <div
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '30px',
                backgroundColor: 'var(--bg-card)',
                border: `1.5px solid ${v.color}25`,
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                boxShadow: '0 2px 8px var(--shadow-sm)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = v.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 18px ${v.color}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${v.color}25`;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow-sm)';
              }}
            >
              {v.icon}
              {v.label}
            </div>
          ))}
        </motion.div>

        {/* ============================================ */}
        {/* Closing line */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
          style={{ marginTop: '3rem' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 22px',
              borderRadius: '30px',
              backgroundColor: 'rgba(232, 122, 32, 0.08)',
              border: '1px solid rgba(232, 122, 32, 0.2)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 800,
              color: '#E87A20',
            }}
          >
            <FaStar size={12} />
            هذه ليست شعارات — إنها مبادئ نعيشها في كل تفصيل
          </div>
        </motion.div>
      </Container>

      {/* Local keyframes for the spinning dashed ring */}
      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        }
      `}</style>
    </section>
  );
};

// ============================================
// MvvCard — uses the reusable hook + AnimatedCardBorder
// ============================================
interface MvvCardProps {
  item: {
    icon: React.ReactNode;
    title: string;
    short: string;
    accent: string;
    accentLight: string;
    badge: string;
    description: string;
  };
  index: number;
  isDark: boolean;
}

const MvvCard = ({ item, index, isDark }: MvvCardProps) => {
  // ✅ Shared hook — ref, hover detection, in-view fallback
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
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
            backgroundColor: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '2.25rem 1.75rem 2rem',
            textAlign: 'center',
            height: '100%',
            boxShadow: isDrawn
              ? `0 18px 48px ${item.accent}25`
              : isDark
                ? '0 6px 24px var(--shadow-sm)'
                : '0 6px 24px rgba(0, 0, 0, 0.05)',
            border: `1.5px solid ${isDrawn ? item.accent : `${item.accent}20`}`,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition:
              'border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease',
            transform: isDrawn ? 'translateY(-8px)' : 'translateY(0)',
            boxSizing: 'border-box',
          }}
        >
          {/* ✅ Animated top border */}
          <AnimatedCardBorder
            isDrawn={isDrawn}
            side="top"
            background={`linear-gradient(90deg, ${item.accent}, ${item.accentLight})`}
            drawFrom="start"
            height={4}
            duration={0.6}
            idleOpacity={0}
            rounded
            cardRadius={20}
          />

          {/* Decorative glow — grows on hover */}
          <motion.div
            animate={{
              scale: isDrawn ? 1.15 : 1,
              opacity: isDrawn ? 1 : 0.7,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '-40px',
              left: '-40px',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${item.accent}15, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Icon with animated dashed ring */}
          <div
            style={{
              position: 'relative',
              width: '76px',
              height: '76px',
              margin: '0 auto 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer ring — spins only when drawn */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `2px dashed ${item.accent}${isDrawn ? '80' : '40'}`,
                animation: isDrawn ? 'spinSlow 20s linear infinite' : 'none',
                transition: 'border-color 0.4s ease',
              }}
            />
            {/* Icon circle */}
            <motion.div
              animate={{
                scale: isDrawn ? 1.08 : 1,
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${item.accent}, ${item.accentLight})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isDrawn
                  ? `0 12px 30px ${item.accent}45`
                  : `0 8px 24px ${item.accent}35`,
                position: 'relative',
                zIndex: 1,
                transition: 'box-shadow 0.35s ease',
              }}
            >
              {item.icon}
            </motion.div>
          </div>

          {/* Micro badge */}
          <div
            style={{
              display: 'inline-block',
              alignSelf: 'center',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: `${item.accent}15`,
              color: item.accent,
              fontSize: '0.7rem',
              fontWeight: 800,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '0.75rem',
              letterSpacing: '0.3px',
            }}
          >
            {item.badge}
          </div>

          {/* Title */}
          <h3
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.35rem',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '0.35rem',
              lineHeight: 1.25,
            }}
          >
            {item.title}
          </h3>

          {/* Subtitle */}
          <p
            style={{
              color: item.accent,
              fontSize: '0.85rem',
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '1.25rem',
              opacity: 0.9,
            }}
          >
            {item.short}
          </p>

          {/* Divider */}
          <div
            style={{
              width: '40px',
              height: '2px',
              backgroundColor: `${item.accent}40`,
              borderRadius: '1px',
              margin: '0 auto 1.25rem',
            }}
          />

          {/* Body — justified so lines end at the same right edge */}
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              lineHeight: 1.95,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: 0,
              textAlign: 'justify',
              textJustify: 'inter-word',
              flex: 1,
            }}
          >
            {item.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MissionVisionValues;