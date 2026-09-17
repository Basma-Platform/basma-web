import { FaEye, FaHeart, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface AnnouncementInfoCardsProps {
  views: number;
  likes: number;
  createdAt: string;
}

const AnnouncementInfoCards = ({ views, likes, createdAt }: AnnouncementInfoCardsProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير معروف';
    try {
      return new Date(dateString).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'غير معروف';
    }
  };

  const cards = [
    {
      id: 'views',
      icon: <FaEye size={16} />,
      value: views,
      label: 'مشاهدة',
      color: 'var(--primary-orange)',
      bgColor: 'rgba(232, 122, 32, 0.1)',
      borderColor: 'rgba(232, 122, 32, 0.4)',
    },
    {
      id: 'likes',
      icon: <FaHeart size={16} />,
      value: likes,
      label: 'إعجاب',
      color: '#DC3545',
      bgColor: 'rgba(220, 53, 69, 0.1)',
      borderColor: 'rgba(220, 53, 69, 0.4)',
    },
    {
      id: 'date',
      icon: <FaCalendarAlt size={16} />,
      value: formatDate(createdAt),
      label: 'تاريخ النشر',
      color: '#17A2B8',
      bgColor: 'rgba(23, 162, 184, 0.1)',
      borderColor: 'rgba(23, 162, 184, 0.4)',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      <style>{`
        .info-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 1.25rem;
          width: 100%;
        }

        @media (max-width: 480px) {
          .info-cards-grid {
            gap: 6px;
          }
          .info-card-item {
            padding: 0.75rem 0.5rem !important;
            flex-direction: column !important;
            text-align: center !important;
            justify-content: center !important;
            gap: 6px !important;
          }
          .info-card-value {
            font-size: 0.85rem !important;
          }
          .info-card-label {
            font-size: 0.65rem !important;
          }
        }
      `}</style>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="info-cards-grid"
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            className="info-card-item"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
              cursor: 'default',
              willChange: 'border-color, box-shadow',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = card.borderColor;
              e.currentTarget.style.boxShadow = '0 4px 14px var(--shadow-sm)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Icon Bubble */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: card.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
                flexShrink: 0,
              }}
            >
              {card.icon}
            </motion.div>

            {/* Label & Value */}
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div
                className="info-card-value"
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {card.value}
              </div>
              <div
                className="info-card-label"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem',
                  fontFamily: 'Cairo, sans-serif',
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                }}
              >
                {card.label}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default AnnouncementInfoCards;