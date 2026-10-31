import { useTheme } from '../../../context/ThemeContext';

interface CommunityPostSkeletonProps {
  count?: number;
}

const CommunityPostSkeleton = ({ count = 1 }: CommunityPostSkeletonProps) => {
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
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 16px var(--shadow-sm)',
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          backgroundColor: shimmerBg,
          animation: 'communitySkeletonPulse 1.6s ease-in-out infinite',
        }}
      />

      <div style={{ padding: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '22px',
              borderRadius: '20px',
              backgroundColor: shimmerBg,
              animation: 'communitySkeletonPulse 1.6s ease-in-out infinite',
            }}
          />
          <div
            style={{
              width: '60px',
              height: '16px',
              borderRadius: '6px',
              backgroundColor: shimmerBg,
              animation: 'communitySkeletonPulse 1.6s ease-in-out infinite',
            }}
          />
        </div>

        <div
          style={{
            width: '70%',
            height: '22px',
            borderRadius: '6px',
            backgroundColor: shimmerBg,
            marginBottom: '12px',
            animation: 'communitySkeletonPulse 1.6s ease-in-out infinite',
          }}
        />

        {[90, 80, 60].map((width, i) => (
          <div
            key={i}
            style={{
              width: `${width}%`,
              height: '14px',
              borderRadius: '6px',
              backgroundColor: shimmerBg,
              marginBottom: '8px',
              animation: 'communitySkeletonPulse 1.6s ease-in-out infinite',
            }}
          />
        ))}

        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {[80, 100, 70].map((width, i) => (
            <div
              key={i}
              style={{
                width: `${width}px`,
                height: '20px',
                borderRadius: '6px',
                backgroundColor: shimmerBg,
                animation: 'communitySkeletonPulse 1.6s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes communitySkeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CommunityPostSkeleton;