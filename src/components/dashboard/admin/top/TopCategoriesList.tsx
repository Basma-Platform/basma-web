import { motion } from 'framer-motion';
import {
  FaTag,
  FaFolder,
  FaHashtag,
} from 'react-icons/fa';
import type { TopCategory } from '../../../../types';

interface TopCategoriesListProps {
  categories: TopCategory[];
}

const TopCategoriesList = ({ categories }: TopCategoriesListProps) => {
  if (!categories || categories.length === 0) {
    return (
      <EmptyState />
    );
  }

  const maxCount = Math.max(...categories.map((c) => c.announcements_count), 1);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        fontFamily: 'Cairo, sans-serif',
      }}
      dir="rtl"
    >
      {categories.map((category, index) => {
        const percentage = (category.announcements_count / maxCount) * 100;

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
            }}
          >
            {/* Rank */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                backgroundColor:
                  index === 0
                    ? 'rgba(232,122,32,0.15)'
                    : 'var(--bg-card)',
                color:
                  index === 0 ? 'var(--primary-orange)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 800,
                flexShrink: 0,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              <FaHashtag size={11} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: '6px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    minWidth: 0,
                  }}
                >
                  <FaTag size={11} color="var(--primary-orange)" />
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {category.name}
                  </span>
                </div>

                <span
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    fontFamily:
                      "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                    fontVariantNumeric: 'lining-nums tabular-nums',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {category.announcements_count}
                </span>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: 'var(--bg-card)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.05 + 0.2 }}
                  style={{
                    height: '100%',
                    background:
                      index === 0
                        ? 'linear-gradient(90deg, #E87A20, #F5A623)'
                        : 'linear-gradient(90deg, #8B5A2B, #C49A6C)',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const EmptyState = () => (
  <div
    style={{
      padding: '2rem 1rem',
      textAlign: 'center',
      fontFamily: 'Cairo, sans-serif',
    }}
  >
    <FaFolder size={28} color="var(--text-muted)" opacity={0.4} />
    <p
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        margin: '8px 0 0',
      }}
    >
      لا توجد بيانات
    </p>
  </div>
);

export default TopCategoriesList;