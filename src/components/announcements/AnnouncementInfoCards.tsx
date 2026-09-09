import { FaEye, FaHeart, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface AnnouncementInfoCardsProps {
  views: number;
  likes: number;
  createdAt: string;
}

const AnnouncementInfoCards = ({ views, likes, createdAt }: AnnouncementInfoCardsProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const cards = [
    {
      icon: <FaEye size={18} />,
      value: views,
      label: 'مشاهدة',
      color: 'var(--primary-orange)',
      bgColor: 'rgba(232,122,32,0.1)',
      borderColor: 'var(--primary-orange)',
    },
    {
      icon: <FaHeart size={18} />,
      value: likes,
      label: 'إعجاب',
      color: '#DC3545',
      bgColor: 'rgba(220,53,69,0.1)',
      borderColor: '#DC3545',
    },
    {
      icon: <FaCalendarAlt size={18} />,
      value: formatDate(createdAt),
      label: 'تاريخ النشر',
      color: '#17A2B8',
      bgColor: 'rgba(23,162,184,0.1)',
      borderColor: '#17A2B8',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginTop: '1.5rem',
      }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            cursor: 'default',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = card.borderColor;
            e.currentTarget.style.boxShadow = '0 4px 16px var(--shadow-sm)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: card.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: card.color,
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
            {card.icon}
          </div>
          <div>
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.2,
              }}
            >
              {card.value}
            </div>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              {card.label}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnnouncementInfoCards;