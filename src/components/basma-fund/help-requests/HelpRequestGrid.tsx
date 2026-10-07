import HelpRequestCard from './HelpRequestCard';
import HelpRequestCardSkeleton from './HelpRequestCardSkeleton';
import HelpRequestEmptyState from './HelpRequestEmptyState';
import type { HelpRequestPublic } from '../../../types';

interface HelpRequestGridProps {
  requests: HelpRequestPublic[];
  loading?: boolean;
  skeletonCount?: number;
}

/**
 * Responsive grid of public help-request cards.
 * Used in: BasmaFundPage
 */
const HelpRequestGrid = ({
  requests,
  loading = false,
  skeletonCount = 6,
}: HelpRequestGridProps) => {
  if (loading && requests.length === 0) {
    return <HelpRequestCardSkeleton count={skeletonCount} />;
  }

  if (!loading && requests.length === 0) {
    return <HelpRequestEmptyState />;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '16px',
      }}
    >
      {requests.map((req) => (
        <HelpRequestCard key={req.id} request={req} />
      ))}
    </div>
  );
};

export default HelpRequestGrid;