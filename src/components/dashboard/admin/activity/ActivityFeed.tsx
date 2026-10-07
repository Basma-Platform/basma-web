import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHistory,
  FaSyncAlt,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import ActivityItem from './ActivityItem';
import ActivityFilters, {
  type ActivityFilterState,
} from './ActivityFilters';
import ActivityFeedSkeleton from './ActivityFeedSkeleton';
import { useAdminDashboardActivity } from '../../../../hooks/useAdminDashboardActivity';

interface ActivityFeedProps {
  live?: boolean;
  withFilters?: boolean;
  maxItems?: number;
  title?: string;
  showViewAll?: boolean;
  delay?: number;
}

const DEFAULT_FILTERS: ActivityFilterState = {
  category: null,
  actor_role: null,
  sensitive: false,
};

/**
 * Activity Feed
 * - Live polling (30s) when `live=true`
 * - 2-column grid on desktop, 1 on mobile
 */
const ActivityFeed = ({
  live = false,
  withFilters = false,
  maxItems,
  title = 'النشاطات الأخيرة',
  showViewAll = false,
  delay = 0,
}: ActivityFeedProps) => {
  const {
    activities,
    meta,
    loading,
    polling,
    fetchActivity,
    fetchLive,
    startPolling,
    stopPolling,
    refresh,
  } = useAdminDashboardActivity();

  const [filters, setFilters] = useState<ActivityFilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  // ============================================
  // Initial load
  // ============================================
  useEffect(() => {
    const load = async () => {
      if (live) {
        await fetchLive(false);
      } else {
        await fetchActivity({
          page: 1,
          per_page: maxItems || 20,
          category: filters.category || undefined,
          actor_role: filters.actor_role || undefined,
          sensitive: filters.sensitive || undefined,
        });
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // Live polling
  // ============================================
  useEffect(() => {
    if (live) {
      startPolling();
      return () => stopPolling();
    }
  }, [live, startPolling, stopPolling]);

  // ============================================
  // Refetch on filter change (non-live mode)
  // ============================================
  useEffect(() => {
    if (!live) {
      setPage(1);
      fetchActivity({
        page: 1,
        per_page: maxItems || 20,
        category: filters.category || undefined,
        actor_role: filters.actor_role || undefined,
        sensitive: filters.sensitive || undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // ============================================
  // Pagination (non-live mode)
  // ============================================
  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await fetchActivity({
      page: newPage,
      per_page: maxItems || 20,
      category: filters.category || undefined,
      actor_role: filters.actor_role || undefined,
      sensitive: filters.sensitive || undefined,
    });
  };

  // ============================================
  // Display slice
  // ============================================
  const displayedActivities = useMemo(() => {
    if (maxItems && activities.length > maxItems) {
      return activities.slice(0, maxItems);
    }
    return activities;
  }, [activities, maxItems]);

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      dir="rtl"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1rem',
        overflow: 'hidden',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {/* Top Gradient Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #17A2B8, #20C9E0)',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(23,162,184,0.3)',
              position: 'relative',
            }}
          >
            <FaHistory size={15} />
            {live && (
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#28A745',
                  border: '2px solid var(--bg-card)',
                }}
              />
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'clamp(0.92rem, 1.3vw, 1rem)',
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {title}
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.68rem',
                margin: '2px 0 0',
              }}
            >
              {live ? 'تحديث تلقائي كل 30 ثانية' : `${meta?.total || 0} حدث`}
            </p>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={live ? refresh : () => handlePageChange(page)}
          disabled={loading || polling}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: loading || polling ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'Cairo, sans-serif',
            opacity: loading || polling ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading && !polling) {
              e.currentTarget.style.borderColor = 'var(--primary-orange)';
              e.currentTarget.style.color = 'var(--primary-orange)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <motion.span
            animate={{ rotate: loading || polling ? 360 : 0 }}
            transition={{
              duration: 1,
              repeat: loading || polling ? Infinity : 0,
              ease: 'linear',
            }}
            style={{ display: 'inline-flex' }}
          >
            <FaSyncAlt size={10} />
          </motion.span>
          تحديث
        </button>
      </div>

      {/* Filters */}
      {withFilters && !live && (
        <ActivityFilters
          filters={filters}
          onChange={setFilters}
          onClear={handleClearFilters}
        />
      )}

      {/* Content — 2-column grid ✅ */}
      {loading && activities.length === 0 ? (
        <ActivityFeedSkeleton count={maxItems || 6} />
      ) : displayedActivities.length === 0 ? (
        <EmptyState />
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${page}-${JSON.stringify(filters)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="admin-activity-grid"
          >
            {displayedActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {!live && meta && meta.last_page > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            style={paginationBtnStyle(page === 1)}
          >
            <FaArrowRight size={10} />
            السابق
          </button>

          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontWeight: 700,
              padding: '0 10px',
            }}
          >
            صفحة {page} من {meta.last_page}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === meta.last_page}
            style={paginationBtnStyle(page === meta.last_page)}
          >
            التالي
            <FaArrowLeft size={10} />
          </button>
        </div>
      )}

      {/* View All */}
      {showViewAll && (
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            textAlign: 'center',
          }}
        >
          <a
            href="/admin/activity-log"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--primary-orange)',
              textDecoration: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            عرض كل النشاطات
            <FaArrowLeft size={10} />
          </a>
        </div>
      )}

      {/* Grid CSS ✅ */}
      <style>{`
        .admin-activity-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .admin-activity-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
};

// ============================================
// Helpers
// ============================================

const paginationBtnStyle = (disabled: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '7px 14px',
  borderRadius: '9px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-card)',
  color: disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
  fontSize: '0.72rem',
  fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.4 : 1,
  fontFamily: 'Cairo, sans-serif',
  transition: 'all 0.2s ease',
});

const EmptyState = () => (
  <div
    style={{
      padding: '3rem 1.5rem',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontFamily: 'Cairo, sans-serif',
    }}
  >
    <div
      style={{
        width: '60px',
        height: '60px',
        margin: '0 auto 1rem',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-input)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        opacity: 0.6,
      }}
    >
      <FaHistory size={24} />
    </div>
    <p
      style={{
        margin: 0,
        fontSize: '0.82rem',
        fontWeight: 600,
      }}
    >
      لا توجد نشاطات لعرضها
    </p>
  </div>
);

export default ActivityFeed;