import { Container, Row, Col } from 'react-bootstrap';
import {
  FaUsers,
  FaExchangeAlt,
  FaHandHoldingHeart,
  FaBullhorn,
  FaSmile,
  FaStar,
  FaQuoteRight,
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingArrow,
  arrow,
} from '@floating-ui/react';
import { usePublicStats } from '../../hooks/usePublicStats';
import { useCardBorderAnimation } from '../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../ui/AnimatedCardBorder';

// ============================================
// Fallback values (if API fails)
// ============================================
const FALLBACK = {
  users: 10000,
  announcements: 5000,
  achievements: 50,
  community: 1200,
  satisfaction: 95,
  rating: 4.8,
};

const Statistics = () => {
  const { stats: apiStats, loading } = usePublicStats();

  const [counts, setCounts] = useState({
    users: 0,
    announcements: 0,
    achievements: 0,
    community: 0,
    satisfaction: 0,
    rating: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // ============================================
  // Read real numbers from the API
  // ============================================
  const targets = {
    users: apiStats?.users.total ?? FALLBACK.users,
    announcements: apiStats?.announcements.total ?? FALLBACK.announcements,
    achievements:
      apiStats?.donations?.achievements_count ?? FALLBACK.achievements,
    community: apiStats?.community?.posts_published ?? FALLBACK.community,
    satisfaction: apiStats?.satisfaction.percentage ?? FALLBACK.satisfaction,
    rating: apiStats?.rating.average ?? FALLBACK.rating,
  };

  // ============================================
  // 6 cards with popover messages
  // ============================================
  const stats = [
    {
      key: 'users' as const,
      icon: <FaUsers size={26} color="#E87A20" />,
      label: 'مستخدم في المجتمع',
      suffix: '+',
      decimals: 0,
      popover: {
        title: 'مستخدمون في المجتمع',
        description:
          'عدد المستخدمين المسجّلين في منصة بصمة، من أفراد يسعون للتبادل، ومتبرعين، وصنّاع أثر في مجتمعهم.',
      },
    },
    {
      key: 'announcements' as const,
      icon: <FaExchangeAlt size={26} color="#E87A20" />,
      label: 'خدمة متبادَلة',
      suffix: '+',
      decimals: 0,
      popover: {
        title: 'الخدمات المتبادَلة',
        description:
          'مجموع الخدمات التي عُرضت أو طُلبت عبر منصة بصمة، من تبادل، وبيع، ومقايضة بين أفراد المجتمع.',
      },
    },
    {
      key: 'achievements' as const,
      icon: <FaHandHoldingHeart size={26} color="#17A2B8" />,
      label: 'إنجاز خيري موثّق',
      suffix: '+',
      decimals: 0,
      popover: {
        title: 'الإنجازات الخيرية',
        description:
          'عدد الحالات الإنسانية التي وثّقها فريق صندوق بصمة كإنجاز مجتمعي مكتمل، بعد وصول الدعم الفعلي إليها من المتبرّعين الكرام.',
      },
    },
    {
      key: 'community' as const,
      icon: <FaBullhorn size={26} color="#9C27B0" />,
      label: 'منشور مجتمعي',
      suffix: '+',
      decimals: 0,
      popover: {
        title: 'منشورات المجتمع',
        description:
          'منشورات توعية وتحذيرات ومعلومات عامة نشرها أفراد المجتمع لخدمة أهالي منطقتهم وحمايتهم.',
      },
    },
    {
      key: 'satisfaction' as const,
      icon: <FaSmile size={26} color="#28A745" />,
      label: 'رضا المستخدمين',
      suffix: '%',
      decimals: 0,
      popover: {
        title: 'رضا المستخدمين',
        description:
          'نسبة المستخدمين الذين قيّموا تجربتهم على منصة بصمة بشكل إيجابي، بناءً على تفاعلهم وتقييماتهم.',
      },
    },
    {
      key: 'rating' as const,
      icon: <FaStar size={26} color="#FFC107" />,
      label: 'متوسط التقييم',
      suffix: '/ 5',
      decimals: 1,
      popover: {
        title: 'متوسط التقييم',
        description:
          'متوسط تقييمات المستخدمين لبعضهم البعض بعد كل تعامل أو تبادل خدمة، من أصل 5 نجوم.',
      },
    },
  ];

  // ============================================
  // Section visibility (for count-up animation)
  // ============================================
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Count-up animation
  useEffect(() => {
    if (!isVisible || loading) return;

    let animationFrameId: number;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        users: Math.round(easeOut * targets.users),
        announcements: Math.round(easeOut * targets.announcements),
        achievements: Math.round(easeOut * targets.achievements),
        community: Math.round(easeOut * targets.community),
        satisfaction: Math.round(easeOut * targets.satisfaction),
        rating: Number((easeOut * targets.rating).toFixed(2)),
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isVisible,
    loading,
    targets.users,
    targets.announcements,
    targets.achievements,
    targets.community,
    targets.satisfaction,
    targets.rating,
  ]);

  const formatNumber = (value: number, decimals: number): string => {
    if (decimals > 0) return value.toFixed(decimals);
    return value.toLocaleString('ar-EG');
  };

  const displayValues = {
    users: formatNumber(counts.users, 0),
    announcements: formatNumber(counts.announcements, 0),
    achievements: formatNumber(counts.achievements, 0),
    community: formatNumber(counts.community, 0),
    satisfaction: formatNumber(counts.satisfaction, 0),
    rating: formatNumber(counts.rating, 1),
  };

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '4rem 0 5rem',
        backgroundColor: 'var(--bg-white)',
      }}
    >
      <style>{`
        @keyframes neonPulse {
          0% {
            box-shadow: 0 0 5px var(--stat-glow-soft),
                        0 0 15px var(--stat-glow-soft),
                        inset 0 0 5px var(--stat-glow-soft);
          }
          50% {
            box-shadow: 0 0 15px var(--stat-glow),
                        0 0 30px var(--stat-glow),
                        inset 0 0 10px var(--stat-glow);
          }
          100% {
            box-shadow: 0 0 5px var(--stat-glow-soft),
                        0 0 15px var(--stat-glow-soft),
                        inset 0 0 5px var(--stat-glow-soft);
          }
        }

        .neon-stat-card {
          position: relative;
          background: var(--bg-card);
          border-radius: 16px;
          border: 1.5px solid var(--border-color);
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          cursor: help;
        }

        .neon-stat-card:hover {
          transform: translateY(-6px);
          animation: neonPulse 2.2s infinite ease-in-out;
        }

        .neon-stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.85rem;
          background: var(--stat-icon-bg);
          transition: transform 0.35s ease;
          margin-top: 8px;
        }

        .neon-stat-card:hover .neon-stat-icon {
          transform: scale(1.08) rotate(-4deg);
        }

        /* ============================================ */
        /* Bulletproof LTR rendering for numbers */
        /* ============================================ */
        .neon-stat-value-row {
          direction: ltr !important;
          unicode-bidi: bidi-override !important;
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 6px;
          font-family: 'Cairo', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'lnum' 1, 'tnum' 1;
          white-space: nowrap;
          flex-wrap: nowrap;
        }

        .neon-stat-value-row * {
          direction: ltr !important;
          unicode-bidi: bidi-override !important;
        }

        .neon-stat-value {
          font-size: clamp(1.7rem, 4vw, 2.4rem);
          font-weight: 900;
          line-height: 1;
          color: var(--text-secondary);
          display: inline-block;
        }

        .neon-stat-suffix {
          font-size: clamp(1.15rem, 2.6vw, 1.6rem);
          font-weight: 900;
          color: var(--stat-accent);
          line-height: 1;
          display: inline-block;
        }

        .neon-stat-suffix--rating {
          font-size: clamp(1rem, 2.2vw, 1.4rem);
          letter-spacing: 0.5px;
        }

        /* ============================================ */
        /* Popover */
        /* ============================================ */
        .stat-popover {
          background: var(--bg-card);
          color: var(--text-secondary);
          border-radius: 14px;
          padding: 14px 16px;
          box-shadow: 0 12px 40px var(--shadow-md);
          border: 1px solid var(--border-color);
          font-family: 'Cairo', sans-serif;
          max-width: 300px;
          min-width: 220px;
          font-size: 0.85rem;
          line-height: 1.7;
          z-index: 9999;
          direction: rtl;
          text-align: right;
        }

        .stat-popover__header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .stat-popover__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 8px currentColor;
        }

        .stat-popover__title {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--text-secondary);
        }

        .stat-popover__body {
          color: var(--text-muted);
          font-size: 0.82rem;
          text-align: justify;
          text-justify: inter-word;
        }

        .stat-popover__arrow {
          fill: var(--bg-card);
          stroke: var(--border-color);
          stroke-width: 1;
        }

        /* ============================================ */
        /* Highlighted inline phrase */
        /* ============================================ */
        .inline-highlight {
          display: inline-block;
          color: #E87A20;
          font-weight: 900;
          background-color: rgba(232, 122, 32, 0.10);
          padding: 2px 10px;
          border-radius: 8px;
          line-height: 1.6;
          margin: 0 2px;
        }

        /* ============================================ */
        /* Signature closing card */
        /* ============================================ */
        .stat-closing-card {
          position: relative;
          max-width: 720px;
          margin: 3rem auto 0;
          padding: 1.75rem 2rem;
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            rgba(232, 122, 32, 0.08) 0%,
            rgba(232, 122, 32, 0.03) 50%,
            rgba(139, 90, 43, 0.04) 100%
          );
          border: 1.5px solid rgba(232, 122, 32, 0.25);
          box-shadow: 0 10px 32px rgba(232, 122, 32, 0.10);
          overflow: hidden;
        }

        .stat-closing-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #E87A20, #F5A623, #E87A20);
        }

        .stat-closing-icon {
          position: absolute;
          top: 14px;
          left: 18px;
          color: rgba(232, 122, 32, 0.25);
          font-size: 2.5rem;
          line-height: 1;
          pointer-events: none;
        }

        .stat-closing-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 20px;
          background-color: rgba(232, 122, 32, 0.12);
          color: #E87A20;
          font-family: 'Cairo', sans-serif;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.4px;
          margin-bottom: 0.9rem;
        }

        .stat-closing-body {
          color: var(--text-secondary);
          font-size: 1rem;
          font-family: 'Cairo', sans-serif;
          line-height: 2;
          font-weight: 600;
          margin: 0;
          text-align: justify;
          text-justify: inter-word;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 576px) {
          .stat-closing-card {
            padding: 1.5rem 1.25rem;
          }
          .stat-closing-body {
            font-size: 0.92rem;
            line-height: 1.95;
          }
          .stat-closing-icon {
            font-size: 2rem;
            top: 12px;
            left: 14px;
          }
        }
      `}</style>

      <Container>
        {/* ============================================ */}
        {/* Section header */}
        {/* ============================================ */}
        <div className="text-center mb-5">
          <div
            style={{
              width: '50px',
              height: '3px',
              backgroundColor: '#E87A20',
              borderRadius: '2px',
              margin: '0 auto 1.25rem',
            }}
          />
          <h3
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '0.5rem',
            }}
          >
            بصمة بالأرقام
          </h3>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.95rem',
              fontFamily: 'Cairo, sans-serif',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.9,
              textAlign: 'center',
            }}
          >
            أرقام تعكس أثر مجتمع بصمة في حياة أهالي غزة، وتؤكد أن كل مساهمة{' '}
            <span className="inline-highlight">— مهما كانت صغيرة —</span>{' '}
            تُحدث فرقاً حقيقياً في حياة الآخرين. مرّر المؤشر على أي بطاقة
            لمعرفة التفاصيل.
          </p>
        </div>

        {/* ============================================ */}
        {/* 6 cards */}
        {/* ============================================ */}
        <Row className="g-3 g-md-4">
          {stats.map((stat, index) => {
            const palettes: Record<
              string,
              {
                accent: string;
                glow: string;
                glowSoft: string;
                gradient: string;
                iconBg: string;
              }
            > = {
              users: {
                accent: '#E87A20',
                glow: 'rgba(232, 122, 32, 0.45)',
                glowSoft: 'rgba(232, 122, 32, 0.2)',
                gradient: 'linear-gradient(90deg, #E87A20, #F5A623)',
                iconBg: 'rgba(232, 122, 32, 0.12)',
              },
              announcements: {
                accent: '#E87A20',
                glow: 'rgba(232, 122, 32, 0.45)',
                glowSoft: 'rgba(232, 122, 32, 0.2)',
                gradient: 'linear-gradient(90deg, #E87A20, #F5A623)',
                iconBg: 'rgba(232, 122, 32, 0.12)',
              },
              achievements: {
                accent: '#17A2B8',
                glow: 'rgba(23, 162, 184, 0.45)',
                glowSoft: 'rgba(23, 162, 184, 0.2)',
                gradient: 'linear-gradient(90deg, #17A2B8, #20C9E0)',
                iconBg: 'rgba(23, 162, 184, 0.12)',
              },
              community: {
                accent: '#9C27B0',
                glow: 'rgba(156, 39, 176, 0.45)',
                glowSoft: 'rgba(156, 39, 176, 0.2)',
                gradient: 'linear-gradient(90deg, #9C27B0, #BA68C8)',
                iconBg: 'rgba(156, 39, 176, 0.12)',
              },
              satisfaction: {
                accent: '#28A745',
                glow: 'rgba(40, 167, 69, 0.45)',
                glowSoft: 'rgba(40, 167, 69, 0.2)',
                gradient: 'linear-gradient(90deg, #28A745, #4FCB6E)',
                iconBg: 'rgba(40, 167, 69, 0.12)',
              },
              rating: {
                accent: '#FFC107',
                glow: 'rgba(255, 193, 7, 0.45)',
                glowSoft: 'rgba(255, 193, 7, 0.2)',
                gradient: 'linear-gradient(90deg, #FFC107, #FFD966)',
                iconBg: 'rgba(255, 193, 7, 0.15)',
              },
            };
            const cfg = palettes[stat.key];

            return (
              <Col key={stat.key} xs={6} md={4}>
                <StatCard
                  stat={stat}
                  cfg={cfg}
                  displayValue={displayValues[stat.key]}
                  index={index}
                />
              </Col>
            );
          })}
        </Row>

        {/* ============================================ */}
        {/* Signature closing card */}
        {/* ============================================ */}
        <div className="stat-closing-card">
          <FaQuoteRight className="stat-closing-icon" aria-hidden="true" />

          <div className="stat-closing-eyebrow">
            <FaStar size={11} />
            ليس مجرّد أرقام
          </div>

          <p className="stat-closing-body">
            الأرقام تتحدّث عن بصمة جماعية، لحظات عطاء حقيقية يشارك فيها كل فرد
            في مجتمعنا بأسلوبه الخاص صغيراً كان أو كبيراً، قريباً أو بعيداً.
            كل رقم هنا يحمل خلفه وجهاً، ويداً ممدودة، وقصة إنسانية تستحق أن
            تُروى.
          </p>
        </div>
      </Container>
    </section>
  );
};

// ============================================
// StatCard — uses shared hook + animated top border + floating-ui tooltip
// ============================================
interface StatCardProps {
  stat: {
    key: string;
    icon: React.ReactNode;
    label: string;
    suffix: string;
    popover: { title: string; description: string };
  };
  cfg: {
    accent: string;
    glow: string;
    glowSoft: string;
    gradient: string;
    iconBg: string;
  };
  displayValue: string;
  index: number;
}

const StatCard = ({ stat, cfg, displayValue, index }: StatCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);

  // ✅ Shared hook — handles hover (desktop) + inView (touch)
  const { attachRef, isDrawn, canHover, hoverHandlers } =
    useCardBorderAnimation({
      threshold: 0.4,
      rootMargin: '-50px 0px',
      triggerOnce: true,
    });

  // Staggered draw on touch only
  const drawDelay = canHover ? 0 : index * 0.12;

  // ============================================
  // Floating UI setup
  // ============================================
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [
      offset(12),
      flip({ fallbackAxisSideDirection: 'end' }),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    move: false,
    delay: { open: 150, close: 50 },
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  // Merge our animation ref with floating-ui's setReference
  const setMergedRef = (node: HTMLElement | null) => {
    attachRef(node);
    refs.setReference(node);
  };

  return (
    <>
      <div
        ref={setMergedRef}
        {...getReferenceProps()}
        {...hoverHandlers}
        className="neon-stat-card"
        style={
          {
            ['--stat-accent' as any]: cfg.accent,
            ['--stat-glow' as any]: cfg.glow,
            ['--stat-glow-soft' as any]: cfg.glowSoft,
            ['--stat-gradient' as any]: cfg.gradient,
            ['--stat-icon-bg' as any]: cfg.iconBg,
            textAlign: 'center',
            padding: '1.35rem 0.75rem',
            borderColor: isDrawn ? cfg.accent : 'var(--border-color)',
          } as React.CSSProperties
        }
        aria-label={`${stat.label} - مرر لعرض التفاصيل`}
      >
        {/* ✅ Animated top border — explicit side + cardRadius */}
        <AnimatedCardBorder
          isDrawn={isDrawn}
          side="top"
          background={cfg.gradient}
          drawFrom="start"
          height={4}
          duration={0.7}
          delay={drawDelay}
          idleOpacity={0}
          rounded
          cardRadius={16}
        />

        <div className="neon-stat-icon">{stat.icon}</div>

        <div className="neon-stat-value-row" dir="ltr">
          <span className="neon-stat-value">{displayValue}</span>
          {stat.suffix && (
            <span
              className={
                stat.key === 'rating'
                  ? 'neon-stat-suffix neon-stat-suffix--rating'
                  : 'neon-stat-suffix'
              }
            >
              {stat.key === 'rating' ? ` ${stat.suffix}` : stat.suffix}
            </span>
          )}
        </div>

        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: 'clamp(0.75rem, 1.6vw, 0.85rem)',
            fontFamily: 'Cairo, sans-serif',
            marginTop: '0.5rem',
            lineHeight: 1.5,
            fontWeight: 600,
          }}
        >
          {stat.label}
        </div>
      </div>

      {/* Popover */}
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              zIndex: 9999,
            }}
            {...getFloatingProps()}
          >
            <div
              className="stat-popover"
              style={{
                borderTop: `3px solid ${cfg.accent}`,
              }}
            >
              <div className="stat-popover__header">
                <span
                  className="stat-popover__dot"
                  style={{
                    backgroundColor: cfg.accent,
                    color: cfg.accent,
                  }}
                />
                <span className="stat-popover__title">
                  {stat.popover.title}
                </span>
              </div>
              <div className="stat-popover__body">
                {stat.popover.description}
              </div>
            </div>

            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="stat-popover__arrow"
              width={14}
              height={7}
              tipRadius={2}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default Statistics;