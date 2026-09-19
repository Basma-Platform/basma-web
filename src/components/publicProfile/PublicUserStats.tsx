import { motion } from 'framer-motion';
import { FaWhatsapp, FaStar, FaCommentAlt } from 'react-icons/fa';

interface PublicUserStatsProps {
  averageRating: number;
  totalRatings: number;
  totalWithComments: number;
  whatsapp: string | null;
  whatsappVisible: boolean;
}

const PublicUserStats = ({
  averageRating,
  totalRatings,
  totalWithComments,
  whatsapp,
  whatsappVisible,
}: PublicUserStatsProps) => {
  // Format WhatsApp URL
  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/^\+/, '')}`
    : null;

  const stats = [
    {
      label: 'متوسط التقييم',
      value: totalRatings > 0 ? averageRating.toFixed(1) : '—',
      suffix: totalRatings > 0 ? '/ 5' : '',
      icon: <FaStar size={16} />,
      gradient: 'linear-gradient(135deg, #FFC107, #F5A623)',
      bg: 'rgba(255,193,7,0.1)',
      color: '#F5A623',
    },
    {
      label: 'إجمالي التقييمات',
      value: totalRatings.toLocaleString('en-US'),
      suffix: '',
      icon: <FaStar size={16} />,
      gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
      bg: 'rgba(40,167,69,0.1)',
      color: '#28A745',
    },
    {
      label: 'تقييمات بتعليق',
      value: totalWithComments.toLocaleString('en-US'),
      suffix: '',
      icon: <FaCommentAlt size={16} />,
      gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
      bg: 'rgba(23,162,184,0.1)',
      color: '#17A2B8',
    },
  ];

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      dir="rtl"
    >
      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px',
        }}
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.06 }}
            style={{
              position: 'relative',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1rem',
              boxShadow: '0 2px 8px var(--shadow-sm)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            {/* Top accent bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                height: '3px',
                background: stat.gradient,
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                {stat.label}
              </span>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '9px',
                  background: stat.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                  boxShadow: `0 4px 10px ${stat.color}30`,
                }}
              >
                {stat.icon}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px',
              }}
            >
              <span
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  fontFamily:
                    "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                  fontVariantNumeric: 'lining-nums tabular-nums',
                }}
              >
                {stat.value}
              </span>
              {stat.suffix && (
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  {stat.suffix}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* WhatsApp Button */}
      {whatsappVisible && whatsappUrl && (
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px 20px',
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            borderRadius: '14px',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '0 6px 20px rgba(37,211,102,0.35)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1DA851';
            e.currentTarget.style.boxShadow =
              '0 10px 28px rgba(37,211,102,0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#25D366';
            e.currentTarget.style.boxShadow =
              '0 6px 20px rgba(37,211,102,0.35)';
          }}
        >
          <FaWhatsapp size={20} />
          تواصل عبر واتساب
        </motion.a>
      )}
    </div>
  );
};

export default PublicUserStats;