import { motion } from 'framer-motion';
import { FaHourglassHalf } from 'react-icons/fa';
import PendingReportsCard from './PendingReportsCard';
import PendingVerificationsCard from './PendingVerificationsCard';
import PendingFeaturedCard from './PendingFeaturedCard';
import NearWarningUsersList from './NearWarningUsersList';
import FrequentlyReportedList from './FrequentlyReportedList';
import PendingItemsSkeleton from './PendingItemsSkeleton';
import type { AdminDashboardPending } from '../../../../types';

interface PendingItemsPanelProps {
  pending: AdminDashboardPending | null;
  loading?: boolean;
}

/**
 * Pending Items Panel
 * - Grid of 3 cards (reports, verifications, featured)
 * - 2 alert lists below (near warning, frequently reported)
 * - Skeleton while loading
 * - Responsive: 1 col mobile → 3 col desktop
 */
const PendingItemsPanel = ({
  pending,
  loading = false,
}: PendingItemsPanelProps) => {
  // Loading state
  if (loading || !pending) {
    return <PendingItemsSkeleton />;
  }

  // Empty state (nothing pending)
  const nothingPending =
    pending.reports.total === 0 &&
    pending.verifications.total === 0 &&
    pending.featured_requests.total === 0;

  if (nothingPending) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        dir="rtl"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1.5px dashed rgba(40,167,69,0.3)',
          borderRadius: '16px',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(40,167,69,0.15), rgba(40,167,69,0.05))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#28A745',
          }}
        >
          <FaHourglassHalf size={28} />
        </div>
        <h4
          style={{
            color: '#28A745',
            fontSize: '1.05rem',
            fontWeight: 800,
            marginBottom: '6px',
          }}
        >
          لا توجد عناصر معلقة 🎉
        </h4>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          كل الطلبات والبلاغات تمت معالجتها. عمل رائع!
        </p>
      </motion.div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Top Row: 3 Cards */}
      <div
        className="pending-top-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
          marginBottom:
            pending.near_warning_threshold.length > 0 ||
            pending.frequently_reported.length > 0
              ? '12px'
              : '0',
          width: '100%',
        }}
      >
        <PendingReportsCard data={pending.reports} delay={0.05} />
        <PendingVerificationsCard data={pending.verifications} delay={0.1} />
        <PendingFeaturedCard data={pending.featured_requests} delay={0.15} />
      </div>

      {/* Bottom Row: 2 Lists (only if data exists) */}
      {(pending.near_warning_threshold.length > 0 ||
        pending.frequently_reported.length > 0) && (
        <div
          className="pending-bottom-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px',
            width: '100%',
          }}
        >
          {pending.near_warning_threshold.length > 0 && (
            <NearWarningUsersList
              users={pending.near_warning_threshold}
              delay={0.2}
            />
          )}
          {pending.frequently_reported.length > 0 && (
            <FrequentlyReportedList
              users={pending.frequently_reported}
              delay={0.25}
            />
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .pending-top-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 640px) {
          .pending-top-grid,
          .pending-bottom-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PendingItemsPanel;