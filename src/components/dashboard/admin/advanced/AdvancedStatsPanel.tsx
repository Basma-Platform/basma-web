import { motion } from 'framer-motion';
import RetentionCard from './RetentionCard';
import ContentQualityCard from './ContentQualityCard';
import ModerationEfficiencyCard from './ModerationEfficiencyCard';
import SystemHealthCard from './SystemHealthCard';
import type { AdminDashboardAdvanced } from '../../../../types';

interface AdvancedStatsPanelProps {
  advanced: AdminDashboardAdvanced | null;
  loading?: boolean;
}

/**
 * Advanced Stats Panel — 2×2 grid (full page width)
 * - Desktop: 2×2
 * - Tablet: 2 columns
 * - Mobile: 1 column
 */
const AdvancedStatsPanel = ({
  advanced,
  loading = false,
}: AdvancedStatsPanelProps) => {
  // Loading skeleton
  if (loading || !advanced) {
    return (
      <div className="advanced-stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <AdvancedCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="advanced-stats-grid">
      <RetentionCard data={advanced.retention} delay={0.05} />
      <ContentQualityCard data={advanced.content_quality} delay={0.1} />
      <ModerationEfficiencyCard
        data={advanced.moderation_efficiency}
        delay={0.15}
      />
      <SystemHealthCard data={advanced.system_health} delay={0.2} />

      <style>{`
        .advanced-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          width: 100%;
        }

        @media (max-width: 640px) {
          .advanced-stats-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

// ============================================
// Single Card Skeleton — matches real cards
// ============================================
const AdvancedCardSkeleton = () => {
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

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1rem',
        overflow: 'hidden',
        minHeight: '260px',
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
          height: '3px',
          backgroundColor: 'var(--border-color)',
          opacity: 0.5,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '1rem',
        }}
      >
        <div style={{ width: '36px', flexShrink: 0 }}>
          <Bone height="36px" />
        </div>
        <div style={{ flex: 1 }}>
          <Bone height="14px" />
        </div>
      </div>

      {/* Body: 2×2 grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          flex: 1,
        }}
      >
        <Bone height="100%" />
        <Bone height="100%" />
        <Bone height="100%" />
        <Bone height="100%" />
      </div>
    </div>
  );
};

export default AdvancedStatsPanel;