import { Row, Col, Card } from 'react-bootstrap';
import { 
  FaUsers, FaBullhorn, FaComment, FaStar, 
  FaFlag, FaShieldAlt, FaEye,
  FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import { motion } from 'framer-motion';

interface DashboardStatsProps {
  isAdmin?: boolean;
}

const DashboardStats = ({ isAdmin = false }: DashboardStatsProps) => {
  const stats = isAdmin ? [
    { icon: <FaUsers />, label: 'المستخدمين', value: '1,284', change: '+12%', color: '#E87A20', trend: 'up', subtext: '+156 هذا الشهر' },
    { icon: <FaBullhorn />, label: 'الإعلانات', value: '3,847', change: '+8%', color: '#28A745', trend: 'up', subtext: '+234 هذا الشهر' },
    { icon: <FaFlag />, label: 'البلاغات المعلقة', value: '23', change: '-5%', color: '#DC3545', trend: 'down', subtext: '6 جديدة اليوم' },
    { icon: <FaShieldAlt />, label: 'طلبات التحقق', value: '47', change: '+15%', color: '#17A2B8', trend: 'up', subtext: '12 جديدة اليوم' },
    { icon: <FaComment />, label: 'التعليقات', value: '12,456', change: '+22%', color: '#8B5A2B', trend: 'up', subtext: '+1,234 هذا الشهر' },
    { icon: <FaStar />, label: 'متوسط التقييم', value: '4.8', change: '+0.2', color: '#F5A623', trend: 'up', subtext: 'من 5.0' },
  ] : [
    { icon: <FaBullhorn />, label: 'إعلاناتي', value: '12', change: '+2', color: '#E87A20', trend: 'up', subtext: '3 نشطة حالياً' },
    { icon: <FaEye />, label: 'مشاهدات الإعلانات', value: '1,847', change: '+156', color: '#28A745', trend: 'up', subtext: '+45 اليوم' },
    { icon: <FaComment />, label: 'تعليقاتي', value: '34', change: '+8', color: '#17A2B8', trend: 'up', subtext: '3 جديدة اليوم' },
    { icon: <FaStar />, label: 'تقييماتي', value: '4.9', change: '+0.3', color: '#F5A623', trend: 'up', subtext: 'ممتاز' },
    { icon: <FaUsers />, label: 'المتابعون', value: '56', change: '+12', color: '#8B5A2B', trend: 'up', subtext: '+5 هذا الأسبوع' },
    { icon: <FaShieldAlt />, label: 'حالة التحقق', value: 'موثق', change: '✓', color: '#28A745', trend: 'up', subtext: 'هوية موثقة' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Row className="g-3 mb-4">
        {stats.map((stat, index) => (
          <Col key={index} xs={12} sm={6} lg={4} xl={3}>
            <motion.div variants={itemVariants}>
              <Card
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '1.25rem 1.25rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px var(--shadow-md)';
                  e.currentTarget.style.borderColor = stat.color + '40';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, left: 0, height: '3px', background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`, opacity: 0.6 }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'Cairo, sans-serif', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{stat.label}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '1.6rem', fontWeight: 900, fontFamily: 'Cairo, sans-serif', lineHeight: 1.2, marginBottom: '2px' }}>{stat.value}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ color: stat.trend === 'up' ? '#28A745' : '#DC3545', fontSize: '0.65rem', fontWeight: 700, fontFamily: 'Cairo, sans-serif', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {stat.trend === 'up' ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                        {stat.change}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem', fontFamily: 'Cairo, sans-serif', opacity: 0.6 }}>{stat.subtext}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                      fontSize: '1.2rem',
                      flexShrink: 0,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </motion.div>
  );
};

export default DashboardStats;