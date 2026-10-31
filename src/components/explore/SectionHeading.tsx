import { motion } from 'framer-motion';
import { EXPLORE_DESIGN } from '../../utils/exploreHelpers';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ title, subtitle }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: -14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, ease: EXPLORE_DESIGN.ease_out_expo }}
    style={{
      textAlign: 'center',
      marginBottom: 'clamp(2rem, 5vw, 3.25rem)',
    }}
  >
    <h2
      style={{
        color: 'var(--text-secondary)',
        fontSize: 'clamp(1.6rem, 3.4vw, 2.5rem)',
        fontWeight: 900,
        fontFamily: 'Cairo, sans-serif',
        lineHeight: 1.3,
        margin: '0 0 1rem',
      }}
    >
      {title}
    </h2>

    <div
      style={{
        width: '60px',
        height: '4px',
        backgroundColor: '#E87A20',
        borderRadius: '2px',
        margin: '0 auto',
      }}
    />

    {subtitle && (
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: 'clamp(0.92rem, 1.2vw, 1.02rem)',
          fontFamily: 'Cairo, sans-serif',
          lineHeight: 1.9,
          maxWidth: '620px',
          margin: '1.1rem auto 0',
        }}
      >
        {subtitle}
      </p>
    )}
  </motion.div>
);

export default SectionHeading;
