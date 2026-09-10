import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface ContactButtonConfig {
  label: string;
  icon: React.ReactNode;
  variant: 'outline' | 'warning' | 'disabled' | 'whatsapp';
  to: string;
  disabled: boolean;
  tooltip?: string;
  href?: boolean;
}

interface AnnouncementContactButtonProps {
  config: ContactButtonConfig | null;
}

const AnnouncementContactButton = ({ config }: AnnouncementContactButtonProps) => {
  if (!config) return null;

  if (config.disabled) {
    return (
      <Button
        disabled
        style={{
          backgroundColor: 'var(--bg-input)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-muted)',
          width: '100%',
          borderRadius: '12px',
          padding: '14px',
          fontWeight: 700,
          fontSize: '1.05rem',
          fontFamily: 'Cairo, sans-serif',
          cursor: 'not-allowed',
          opacity: 0.6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          transition: 'all 0.3s ease',
        }}
        title={config.tooltip}
      >
        {config.icon}
        <span>{config.label}</span>
      </Button>
    );
  }

  if (config.variant === 'whatsapp') {
    return (
      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href={config.to}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          width: '100%',
          borderRadius: '12px',
          padding: '14px',
          fontWeight: 700,
          fontSize: '1.05rem',
          fontFamily: 'Cairo, sans-serif',
          transition: 'all 0.3s ease',
          textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1DA851';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,211,102,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#25D366';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.3)';
        }}
      >
        {config.icon}
        {config.label}
      </motion.a>
    );
  }

  if (config.variant === 'warning') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ width: '100%' }}
      >
        <Button
          as={Link as any}
          to={config.to}
          style={{
            backgroundColor: '#FFC107',
            borderColor: '#FFC107',
            color: '#212529',
            width: '100%',
            borderRadius: '12px',
            padding: '14px',
            fontWeight: 700,
            fontSize: '1.05rem',
            fontFamily: 'Cairo, sans-serif',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 4px 16px rgba(255,193,7,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E0A800';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,193,7,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFC107';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,193,7,0.3)';
          }}
          title={config.tooltip}
        >
          {config.icon}
          {config.label}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ width: '100%' }}
    >
      <Button
        as={Link as any}
        to={config.to}
        style={{
          backgroundColor: 'transparent',
          borderColor: 'var(--primary-orange)',
          color: 'var(--primary-orange)',
          width: '100%',
          borderRadius: '12px',
          padding: '14px',
          fontWeight: 700,
          fontSize: '1.05rem',
          fontFamily: 'Cairo, sans-serif',
          transition: 'all 0.3s ease',
          borderWidth: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          boxShadow: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
          e.currentTarget.style.color = '#FFFFFF';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,122,32,0.3)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--primary-orange)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        title={config.tooltip}
      >
        {config.icon}
        {config.label}
      </Button>
    </motion.div>
  );
};

export default AnnouncementContactButton;