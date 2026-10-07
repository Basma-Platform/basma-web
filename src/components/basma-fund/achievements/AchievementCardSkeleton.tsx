interface AchievementCardSkeletonProps {
  count?: number;
}

const AchievementCardSkeleton = ({
  count = 5,
}: AchievementCardSkeletonProps) => {
  return (
    <>
      <div className="ach-skel-track">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="ach-skel-card">
            <div
              className="ach-skel-shimmer"
              style={{ width: '100%', height: '170px' }}
            />
            <div style={{ padding: '14px' }}>
              <div
                className="ach-skel-shimmer"
                style={{
                  height: '14px',
                  width: '85%',
                  borderRadius: '6px',
                  marginBottom: '8px',
                }}
              />
              <div
                className="ach-skel-shimmer"
                style={{ height: '10px', width: '60%', borderRadius: '6px' }}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .ach-skel-track {
          display: flex;
          gap: 20px;
          padding: 8px 4px;
        }
        .ach-skel-card {
          width: 300px;
          flex-shrink: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          overflow: hidden;
        }
        .ach-skel-shimmer {
          background-color: var(--border-color);
          animation: achSkelPulse 1.5s ease-in-out infinite;
        }
        @keyframes achSkelPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </>
  );
};

export default AchievementCardSkeleton;