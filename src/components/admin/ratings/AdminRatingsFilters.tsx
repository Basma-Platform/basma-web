import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaSortAmountDown } from 'react-icons/fa';

export type AdminRatingSort =
  | 'newest'
  | 'oldest'
  | 'highest'
  | 'lowest';

export type AdminRatingValueFilter = 'all' | 1 | 2 | 3 | 4 | 5;

interface AdminRatingsFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  ratingFilter: AdminRatingValueFilter;
  onRatingFilterChange: (v: AdminRatingValueFilter) => void;
  sort: AdminRatingSort;
  onSortChange: (v: AdminRatingSort) => void;
  onClear: () => void;
  isSearching?: boolean;
  resultsCount?: number;
}

const AdminRatingsFilters = ({
  search,
  onSearchChange,
  ratingFilter,
  onRatingFilterChange,
  sort,
  onSortChange,
  onClear,
  isSearching = false,
  resultsCount,
}: AdminRatingsFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearchChange(localSearch), 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localSearch, onSearchChange]);

  useEffect(() => setLocalSearch(search), [search]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
    };
    if (showSort) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showSort]);

  const sortOptions: { value: AdminRatingSort; label: string }[] = [
    { value: 'newest', label: 'الأحدث أولاً' },
    { value: 'oldest', label: 'الأقدم أولاً' },
    { value: 'highest', label: 'الأعلى تقييماً' },
    { value: 'lowest', label: 'الأدنى تقييماً' },
  ];

  const currentSortLabel =
    sortOptions.find((o) => o.value === sort)?.label || 'الأحدث أولاً';

  const hasFilter = ratingFilter !== 'all' || search.trim() !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.25rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        fontFamily: 'Cairo, sans-serif',
      }}
      dir="rtl"
    >
      {/* Row 1: Search + Sort */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '14px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 0 }}>
          <FaSearch
            size={14}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="ابحث باسم المُقيِّم أو المُقيَّم..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 42px 11px 42px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none',
              transition: 'all 0.25s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-orange)';
              e.currentTarget.style.boxShadow =
                '0 0 0 3px rgba(232,122,32,0.12)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch('')}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="مسح"
            >
              <FaTimes size={12} />
            </button>
          )}
          {isSearching && localSearch && (
            <span
              className="spinner-border spinner-border-sm"
              style={{
                position: 'absolute',
                left: '38px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--primary-orange)',
                width: '14px',
                height: '14px',
                borderWidth: '1.5px',
              }}
            />
          )}
        </div>

        {/* Sort dropdown */}
        <div
          ref={sortRef}
          style={{ position: 'relative', flex: '0 0 auto', minWidth: '170px' }}
        >
          <button
            type="button"
            onClick={() => setShowSort((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              width: '100%',
              padding: '11px 14px',
              borderRadius: '12px',
              border: `1px solid ${
                showSort ? 'var(--primary-orange)' : 'var(--border-color)'
              }`,
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: 0,
              }}
            >
              <FaSortAmountDown size={12} color="var(--primary-orange)" />
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {currentSortLabel}
              </span>
            </span>
          </button>

          {showSort && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                left: 0,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
                padding: '6px',
                zIndex: 100,
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
                      setShowSort(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      padding: '9px 12px',
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
                      fontWeight: active ? 700 : 600,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* Row 2: Rating filter tabs */}
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
            gap: '6px',
            backgroundColor: 'var(--bg-input)',
            padding: '5px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            flex: '1 1 auto',
          }}
        >
          {(
            [
              { v: 'all' as const, label: 'الكل' },
              { v: 5 as const, label: '5 ★' },
              { v: 4 as const, label: '4 ★' },
              { v: 3 as const, label: '3 ★' },
              { v: 2 as const, label: '2 ★' },
              { v: 1 as const, label: '1 ★' },
            ]
          ).map((opt) => {
            const active = ratingFilter === opt.v;
            return (
              <button
                key={String(opt.v)}
                type="button"
                onClick={() => onRatingFilterChange(opt.v)}
                style={{
                  flex: '1 1 auto',
                  minWidth: 'fit-content',
                  padding: '7px 16px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: active ? 'var(--bg-card)' : 'transparent',
                  color: active ? 'var(--primary-orange)' : 'var(--text-muted)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: active ? 700 : 600,
                  cursor: 'pointer',
                  boxShadow: active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: '0 1 auto',
          }}
        >
          {typeof resultsCount === 'number' && (
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {resultsCount} نتيجة
            </span>
          )}
          {hasFilter && (
            <button
              type="button"
              onClick={() => {
                onClear();
                setLocalSearch('');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                borderRadius: '9px',
                border: '1px solid rgba(220,53,69,0.3)',
                backgroundColor: 'rgba(220,53,69,0.06)',
                color: '#DC3545',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DC3545';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.06)';
                e.currentTarget.style.color = '#DC3545';
              }}
            >
              <FaTimes size={10} />
              مسح الفلاتر
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminRatingsFilters;