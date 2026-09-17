import { Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaUserPlus,
  FaBullhorn,
  FaFlag,
  FaShieldAlt,
  FaChartLine,
} from 'react-icons/fa';
import type { AdminActivity } from '../../../types';

interface AdminActivityCardsProps {
  activity: AdminActivity;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const AdminActivityCards = ({ activity }: AdminActivityCardsProps) => {
  // ✅ Format numbers with Western digits (0-9)
  const formatValue = (val: number) => {
    return (val || 0).toLocaleString('en-US');
  };

  const cards = [
    {
      title: 'مستخدمون جدد اليوم',
      value: formatValue(activity.today_users),
      icon: <FaUserPlus size={20} />,
      color: '#E87A20',
      bgColor: 'rgba(232, 122, 32, 0.1)',
      gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
    },
    {
      title: 'إعلانات جديدة اليوم',
      value: formatValue(activity.today_announcements),
      icon: <FaBullhorn size={20} />,
      color: '#28A745',
      bgColor: 'rgba(40, 167, 69, 0.1)',
      gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
    },
    {
      title: 'بلاغات جديدة اليوم',
      value: formatValue(activity.today_reports),
      icon: <FaFlag size={20} />,
      color: '#DC3545',
      bgColor: 'rgba(220, 53, 69, 0.1)',
      gradient: 'linear-gradient(135deg, #DC3545, #F56575)',
    },
    {
      title: 'طلبات تحقق اليوم',
      value: formatValue(activity.today_verifications),
      icon: <FaShieldAlt size={20} />,
      color: '#17A2B8',
      bgColor: 'rgba(23, 162, 184, 0.1)',
      gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      dir="rtl"
      style={{ marginTop: '1.5rem' }}
    >
      <Card
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          padding: '1.5rem',
          boxShadow: '0 6px 20px var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Background Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '-50px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(232,122,32,0.08), transparent)',
            pointerEvents: 'none',
            filter: 'blur(20px)',
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-color)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #E87A20, #F5A623)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(232,122,32,0.3)',
            }}
          >
            <FaChartLine size={18} />
          </motion.div>
          <div>
            <h5
              style={{
                color: 'var(--text-secondary)',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                fontSize: '1.05rem',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              نشاط اليوم
            </h5>
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              آخر التحديثات اليومية على المنصة
            </span>
          </div>
        </div>

        {/* Activity Cards Grid */}
        <Row className="g-3" style={{ position: 'relative', zIndex: 1 }}>
          {cards.map((card, index) => (
            <Col key={index} xs={12} sm={6} lg={3}>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                }}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2, ease: 'easeInOut' },
                }}
                style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '1rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  height: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = card.color + '50';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${card.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: card.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${card.color}35`,
                  }}
                >
                  {card.icon}
                </motion.div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                      fontFeatureSettings: '"lnum" 1, "tnum" 1',
                      fontVariantNumeric: 'lining-nums tabular-nums',
                      lineHeight: 1.1,
                      marginBottom: '4px',
                      direction: 'ltr',
                      textAlign: 'right',
                    }}
                  >
                    {card.value}
                  </div>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 600,
                      opacity: 0.8,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {card.title}
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Card>
    </motion.div>
  );
};

export default AdminActivityCards;