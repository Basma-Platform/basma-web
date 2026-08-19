import { Container, Row, Col } from 'react-bootstrap';
import { FaUsers, FaBullhorn, FaStar, FaChartLine } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Statistics = () => {
  const { isDark } = useTheme();
  const [counts, setCounts] = useState({ users: 0, announcements: 0, satisfaction: 0, rating: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      key: 'users',
      icon: <FaUsers size={32} color="#E87A20" />,
      target: 10000,
      label: 'مستخدم',
      suffix: '+',
    },
    {
      key: 'announcements',
      icon: <FaBullhorn size={32} color="#E87A20" />,
      target: 5000,
      label: 'إعلان',
      suffix: '+',
    },
    {
      key: 'satisfaction',
      icon: <FaStar size={32} color="#E87A20" />,
      target: 98,
      label: 'رضا المستخدمين',
      suffix: '%',
    },
    {
      key: 'rating',
      icon: <FaChartLine size={32} color="#E87A20" />,
      target: 4.8,
      label: 'متوسط التقييم',
      suffix: '',
    },
  ];

  // Intersection Observer to trigger animation when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate numbers counting up
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        users: Math.round(easeOut * stats[0].target),
        announcements: Math.round(easeOut * stats[1].target),
        satisfaction: Math.round(easeOut * stats[2].target),
        rating: Number((easeOut * stats[3].target).toFixed(1)),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isVisible]);

  const displayValues = {
    users: counts.users.toLocaleString('ar-EG'),
    announcements: counts.announcements.toLocaleString('ar-EG'),
    satisfaction: counts.satisfaction,
    rating: counts.rating,
  };

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '4rem 0',
        backgroundColor: isDark ? '#16213e' : '#FFFFFF',
      }}
    >
      <Container>
        <Row className="g-4">
          {stats.map((stat, index) => (
            <Col key={index} xs={6} lg={3}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '1.5rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: isDark ? '#1e2a4a' : '#FDF5E6',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="mb-2">{stat.icon}</div>

                <div
                  style={{
                    color: isDark ? '#FDF5E6' : '#6B4226',
                    fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    direction: 'ltr',
                  }}
                >
                  {displayValues[stat.key as keyof typeof displayValues]}
                  {stat.suffix}
                </div>

                <div
                  style={{
                    color: isDark ? '#C49A6C' : '#8B5A2B',
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