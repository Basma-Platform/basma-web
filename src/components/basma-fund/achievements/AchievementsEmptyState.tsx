import { motion } from 'framer-motion';
import { FaAward } from 'react-icons/fa';

interface AchievementsEmptyStateProps {
  title?: string;
  description?: string;
}

const AchievementsEmptyState = ({
  title = 'لا توجد إنجازات معروضة',
  description = 'تابعنا — سيتم عرض إنجازاتنا هنا قريباً.',
}: AchievementsEmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: 'clamp(2.25rem, 7vw, 3.5rem) 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px dashed var(--border-color)',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <div
        style={{
          width: '76px',
          height: '76px',
          margin: '0 auto 1rem',
          borderRadius: '50%',
          background: 'rgba(255,193,7,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFC107',
        }}
      >
        <FaAward size={32} opacity={0.7} />
      </div>
      <h3
        style={{
          color: 'var(--text-secondary)',
          fontSize: '1.05rem',
          fontWeight: 800,
          margin: '0 0 6px',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.82rem',
          margin: 0,
        }}
      >
        {description}
      </p>
    </motion.div>
  );
};

export default AchievementsEmptyState;