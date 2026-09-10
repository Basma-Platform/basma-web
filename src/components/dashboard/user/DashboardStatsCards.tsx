import { Row, Col, Card } from 'react-bootstrap';
import { FaBullhorn, FaEye, FaHeart, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import type { DashboardStats } from '../../../types';

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

const DashboardStatsCards = ({ stats }: DashboardStatsCardsProps) => {
  // Format helper enforcing standard 0-9 digits across all browsers
  const formatValue = (val: number) => {
    return val.toLocaleString('en-US');
  };

  const cards = [
    {
      title: 'إعلاناتي',
      value: formatValue(stats.announcements_count),
      icon: <FaBullhorn size={22} />,
      color: '#E87A20',
      bgColor: 'rgba(232, 122, 32, 0.1)',
      topBorder: '#E87A20',
    },
    {
      title: 'المشاهدات',
      value: formatValue(stats.total_views),
      icon: <FaEye size={22} />,
      color: '#17A2B8',
      bgColor: 'rgba(23, 162, 184, 0.1)',
      topBorder: '#17A2B8',
    },
    {
      title: 'الإعجابات',
      value: formatValue(stats.total_likes_received),
      icon: <FaHeart size={22} />,
      color: '#DC3545',
      bgColor: 'rgba(220, 53, 69, 0.1)',
      topBorder: '#DC3545',
    },
    {
      title: 'التقييم العام',
      value: `${formatValue(Number(stats.average_rating))} / 5`,
      icon: <FaStar size={22} />,
      color: '#FFC107',
      bgColor: 'rgba(255, 193, 7, 0.1)',
      topBorder: '#FFC107',
    },
  ];

  return (
    <Row className="g-3">
      {cards.map((card, index) => (
        <Col key={index} xs={12} sm={6} lg={3}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            whileHover={{
              x: -6,
              transition: { duration: 0.2 },
            }}
          >
            <Card
              className="position-relative overflow-hidden h-100"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderTop: `4px solid ${card.topBorder}`,
                borderRadius: '14px',
                padding: '1.25rem',
                boxShadow: '0 4px 12px var(--shadow-sm)',
                transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 8px 24px var(--shadow-md), 0 0 12px rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-sm)';
              }}
            >
              {/* Metallic Glow Overlay on Hover */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)',
                  pointerEvents: 'none',
                  opacity: 0,
                }}
                whileHover={{ opacity: 1 }}
              />

              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    {card.title}
                  </span>
                  <h3
                    className="mt-2 mb-0"
                    style={{
                      color: 'var(--text-primary)',
                      fontWeight: 800,
                      fontSize: '1.6rem',
                    }}
                  >
                    {/* Enforces Western digits (0-9) despite Cairo font or RTL body */}
                    <span
                      style={{
                        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                        fontFeatureSettings: '"lnum" 1, "tnum" 1',
                        fontVariantNumeric: 'lining-nums tabular-nums',
                        direction: 'ltr',
                        display: 'inline-block',
                      }}
                    >
                      {card.value}
                    </span>
                  </h3>
                </div>

                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: card.bgColor,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardStatsCards;