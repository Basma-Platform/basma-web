import { motion } from 'framer-motion';
import { FaInbox } from 'react-icons/fa';

interface HelpRequestEmptyStateProps {
  title?: string;
  description?: string;
}

const HelpRequestEmptyState = ({
  title = 'لا توجد طلبات مساعدة حالياً',
  description = 'عندما يوافق الأدمن على طلبات جديدة، ستظهر هنا.',
}: HelpRequestEmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: 'clamp(2.5rem, 8vw, 4rem) 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px dashed var(--border-color)',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <div
        style={{
          width: '84px',
          height: '84px',
          margin: '0 auto 1rem',
          borderRadius: '50%',
          background: 'rgba(23,162,184,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#17A2B8',
        }}
      >
        <FaInbox size={38} opacity={0.6} />
      </div>
      <h3
        style={{
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          fontWeight: 800,
          margin: '0 0 8px',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </motion.div>
  );
};

export default HelpRequestEmptyState;