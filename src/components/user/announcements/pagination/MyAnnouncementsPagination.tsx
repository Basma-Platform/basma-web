import { motion } from 'framer-motion';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface MyAnnouncementsPaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  /** Max page numbers to show around current (default: 2) */
  delta?: number;
}

const MyAnnouncementsPagination = ({
  currentPage,
  lastPage,
  onPageChange,
  isLoading = false,
  delta = 2,
}: MyAnnouncementsPaginationProps) => {
  // ✅ No pagination needed if only 1 page
  if (lastPage <= 1) return null;

  // ============================================
  // Build page numbers with ellipsis
  // ============================================
  const getPages = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(lastPage - 1, currentPage + delta);

    // Always show first page
    pages.push(1);

    // Left ellipsis
    if (left > 2) {
      pages.push('ellipsis-start');
    }

    // Middle pages
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // Right ellipsis
    if (right < lastPage - 1) {
      pages.push('ellipsis-end');
    }

    // Always show last page
    if (lastPage > 1) {
      pages.push(lastPage);
    }

    return pages;
  };

  const pages = getPages();
  const canGoPrev = currentPage > 1 && !isLoading;
  const canGoNext = currentPage < lastPage && !isLoading;

  // ============================================
  // Button base style
  // ============================================
  const baseButtonStyle: React.CSSProperties = {
    minWidth: '40px',
    height: '40px',
    padding: '0 12px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    fontFamily: 'Cairo, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      dir="rtl"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        flexWrap: 'wrap',
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {/* ============================================ */}
      {/* Previous Button */}
      {/* ============================================ */}
      <motion.button
        type="button"
        onClick={() => canGoPrev && onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        whileHover={canGoPrev ? { scale: 1.05, y: -1 } : {}}
        whileTap={canGoPrev ? { scale: 0.95 } : {}}
        style={{
          ...baseButtonStyle,
          opacity: canGoPrev ? 1 : 0.4,
          cursor: canGoPrev ? 'pointer' : 'not-allowed',
          padding: '0 14px',
          gap: '6px',
        }}
        onMouseEnter={(e) => {
          if (!canGoPrev) return;
          e.currentTarget.style.borderColor = 'var(--primary-orange)';
          e.currentTarget.style.color = 'var(--primary-orange)';
          e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.backgroundColor = 'var(--bg-card)';
        }}
        aria-label="الصفحة السابقة"
      >
        <FaChevronRight size={10} />
        <span className="pagination-btn-label">السابق</span>
      </motion.button>

      {/* ============================================ */}
      {/* Page Numbers */}
      {/* ============================================ */}
      {pages.map((page, idx) => {
        // Ellipsis
        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
          return (
            <span
              key={`${page}-${idx}`}
              style={{
                minWidth: '40px',
                height: '40px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                userSelect: 'none',
                opacity: 0.7,
              }}
            >
              …
            </span>
          );
        }

        const isActive = page === currentPage;
        const isDisabled = isLoading;

        return (
          <motion.button
            key={page}
            type="button"
            onClick={() => !isDisabled && !isActive && onPageChange(page)}
            disabled={isDisabled || isActive}
            whileHover={!isDisabled && !isActive ? { scale: 1.05, y: -1 } : {}}
            whileTap={!isDisabled && !isActive ? { scale: 0.95 } : {}}
            style={{
              ...baseButtonStyle,
              backgroundColor: isActive
                ? 'var(--primary-orange)'
                : 'var(--bg-card)',
              borderColor: isActive
                ? 'var(--primary-orange)'
                : 'var(--border-color)',
              color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
              cursor: isActive ? 'default' : isDisabled ? 'not-allowed' : 'pointer',
              boxShadow: isActive
                ? '0 4px 12px rgba(232,122,32,0.35)'
                : 'none',
              opacity: isDisabled && !isActive ? 0.5 : 1,
              fontFamily:
                "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              fontVariantNumeric: 'lining-nums tabular-nums',
            }}
            onMouseEnter={(e) => {
              if (isActive || isDisabled) return;
              e.currentTarget.style.borderColor = 'var(--primary-orange)';
              e.currentTarget.style.color = 'var(--primary-orange)';
              e.currentTarget.style.backgroundColor =
                'rgba(232,122,32,0.06)';
            }}
            onMouseLeave={(e) => {
              if (isActive || isDisabled) return;
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-card)';
            }}
            aria-label={`الصفحة ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </motion.button>
        );
      })}

      {/* ============================================ */}
      {/* Next Button */}
      {/* ============================================ */}
      <motion.button
        type="button"
        onClick={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        whileHover={canGoNext ? { scale: 1.05, y: -1 } : {}}
        whileTap={canGoNext ? { scale: 0.95 } : {}}
        style={{
          ...baseButtonStyle,
          opacity: canGoNext ? 1 : 0.4,
          cursor: canGoNext ? 'pointer' : 'not-allowed',
          padding: '0 14px',
          gap: '6px',
        }}
        onMouseEnter={(e) => {
          if (!canGoNext) return;
          e.currentTarget.style.borderColor = 'var(--primary-orange)';
          e.currentTarget.style.color = 'var(--primary-orange)';
          e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.backgroundColor = 'var(--bg-card)';
        }}
        aria-label="الصفحة التالية"
      >
        <span className="pagination-btn-label">التالي</span>
        <FaChevronLeft size={10} />
      </motion.button>

      {/* ============================================ */}
      {/* Info Label */}
      {/* ============================================ */}
      <div
        style={{
          marginRight: 'auto',
          marginLeft: 'auto',
          marginTop: '12px',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          opacity: 0.75,
          width: '100%',
        }}
      >
        صفحة{' '}
        <strong style={{ color: 'var(--text-secondary)' }}>{currentPage}</strong>{' '}
        من{' '}
        <strong style={{ color: 'var(--text-secondary)' }}>{lastPage}</strong>
      </div>

      {/* ============================================ */}
      {/* Responsive Styles */}
      {/* ============================================ */}
      <style>{`
        @media (max-width: 480px) {
          .pagination-btn-label {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default MyAnnouncementsPagination;