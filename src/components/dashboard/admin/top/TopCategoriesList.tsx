import { motion } from 'framer-motion';
import { FaBox, FaTools } from 'react-icons/fa';
import type { TopCategory } from '../../../../types';

interface TopCategoriesListProps {
  categories: TopCategory[];
}

/**
 * Top Categories — Ranked with progress bars
 * - Each category shows percentage of total
 */
const TopCategoriesList = ({ categories }: TopCategoriesListProps) => {
  if (!categories || categories.length === 0) {
    return (
      <div
        style={{
          padding: '2.5rem 1rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '0.82rem',
          opacity: 0.7,
        }}
      >
        لا توجد فئات بعد
      </div>
    );
  }

  // Compute total for percentage
  const total = categories.reduce(
    (sum, c) => sum + c.announcements_count,
    0
  );

  const maxCount = Math.max(...categories.map((c) => c.announcements_count));

  return (
    <div
      dir="rtl"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxHeight: '420px',
        overflowY: 'auto',
        margin: '0 -4px',
        padding: '0 4px',
      }}
    >
      {categories.map((category, index) => {
        const percentage = total > 0
          ? Math.round((category.announcements_count / total) * 100)
          : 0;
        const barWidth = maxCount > 0
          ? (category.announcements_count / maxCount) * 100
          : 0;
        const isGoods = category.category === 'goods';
        const color = isGoods ? '#E87A20' : '#17A2B8';
        const gradient = isGoods
          ? 'linear-gradient(90deg, #E87A20, #F5A623)'
          : 'linear-gradient(90deg, #17A2B8, #20C9E0)';

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '9px',
                    background: `${color}15`,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isGoods ? <FaBox size={13} /> : <FaTools size={13} />}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
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
                  </div>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                    }}
                  >
                    {isGoods ? 'سلع' : 'خدمات'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '6px',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    fontFamily: 'system-ui, sans-serif',
                    fontVariantNumeric: 'tabular-nums',
                    direction: 'ltr',
                  }}
                >
                  {category.announcements_count}
                </span>
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  {percentage}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                style={{
                  height: '100%',
                  background: gradient,
                  borderRadius: '4px',
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TopCategoriesList;