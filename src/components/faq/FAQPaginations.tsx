interface FAQPaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  isDark: boolean;
}

const FAQPagination = ({
  currentPage,
  lastPage,
  onPageChange,
  isDark,
}: FAQPaginationProps) => {
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

  // Base button styles using theme variables
  const getButtonStyle = (isActive: boolean = false, isDisabled: boolean = false) => ({
    backgroundColor: isActive
      ? '#E87A20'
      : isDark
      ? 'var(--bg-card)'
      : 'var(--bg-white)',
    borderColor: isActive
      ? '#E87A20'
      : isDark
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(139,90,43,0.12)',
    color: isActive
      ? '#FFFFFF'
      : isDark
      ? 'var(--text-muted)'
      : 'var(--text-secondary)',
    borderRadius: '8px',
    padding: '8px 14px',
    margin: '0 3px',
    fontSize: '0.9rem',
    fontWeight: isActive ? 700 : 400,
    fontFamily: 'Cairo, sans-serif',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.4 : 1,
    transition: 'all 0.25s ease',
    border: `1px solid ${
      isActive
        ? '#E87A20'
        : isDark
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(139,90,43,0.12)'
    }`,
    outline: 'none',
    minWidth: '38px',
    height: '38px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  // Hover styles (not active and not disabled)
  const getHoverStyle = (isActive: boolean, isDisabled: boolean) => {
    if (isActive || isDisabled) return {};
    return {
      backgroundColor: isDark
        ? 'rgba(232, 122, 32, 0.15)'
        : 'rgba(232, 122, 32, 0.08)',
      borderColor: '#E87A20',
      color: '#E87A20',
      transform: 'scale(1.05)',
    };
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem',
        padding: '0 8px',
        direction: 'ltr',
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
          borderRadius: '12px',
          border: `1px solid ${
            isDark ? 'rgba(255,255,255,0.04)' : 'rgba(139,90,43,0.04)'
          }`,
        }}
      >
        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={{
            ...getButtonStyle(false, currentPage === 1),
            ...(currentPage !== 1 ? getHoverStyle(false, false) : {}),
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              Object.assign(e.currentTarget.style, getHoverStyle(false, false));
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              Object.assign(e.currentTarget.style, getButtonStyle(false, false));
            }
          }}
        >
          «
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...getButtonStyle(false, currentPage === 1),
            ...(currentPage !== 1 ? getHoverStyle(false, false) : {}),
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              Object.assign(e.currentTarget.style, getHoverStyle(false, false));
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              Object.assign(e.currentTarget.style, getButtonStyle(false, false));
            }
          }}
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
                  minWidth: '30px',
                  height: '38px',
                  color: isDark ? 'var(--text-muted)' : 'var(--text-secondary)',
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
              style={{
                ...getButtonStyle(isActive, false),
                ...(isActive
                  ? {
                      boxShadow: '0 2px 8px rgba(232, 122, 32, 0.3)',
                    }
                  : {}),
                ...(!isActive ? getHoverStyle(false, false) : {}),
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  Object.assign(e.currentTarget.style, getHoverStyle(false, false));
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  Object.assign(e.currentTarget.style, getButtonStyle(false, false));
                }
              }}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          style={{
            ...getButtonStyle(false, currentPage === lastPage),
            ...(currentPage !== lastPage ? getHoverStyle(false, false) : {}),
          }}
          onMouseEnter={(e) => {
            if (currentPage !== lastPage) {
              Object.assign(e.currentTarget.style, getHoverStyle(false, false));
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== lastPage) {
              Object.assign(e.currentTarget.style, getButtonStyle(false, false));
            }
          }}
        >
          ›
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(lastPage)}
          disabled={currentPage === lastPage}
          style={{
            ...getButtonStyle(false, currentPage === lastPage),
            ...(currentPage !== lastPage ? getHoverStyle(false, false) : {}),
          }}
          onMouseEnter={(e) => {
            if (currentPage !== lastPage) {
              Object.assign(e.currentTarget.style, getHoverStyle(false, false));
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== lastPage) {
              Object.assign(e.currentTarget.style, getButtonStyle(false, false));
            }
          }}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default FAQPagination;