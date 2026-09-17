import { 
  FaShieldAlt, 
  FaMapMarkerAlt, 
  FaUserFriends, 
  FaStar, 
  FaBan, 
  FaExclamationTriangle 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

interface AnnouncementSecurityTipsProps {
  className?: string;
}

const AnnouncementSecurityTips = ({ className }: AnnouncementSecurityTipsProps) => {
  const tips = [
    {
      id: 1,
      icon: <FaMapMarkerAlt size={14} color="var(--primary-orange)" />,
      iconBg: 'rgba(232, 122, 32, 0.12)',
      text: 'اختر مكاناً عاماً للقاء',
    },
    {
      id: 2,
      icon: <FaUserFriends size={14} color="#0D6EFD" />,
      iconBg: 'rgba(13, 110, 253, 0.12)',
      text: 'أخبر أحداً عن موعد اجتماعك',
    },
    {
      id: 3,
      icon: <FaStar size={14} color="#F5A623" />,
      iconBg: 'rgba(245, 166, 35, 0.12)',
      text: 'تحقق من التقييمات قبل التعامل',
    },
    {
      id: 4,
      icon: <FaBan size={14} color="#6C757D" />,
      iconBg: 'rgba(108, 117, 125, 0.12)',
      text: 'ألغِ الاجتماع إذا شعرت بعدم الأمان',
    },
    {
      id: 5,
      icon: <FaExclamationTriangle size={14} color="#DC3545" />,
      iconBg: 'rgba(220, 53, 69, 0.12)',
      text: 'أبلغ عن أي سلوك مشبوه',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  };

  return (
    <>
      <style>{`
        .security-tips-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .security-tips-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .security-tips-scroll::-webkit-scrollbar-thumb {
          background-color: var(--border-color);
          border-radius: 4px;
        }
      `}</style>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 4px 16px var(--shadow-sm)',
          border: '1px solid var(--border-color)',
          boxSizing: 'border-box',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '1rem',
            flexShrink: 0,
          }}
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(232, 122, 32, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-orange)',
              flexShrink: 0,
            }}
          >
            <FaShieldAlt size={16} />
          </motion.div>
          <h4
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
              margin: 0,
            }}
          >
            إرشادات الأمان
          </h4>
        </div>

        {/* Tips Scrollable Container */}
        <div
          className="security-tips-scroll"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '320px',
            overflowY: 'auto',
            paddingRight: '2px',
          }}
        >
          {tips.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ x: -4, backgroundColor: 'rgba(232, 122, 32, 0.05)' }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                cursor: 'default',
                willChange: 'transform, background-color',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: item.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  fontFamily: 'Cairo, sans-serif',
                  lineHeight: 1.35,
                }}
              >
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default AnnouncementSecurityTips;