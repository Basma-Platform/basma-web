import { motion } from 'framer-motion';
import {
  FaChevronRight,
  FaChevronLeft,
  FaAngleDoubleRight,
  FaAngleDoubleLeft,
} from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  /**
   * Optional — if not provided, the per-page dropdown is hidden.
   * Use this for pages where per-page is fixed (e.g. notifications = 20).
   */
  onPerPageChange?: (perPage: number) => void;
  isLoading?: boolean;
  /** Max page numbers to show around current (default: 2) */
  delta?: number;
  /** Custom per-page options */
  perPageOptions?: number[];
  /** Hide "عرض X–Y من Z" info row */
  hideRangeInfo?: boolean;
  /** Item label — "طلب" | "إشعار" | "إعلان" (default: "عنصر") */
  itemLabel?: string;
}

const Pagination = ({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  onPerPageChange,
  isLoading = false,
  delta = 2,
  perPageOptions = [10, 20, 50, 100],
  hideRangeInfo = false,
  itemLabel = 'عنصر',
}: PaginationProps) => {
  // Hide entirely if not needed
  if (lastPage <= 1 && total <= perPage) return null;

  // ============================================
  // Build page numbers with ellipsis
  // ============================================
  const getPages = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(lastPage - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) pages.push('ellipsis-start');

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < lastPage - 1) pages.push('ellipsis-end');

    if (lastPage > 1) pages.push(lastPage);

    return pages;
  };

  const pages = getPages();

  // ============================================
  // Results range info
  // ============================================
  const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  // ============================================
  // Navigation availability
  // ============================================
  const canGoPrev = currentPage > 1 && !isLoading;
  const canGoNext = currentPage < lastPage && !isLoading;
  const canGoFirst = canGoPrev;
  const canGoLast = canGoNext;

  // ============================================
  // Shared button style
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

  const showInfoRow = !hideRangeInfo || !!onPerPageChange;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      dir="rtl"
      style={{
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        fontFamily: 'Cairo, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: showInfoRow ? '16px' : '0',
      }}
    >
      {/* ============================================ */}
      {/* Info Row: Range + Per Page */}
      {/* ============================================ */}
      {showInfoRow && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Range Info */}
          {!hideRangeInfo && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
              }}
            >
              <span>عرض</span>
              <strong style={{ color: 'var(--text-secondary)' }}>
                {from}–{to}
              </strong>
              <span>من</span>
              <strong style={{ color: 'var(--primary-orange)' }}>
                {total.toLocaleString('en-US')}
              </strong>
              <span>{itemLabel}</span>
            </div>
          )}

          {/* Per Page Selector */}
          {onPerPageChange && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                marginRight: hideRangeInfo ? 'auto' : '0',
              }}
            >
              <span>لكل صفحة:</span>
              <select
                value={perPage}
                onChange={(e) => onPerPageChange(Number(e.target.value))}
                disabled={isLoading}
                style={{
                  padding: '6px 12px',
                  paddingLeft: '28px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  backgroundImage:
                    'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238B5A2B\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '12px',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                {perPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* Page Navigation Row */}
      {/* ============================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          flexWrap: 'wrap',
        }}
      >
        {/* First */}
        <motion.button
          type="button"
          onClick={() => canGoFirst && onPageChange(1)}
          disabled={!canGoFirst}
          whileHover={canGoFirst ? { scale: 1.05, y: -1 } : {}}
          whileTap={canGoFirst ? { scale: 0.95 } : {}}
          style={{
            ...baseButtonStyle,
            opacity: canGoFirst ? 1 : 0.4,
            cursor: canGoFirst ? 'pointer' : 'not-allowed',
            gap: '4px',
          }}
          onMouseEnter={(e) => {
            if (!canGoFirst) return;
            e.currentTarget.style.borderColor = 'var(--primary-orange)';
            e.currentTarget.style.color = 'var(--primary-orange)';
            e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.backgroundColor = 'var(--bg-card)';
          }}
          aria-label="الصفحة الأولى"
        >
          <FaAngleDoubleRight size={11} className="pagination-nav-label" />
          <span className="pagination-btn-label">الأولى</span>
        </motion.button>

        {/* Previous */}
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

        {/* Page Numbers */}
        {pages.map((page, idx) => {
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
              whileHover={
                !isDisabled && !isActive ? { scale: 1.05, y: -1 } : {}
              }
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
                cursor: isActive
                  ? 'default'
                  : isDisabled
                  ? 'not-allowed'
                  : 'pointer',
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

        {/* Next */}
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

        {/* Last */}
        <motion.button
          type="button"
          onClick={() => canGoLast && onPageChange(lastPage)}
          disabled={!canGoLast}
          whileHover={canGoLast ? { scale: 1.05, y: -1 } : {}}
          whileTap={canGoLast ? { scale: 0.95 } : {}}
          style={{
            ...baseButtonStyle,
            opacity: canGoLast ? 1 : 0.4,
            cursor: canGoLast ? 'pointer' : 'not-allowed',
            gap: '4px',
          }}
          onMouseEnter={(e) => {
            if (!canGoLast) return;
            e.currentTarget.style.borderColor = 'var(--primary-orange)';
            e.currentTarget.style.color = 'var(--primary-orange)';
            e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.backgroundColor = 'var(--bg-card)';
          }}
          aria-label="الصفحة الأخيرة"
        >
          <span className="pagination-btn-label">الأخيرة</span>
          <FaAngleDoubleLeft size={11} className="pagination-nav-label" />
        </motion.button>
      </div>

      {/* ============================================ */}
      {/* Mobile Indicator (fallback) */}
      {/* ============================================ */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          opacity: 0.75,
          display: 'none',
        }}
        className="pagination-mobile-indicator"
      >
        صفحة{' '}
        <strong style={{ color: 'var(--text-secondary)' }}>{currentPage}</strong>{' '}
        من{' '}
        <strong style={{ color: 'var(--text-secondary)' }}>{lastPage}</strong>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 640px) {
          .pagination-btn-label {
            display: none;
          }
          .pagination-nav-label {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Pagination;