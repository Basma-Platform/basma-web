import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  darkMode?: boolean;
  className?: string;
  padding?: string;
}

const Card = ({ children, darkMode, className = '', padding = '2rem' }: CardProps) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        backgroundColor: darkMode ? 'var(--bg-card)' : 'var(--bg-card)',
        borderRadius: '24px',
        padding,
        boxShadow: darkMode
          ? '0 8px 32px var(--shadow-md)'
          : '0 8px 32px var(--shadow-sm)',
        border: `1px solid var(--border-color)`,
        transition: 'all 0.3s ease',
      }}
    >
      {children}
    </div>
  );
};

export default Card;