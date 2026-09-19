import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

export type RatingFilter = 'all' | 1 | 2 | 3 | 4 | 5;

interface MyReviewsFiltersProps {
  activeFilter: RatingFilter;
  onFilterChange: (filter: RatingFilter) => void;
  resultsCount?: number;
  onClear?: () => void;
}

const MyReviewsFilters = ({
  activeFilter,
  onFilterChange,
  resultsCount,
  onClear,
}: MyReviewsFiltersProps) => {
  const hasFilter = activeFilter !== 'all';

  const options: { v: RatingFilter; label: string }[] = [
    { v: 'all', label: 'الكل' },
    { v: 5, label: '5 ★' },
    { v: 4, label: '4 ★' },
    { v: 3, label: '3 ★' },
    { v: 2, label: '2 ★' },
    { v: 1, label: '1 ★' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.25rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        fontFamily: 'Cairo, sans-serif',
      }}
      dir="rtl"
    >
      {/* Rating filter tabs and actions row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Star Filter Tabs Container */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            backgroundColor: 'var(--bg-input)',
            padding: '5px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            flex: '1 1 auto',
          }}
        >
          {options.map((opt) => {
            const active = activeFilter === opt.v;
            return (
              <button
                key={String(opt.v)}
                type="button"
                onClick={() => onFilterChange(opt.v)}
                style={{
                  flex: '1 1 auto',
                  minWidth: 'fit-content',
                  padding: '7px 16px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: active ? 'var(--bg-card)' : 'transparent',
                  color: active ? 'var(--primary-orange)' : 'var(--text-muted)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: active ? 700 : 600,
                  cursor: 'pointer',
                  boxShadow: active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Results Counter & Clear Filter Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: '0 1 auto',
          }}
        >
          {typeof resultsCount === 'number' && (
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {resultsCount} نتيجة
            </span>
          )}
          {hasFilter && (
            <button
              type="button"
              onClick={() => {
                if (onClear) onClear();
                else onFilterChange('all');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                borderRadius: '9px',
                border: '1px solid rgba(220,53,69,0.3)',
                backgroundColor: 'rgba(220,53,69,0.06)',
                color: '#DC3545',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DC3545';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.06)';
                e.currentTarget.style.color = '#DC3545';
              }}
            >
              <FaTimes size={10} />
              مسح الفلتر
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MyReviewsFilters;