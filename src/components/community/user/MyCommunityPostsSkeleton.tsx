import { useTheme } from '../../../context/ThemeContext';

interface MyCommunityPostsSkeletonProps {
  count?: number;
}

const MyCommunityPostsSkeleton = ({
  count = 3,
}: MyCommunityPostsSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
};

const SkeletonCard = () => {
  const { isDark } = useTheme();

  const shimmerBg = isDark
    ? 'rgba(255,255,255,0.04)'
    : 'rgba(0,0,0,0.05)';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '18px',
        overflow: 'hidden',
        marginBottom: '1.25rem',
        display: 'flex',
        flexDirection: 'row',
        minHeight: '140px',
      }}
    >
      {/* Thumbnail placeholder */}
      <div
        style={{
          width: '140px',
          flexShrink: 0,
          backgroundColor: shimmerBg,
          animation: 'myPostsSkeletonPulse 1.6s ease-in-out infinite',
        }}
      />

      {/* Body */}
      <div style={{ flex: 1, padding: '1rem 1.25rem', minWidth: 0 }}>
        {/* Status + type badges row */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '0.75rem',
          }}
        >
          <div
            style={{
              width: '70px',
              height: '20px',
              borderRadius: '20px',
              backgroundColor: shimmerBg,
              animation: 'myPostsSkeletonPulse 1.6s ease-in-out infinite',
            }}
          />
          <div
            style={{
              width: '60px',
              height: '20px',
              borderRadius: '20px',
              backgroundColor: shimmerBg,
              animation: 'myPostsSkeletonPulse 1.6s ease-in-out infinite',
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            width: '75%',
            height: '18px',
            borderRadius: '6px',
            backgroundColor: shimmerBg,
            marginBottom: '10px',
            animation: 'myPostsSkeletonPulse 1.6s ease-in-out infinite',
          }}
        />

        {/* Description */}
        <div
          style={{
            width: '90%',
            height: '12px',
            borderRadius: '6px',
            backgroundColor: shimmerBg,
            marginBottom: '8px',
            animation: 'myPostsSkeletonPulse 1.6s ease-in-out infinite',
          }}
        />

        {/* Meta chips */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          {[70, 90, 60].map((width, i) => (
            <div
              key={i}
              style={{
                width: `${width}px`,
                height: '16px',
                borderRadius: '6px',
                backgroundColor: shimmerBg,
                animation: 'myPostsSkeletonPulse 1.6s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes myPostsSkeletonPulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MyCommunityPostsSkeleton;