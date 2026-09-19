import RatingSkeleton from '../../ratings/RatingSkeleton';

interface MyReviewsSkeletonProps {
  variant?: 'list' | 'stats';
  count?: number;
}

const MyReviewsSkeleton = ({
  variant = 'list',
  count = 4,
}: MyReviewsSkeletonProps) => {
  if (variant === 'stats') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
        dir="rtl"
      >
        <RatingSkeleton variant="stats" />
        <RatingSkeleton variant="distribution" />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: '0px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      dir="rtl"
    >
      <RatingSkeleton variant="card" count={count} />
    </div>
  );
};

export default MyReviewsSkeleton;