import { Card } from 'react-bootstrap';

interface HelpRequestCardSkeletonProps {
  count?: number;
}

const HelpRequestCardSkeleton = ({
  count = 6,
}: HelpRequestCardSkeletonProps) => {
  return (
    <>
      <div className="hr-skel-grid">
        {Array.from({ length: count }).map((_, i) => (
          <Card
            key={i}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '18px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              className="hr-skel-shimmer"
              style={{ width: '100%', height: '170px' }}
            />
            <Card.Body
              style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                className="hr-skel-shimmer"
                style={{ height: '16px', width: '85%', borderRadius: '6px' }}
              />
              <div
                className="hr-skel-shimmer"
                style={{ height: '12px', width: '65%', borderRadius: '6px' }}
              />
              <div
                className="hr-skel-shimmer"
                style={{ height: '30px', width: '40%', borderRadius: '8px' }}
              />
            </Card.Body>
          </Card>
        ))}
      </div>

      <style>{`
        .hr-skel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .hr-skel-shimmer {
          background-color: var(--border-color);
          animation: hrSkelPulse 1.5s ease-in-out infinite;
        }
        @keyframes hrSkelPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </>
  );
};

export default HelpRequestCardSkeleton;