import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaSortAmountDown, FaInbox } from 'react-icons/fa';
import RatingCard from '../ratings/RatingCard';
import RatingSkeleton from '../ratings/RatingSkeleton';
import Pagination from '../shared/Pagination';
import type { Rating } from '../../types';

export type ReviewSortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

interface PublicUserReviewsListProps {
  ratings: Rating[];
  loading: boolean;
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  } | null;
  sort: ReviewSortOption;
  onSortChange: (sort: ReviewSortOption) => void;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPage?: number;
}

const PublicUserReviewsList = ({
  ratings,
  loading,
  meta,
  sort,
  onSortChange,
  onPageChange,
  onPerPageChange,
  perPage = 12,
}: PublicUserReviewsListProps) => {
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions: { value: ReviewSortOption; label: string }[] = [
    { value: 'newest', label: 'الأحدث' },
    { value: 'oldest', label: 'الأقدم' },
    { value: 'highest', label: 'الأعلى تقييماً' },
    { value: 'lowest', label: 'الأدنى تقييماً' },
  ];

  const currentSortLabel =
    sortOptions.find((o) => o.value === sort)?.label || 'الأحدث';

  if (loading && ratings.length === 0) {
    return <RatingSkeleton variant="card" count={3} />;
  }

  if (!loading && ratings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '3.5rem 2rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px dashed var(--border-color)',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'rgba(255,193,7,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFC107',
          }}
        >
          <FaInbox size={30} />
        </div>
        <h3
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            fontWeight: 800,
            margin: '0 0 6px',
          }}
        >
          لا توجد تقييمات بعد
        </h3>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          لم يستقبل هذا المستخدم أي تقييم حتى الآن.
        </p>
      </motion.div>
    );
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      dir="rtl"
    >
      {/* Header: count + sort */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.82rem',
          }}
        >
          <FaStar size={12} color="#FFC107" />
          <span>
            عرض{' '}
            <strong style={{ color: 'var(--text-secondary)' }}>
              {ratings.length}
            </strong>{' '}
            من{' '}
            <strong style={{ color: 'var(--primary-orange)' }}>
              {meta?.total || 0}
            </strong>{' '}
            تقييم
          </span>
        </div>

        {/* Sort dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowSortMenu((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <FaSortAmountDown size={11} color="var(--primary-orange)" />
            {currentSortLabel}
          </button>

          <AnimatePresence>
            {showSortMenu && (
              <>
                <div
                  onClick={() => setShowSortMenu(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 5,
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    minWidth: '160px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    boxShadow: '0 12px 32px var(--shadow-md)',
                    padding: '6px',
                    zIndex: 10,
                  }}
                >
                  {sortOptions.map((opt) => {
                    const active = opt.value === sort;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onSortChange(opt.value);
                          setShowSortMenu(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'right',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: active
                            ? 'rgba(232,122,32,0.08)'
                            : 'transparent',
                          color: active
                            ? 'var(--primary-orange)'
                            : 'var(--text-secondary)',
                          fontFamily: 'Cairo, sans-serif',
                          fontSize: '0.8rem',
                          fontWeight: active ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.backgroundColor =
                              'rgba(232,122,32,0.06)';
                            e.currentTarget.style.color =
                              'var(--primary-orange)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.backgroundColor =
                              'transparent';
                            e.currentTarget.style.color =
                              'var(--text-secondary)';
                          }
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reviews list */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? 'none' : 'auto',
          transition: 'opacity 0.2s ease',
        }}
      >
        {ratings.map((rating, index) => (
          <motion.div
            key={rating.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: Math.min(index * 0.04, 0.3),
            }}
          >
            <RatingCard rating={rating} variant="public" showAnnouncement />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <Pagination
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          total={meta.total}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          isLoading={loading}
          perPageOptions={[6, 12, 24, 48]}
          itemLabel="تقييم"
        />
      )}
    </div>
  );
};

export default PublicUserReviewsList;