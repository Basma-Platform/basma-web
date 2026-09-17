import { Container, Row, Col } from 'react-bootstrap';
import { FaUsers, FaBullhorn, FaStar, FaChartLine } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { usePublicStats } from '../../hooks/usePublicStats';

// ✅ Fallback values (if API fails)
const FALLBACK = {
  users: 10000,
  announcements: 5000,
  satisfaction: 98,
  rating: 4.8,
};

const Statistics = () => {
  const { stats: apiStats, loading } = usePublicStats();
  const [counts, setCounts] = useState({
    users: 0,
    announcements: 0,
    satisfaction: 0,
    rating: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // ✅ Resolve real targets from API (or fallback)
  const targets = {
    users: apiStats?.users.total ?? FALLBACK.users,
    announcements: apiStats?.announcements.total ?? FALLBACK.announcements,
    satisfaction: apiStats?.satisfaction.percentage ?? FALLBACK.satisfaction,
    rating: apiStats?.rating.average ?? FALLBACK.rating,
  };

  const stats = [
    {
      key: 'users' as const,
      icon: <FaUsers size={32} color="#E87A20" />,
      target: targets.users,
      label: 'مستخدم',
      suffix: '+',
    },
    {
      key: 'announcements' as const,
      icon: <FaBullhorn size={32} color="#E87A20" />,
      target: targets.announcements,
      label: 'إعلان',
      suffix: '+',
    },
    {
      key: 'satisfaction' as const,
      icon: <FaStar size={32} color="#E87A20" />,
      target: targets.satisfaction,
      label: 'رضا المستخدمين',
      suffix: '%',
    },
    {
      key: 'rating' as const,
      icon: <FaChartLine size={32} color="#E87A20" />,
      target: targets.rating,
      label: 'متوسط التقييم',
      suffix: '',
    },
  ];

  // Intersection Observer to trigger animation once in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // ✅ Wait for stats to load before animating
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
        satisfaction: Math.round(easeOut * targets.satisfaction),
        rating: Number((easeOut * targets.rating).toFixed(1)),
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, loading, targets.users, targets.announcements, targets.satisfaction, targets.rating]);

  const displayValues = {
    users: counts.users.toLocaleString('ar-EG'),
    announcements: counts.announcements.toLocaleString('ar-EG'),
    satisfaction: counts.satisfaction.toLocaleString('ar-EG'),
    rating: counts.rating.toLocaleString('ar-EG', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }),
  };

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '4rem 0',
        backgroundColor: 'var(--bg-white)',
      }}
    >
      <style>
        {`
          @keyframes neonPulse {
            0% {
              box-shadow: 0 0 5px rgba(232, 122, 32, 0.4),
                          0 0 15px rgba(232, 122, 32, 0.2),
                          inset 0 0 5px rgba(232, 122, 32, 0.1);
              border-color: #E87A20;
            }
            50% {
              box-shadow: 0 0 15px rgba(232, 122, 32, 0.8),
                          0 0 30px rgba(232, 122, 32, 0.5),
                          inset 0 0 10px rgba(232, 122, 32, 0.3);
              border-color: #ffaa54;
            }
            100% {
              box-shadow: 0 0 5px rgba(232, 122, 32, 0.4),
                          0 0 15px rgba(232, 122, 32, 0.2),
                          inset 0 0 5px rgba(232, 122, 32, 0.1);
              border-color: #E87A20;
            }
          }

          .neon-stat-card {
            position: relative;
            background: var(--bg-card);
            border-radius: 12px;
            border: 1px solid var(--border-color);
            transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          }

          .neon-stat-card:hover {
            transform: translateY(-5px);
            animation: neonPulse 2s infinite ease-in-out;
          }
        `}
      </style>

      <Container>
        <Row className="g-4">
          {stats.map((stat) => (
            <Col key={stat.key} xs={6} lg={3}>
              <div
                className="neon-stat-card"
                style={{
                  textAlign: 'center',
                  padding: '1.5rem 1rem',
                  height: '100%',
                }}
              >
                <div className="mb-2">{stat.icon}</div>

                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    direction: 'ltr',
                    unicodeBidi: 'isolate',
                  }}
                >
                  {displayValues[stat.key]}
                  {stat.suffix}
                </div>

                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.95rem',
                    fontFamily: 'Cairo, sans-serif',
                    marginTop: '0.25rem',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Statistics;