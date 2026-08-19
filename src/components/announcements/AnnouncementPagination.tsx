import { useTheme } from '../../context/ThemeContext';
import type { CSSProperties } from 'react'; // ✅ Fix: use 'type' import

interface AnnouncementPaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

const AnnouncementPagination = ({
  currentPage,
  lastPage,
  onPageChange,
}: AnnouncementPaginationProps) => {
  const { isDark } = useTheme();

  if (lastPage <= 1) return null;

  const getPages = () => {
    const pages: number[] = [];
    const delta = 2;

    for (let i = 1; i <= lastPage; i++) {
      if (
        i === 1 ||
        i === lastPage ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== 0) {
        pages.push(0);
      }
    }

    return pages;
  };

  const pages = getPages();

  // ✅ Typed as CSSProperties
  const getButtonStyles = (
    isActive: boolean = false,
    isDisabled: boolean = false
  ): CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '40px',
    height: '40px',
    padding: '0 12px',
    margin: '0 3px',
    borderRadius: '12px',
    border: '1px solid',
    borderColor: isActive
      ? '#E87A20'
      : isDark
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(139,90,43,0.08)',
    backgroundColor: isActive
      ? '#E87A20'
      : isDark
      ? '#1e2a4a'
      : '#FFFFFF',
    color: isActive ? '#FFFFFF' : isDark ? '#C49A6C' : '#6B4226',
    fontSize: '0.9rem',
    fontWeight: isActive ? 700 : 500,
    fontFamily: 'Cairo, sans-serif',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.4 : 1,
    transition: 'all 0.25s ease',
    boxShadow: isActive
      ? '0 4px 16px rgba(232, 122, 32, 0.3)'
      : 'none',
    transform: isActive ? 'scale(1.05)' : 'scale(1)',
    outline: 'none',
    textDecoration: 'none',
    userSelect: 'none' as const,
  });

  const handleHover = (
    e: React.MouseEvent<HTMLButtonElement>,
    isActive: boolean,
    isDisabled: boolean
  ) => {
    if (isDisabled) return;

    if (isActive) {
      e.currentTarget.style.backgroundColor = '#D46A1A';
      e.currentTarget.style.transform = 'scale(1.08)';
      e.currentTarget.style.boxShadow = '0 6px 24px rgba(232, 122, 32, 0.4)';
    } else {
      e.currentTarget.style.backgroundColor = isDark ? '#2a3a5a' : '#FDF5E6';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = isDark
        ? '0 4px 16px rgba(0,0,0,0.3)'
        : '0 4px 16px rgba(0,0,0,0.06)';
    }
  };

  const handleLeave = (
    e: React.MouseEvent<HTMLButtonElement>,
    isActive: boolean
  ) => {
    e.currentTarget.style.backgroundColor = isActive
      ? '#E87A20'
      : isDark
      ? '#1e2a4a'
      : '#FFFFFF';
    e.currentTarget.style.transform = isActive ? 'scale(1.05)' : 'scale(1)';
    e.currentTarget.style.boxShadow = isActive
      ? '0 4px 16px rgba(232, 122, 32, 0.3)'
      : 'none';
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2.5rem',
        padding: '0 8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2px',
          padding: '8px 12px',
          backgroundColor: isDark
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(139,90,43,0.02)',
          borderRadius: '16px',
          border: `1px solid ${
            isDark ? 'rgba(255,255,255,0.04)' : 'rgba(139,90,43,0.04)'
          }`,
        }}
      >
        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={getButtonStyles(false, currentPage === 1)}
          onMouseEnter={(e) => handleHover(e, false, currentPage === 1)}
          onMouseLeave={(e) => handleLeave(e, false)}
        >
          «
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={getButtonStyles(false, currentPage === 1)}
          onMouseEnter={(e) => handleHover(e, false, currentPage === 1)}
          onMouseLeave={(e) => handleLeave(e, false)}
        >
          ‹
        </button>

        {/* Pages */}
        {pages.map((page, index) => {
          if (page === 0) {
            return (
              <span
                key={`ellipsis-${index}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '36px',
                  height: '36px',
                  color: isDark ? '#C49A6C' : '#6B4226',
                  opacity: 0.5,
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.9rem',
                }}
              >
                …
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={getButtonStyles(isActive, false)}
              onMouseEnter={(e) => handleHover(e, isActive, false)}
              onMouseLeave={(e) => handleLeave(e, isActive)}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          style={getButtonStyles(false, currentPage === lastPage)}
          onMouseEnter={(e) => handleHover(e, false, currentPage === lastPage)}
          onMouseLeave={(e) => handleLeave(e, false)}
        >
          ›
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(lastPage)}
          disabled={currentPage === lastPage}
          style={getButtonStyles(false, currentPage === lastPage)}
          onMouseEnter={(e) => handleHover(e, false, currentPage === lastPage)}
          onMouseLeave={(e) => handleLeave(e, false)}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default AnnouncementPagination;