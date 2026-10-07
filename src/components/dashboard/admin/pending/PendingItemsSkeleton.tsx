import { motion } from 'framer-motion';

/**
 * Skeleton for PendingItemsPanel
 * Matches the actual layout:
 * - Row 1: 3 cards (reports, verifications, featured)
 * - Row 2: 1 full-width list card
 */
const PendingItemsSkeleton = () => {
  const Bone = ({ height = '100%' }: { height?: string }) => (
    <motion.div
      animate={{ opacity: [0.35, 0.75, 0.35] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        height,
        borderRadius: '8px',
        backgroundColor: 'var(--border-color)',
        width: '100%',
      }}
    />
  );

  const CardShell = ({
    children,
    color,
  }: {
    children: React.ReactNode;
    color: string;
  }) => (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.15rem',
        overflow: 'hidden',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '4px',
          backgroundColor: color,
          opacity: 0.4,
        }}
      />
      {children}
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      {/* ============================================ */}
      {/* Row 1: 3 Cards */}
      {/* ============================================ */}
      <div
        className="pending-skeleton-top-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
          marginBottom: '12px',
          width: '100%',
        }}
      >
        {/* Card 1: Reports */}
        <CardShell color="#DC3545">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bone height="40px" />
              <div style={{ width: '120px' }}>
                <Bone height="14px" />
              </div>
            </div>
            <div style={{ width: '50px' }}>
              <Bone height="28px" />
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              marginBottom: '12px',
            }}
          >
            <Bone height="40px" />
            <Bone height="40px" />
            <Bone height="40px" />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <Bone height="36px" />
          </div>
          <div style={{ marginTop: 'auto' }}>
            <Bone height="36px" />
          </div>
        </CardShell>

        {/* Card 2: Verifications */}
        <CardShell color="#17A2B8">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bone height="40px" />
              <div style={{ width: '120px' }}>
                <Bone height="14px" />
              </div>
            </div>
            <div style={{ width: '50px' }}>
              <Bone height="28px" />
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <Bone height="36px" />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <Bone height="46px" />
          </div>
          <div style={{ marginTop: 'auto' }}>
            <Bone height="36px" />
          </div>
        </CardShell>

        {/* Card 3: Featured */}
        <CardShell color="#9C27B0">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bone height="40px" />
              <div style={{ width: '120px' }}>
                <Bone height="14px" />
              </div>
            </div>
            <div style={{ width: '50px' }}>
              <Bone height="28px" />
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Bone height="38px" />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <Bone height="36px" />
          </div>
          <div style={{ marginTop: 'auto' }}>
            <Bone height="36px" />
          </div>
        </CardShell>
      </div>

      {/* ============================================ */}
      {/* Row 2: 1 FULL-WIDTH list skeleton */}
      {/* ============================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '12px',
          width: '100%',
        }}
      >
        <CardShell color="#FFC107">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bone height="40px" />
              <div style={{ width: '120px' }}>
                <Bone height="14px" />
              </div>
            </div>
            <div style={{ width: '30px' }}>
              <Bone height="24px" />
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '6px',
            }}
          >
            <Bone height="48px" />
            <Bone height="48px" />
            <Bone height="48px" />
            <Bone height="48px" />
          </div>
        </CardShell>
      </div>

      {/* ============================================ */}
      {/* Responsive Breakpoints */}
      {/* ============================================ */}
      <style>{`
        @media (max-width: 900px) {
          .pending-skeleton-top-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 640px) {
          .pending-skeleton-top-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PendingItemsSkeleton;