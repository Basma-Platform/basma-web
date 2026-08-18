import { Pagination } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';

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
        pages.push(0); // 0 represents ellipsis
      }
    }

    return pages;
  };

  const pages = getPages();

  return (
    <Pagination
      className="justify-content-center"
      style={{
        marginTop: '2rem',
        direction: 'ltr',
      }}
    >
      <Pagination.First
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        style={{
          backgroundColor: isDark ? '#16213e' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
          color: isDark ? '#C49A6C' : '#6B4226',
        }}
      />
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          backgroundColor: isDark ? '#16213e' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
          color: isDark ? '#C49A6C' : '#6B4226',
        }}
      />

      {pages.map((page, index) => {
        if (page === 0) {
          return <Pagination.Ellipsis key={`ellipsis-${index}`} />;
        }

        return (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
            style={{
              backgroundColor: page === currentPage ? '#E87A20' : isDark ? '#16213e' : '#FFFFFF',
              borderColor: page === currentPage ? '#E87A20' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
              color: page === currentPage ? '#FFFFFF' : isDark ? '#C49A6C' : '#6B4226',
              fontWeight: page === currentPage ? 700 : 400,
            }}
          >
            {page}
          </Pagination.Item>
        );
      })}

      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        style={{
          backgroundColor: isDark ? '#16213e' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
          color: isDark ? '#C49A6C' : '#6B4226',
        }}
      />
      <Pagination.Last
        onClick={() => onPageChange(lastPage)}
        disabled={currentPage === lastPage}
        style={{
          backgroundColor: isDark ? '#16213e' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
          color: isDark ? '#C49A6C' : '#6B4226',
        }}
      />
    </Pagination>
  );
};

export default AnnouncementPagination;