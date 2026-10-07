interface MyHelpRequestsSkeletonProps {
  count?: number;
}

const MyHelpRequestsSkeleton = ({
  count = 6,
}: MyHelpRequestsSkeletonProps) => {
  return (
    <>
      <div className="my-hr-skel-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                className="my-hr-skel-shimmer"
                style={{
                  height: '16px',
                  width: '60%',
                  borderRadius: '6px',
                }}
              />
              <div
                className="my-hr-skel-shimmer"
                style={{
                  height: '22px',
                  width: '70px',
                  borderRadius: '8px',
                }}
              />
            </div>
            <div
              className="my-hr-skel-shimmer"
              style={{
                height: '12px',
                width: '85%',
                borderRadius: '6px',
              }}
            />
            <div
              className="my-hr-skel-shimmer"
              style={{
                height: '60px',
                borderRadius: '10px',
              }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '8px',
              }}
            >
              <div
                className="my-hr-skel-shimmer"
                style={{ height: '40px', borderRadius: '10px' }}
              />
              <div
                className="my-hr-skel-shimmer"
                style={{ height: '40px', borderRadius: '10px' }}
              />
              <div
                className="my-hr-skel-shimmer"
                style={{ height: '40px', borderRadius: '10px' }}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .my-hr-skel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .my-hr-skel-shimmer {
          background-color: var(--border-color);
          animation: myHrSkelPulse 1.5s ease-in-out infinite;
        }
        @keyframes myHrSkelPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
        @media (max-width: 380px) {
          .my-hr-skel-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default MyHelpRequestsSkeleton;