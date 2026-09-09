import { motion } from 'framer-motion';

interface AnnouncementSecurityTipsProps {
  className?: string;
}

const AnnouncementSecurityTips = ({ className }: AnnouncementSecurityTipsProps) => {
  const tips = [
    { icon: '📍', text: 'اختر مكاناً عاماً للقاء' },
    { icon: '👤', text: 'أخبر أحداً عن موعد اجتماعك' },
    { icon: '⭐', text: 'تحقق من التقييمات قبل التعامل' },
    { icon: '🚫', text: 'ألغِ الاجتماع إذا شعرت بعدم الأمان' },
    { icon: '🚨', text: 'أبلغ عن أي سلوك مشبوه' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className={className}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(232,122,32,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
          }}
        >
          🛡️
        </div>
        <h4
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: 700,
            fontFamily: 'Cairo, sans-serif',
            margin: 0,
          }}
        >
          إرشادات الأمان
        </h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tips.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ x: -4 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-orange)';
              e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.backgroundColor = 'var(--bg-input)';
            }}
          >
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.4,
              }}
            >
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AnnouncementSecurityTips;