import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaTimes,
  FaSortAmountDown,
  FaToggleOn,
  FaToggleOff,
  FaStar,
  FaPlus,
} from 'react-icons/fa';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';

export type AdminAchievementSort =
  | 'newest'
  | 'oldest'
  | 'order'
  | 'date_desc';

export type AdminAchievementStatusFilter = 'all' | 'active' | 'inactive';

export type AdminAchievementFeaturedFilter = 'all' | 'featured' | 'normal';

interface AdminAchievementFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: AdminAchievementStatusFilter;
  onStatusChange: (value: AdminAchievementStatusFilter) => void;

  featured: AdminAchievementFeaturedFilter;
  onFeaturedChange: (value: AdminAchievementFeaturedFilter) => void;

  sort: AdminAchievementSort;
  onSortChange: (value: AdminAchievementSort) => void;

  onClear: () => void;
  onAddClick: () => void;

  isSearching?: boolean;
  resultsCount?: number;
}

const SORT_OPTIONS: { value: AdminAchievementSort; label: string }[] = [
  { value: 'newest', label: 'الأحدث أولاً' },
  { value: 'oldest', label: 'الأقدم أولاً' },
  { value: 'order', label: 'حسب الترتيب' },
  { value: 'date_desc', label: 'أحدث تاريخ' },
];

const AdminAchievementFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  featured,
  onFeaturedChange,
  sort,
  onSortChange,
  onClear,
  onAddClick,
  isSearching = false,
  resultsCount,
}: AdminAchievementFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [showSort, setShowSort] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(localSearch);
    }, 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
    };
    if (showSort) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSort]);

  const handleClear = useCallback(() => {
    setLocalSearch('');
    onClear();
  }, [onClear]);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'الأحدث أولاً';

  const hasActiveFilters =
    status !== 'all' ||
    featured !== 'all' ||
    sort !== 'newest' ||
    search.trim() !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1rem 1.1rem',
        marginBottom: '1.25rem',
        boxShadow: '0 2px 12px var(--shadow-sm)',
        fontFamily: 'Cairo, sans-serif',
      }}
      dir="rtl"
    >
      {/* Row 1: Search + Sort + Add */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: '1 1 240px',
            minWidth: 0,
          }}
        >
          <FaSearch
            size={13}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="ابحث في الإنجازات..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 40px 10px 40px',
              borderRadius: '11px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch('')}
              aria-label="مسح"
              style={{
                position: 'absolute',
                left: '10px',
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
            >
              <FaTimes size={11} />
            </button>
          )}
          {isSearching && localSearch && (
            <span
              className="spinner-border spinner-border-sm"
              style={{
                position: 'absolute',
                left: '36px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: FUND_THEME.accent,
                width: '13px',
                height: '13px',
                borderWidth: '1.5px',
              }}
            />
          )}
        </div>

        <div
          ref={sortRef}
          style={{
            position: 'relative',
            flex: '0 1 auto',
            minWidth: '160px',
          }}
        >
          <button
            type="button"
            onClick={() => setShowSort((v) => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '11px',
              border: `1px solid ${
                showSort ? FUND_THEME.accent : 'var(--border-color)'
              }`,
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                minWidth: 0,
                flex: 1,
              }}
            >
              <FaSortAmountDown size={12} color={FUND_THEME.accent} />
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
                boxShadow: '0 12px 32px var(--shadow-md)',
                padding: '6px',
                zIndex: 100,
                minWidth: '180px',
              }}
            >
              {SORT_OPTIONS.map((opt) => {
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
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: active
                        ? `${FUND_THEME.accent}12`
                        : 'transparent',
                      color: active
                        ? FUND_THEME.accent
                        : 'var(--text-secondary)',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: active ? 700 : 500,
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

        <button
          type="button"
          onClick={onAddClick}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '11px',
            border: 'none',
            background: FUND_THEME.gradient,
            color: '#FFFFFF',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: `0 6px 18px ${FUND_THEME.shadow}`,
            whiteSpace: 'nowrap',
          }}
        >
          <FaPlus size={11} />
          إنجاز جديد
        </button>
      </div>

      {/* Row 2: Filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '4px',
            padding: '4px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap',
          }}
        >
          {(
            [
              { value: 'all', label: 'الكل' },
              { value: 'active', label: 'مفعّل' },
              { value: 'inactive', label: 'معطّل' },
            ] as const
          ).map((tab) => {
            const active = status === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusChange(tab.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: active
                    ? 'var(--bg-card)'
                    : 'transparent',
                  color: active
                    ? FUND_THEME.accent
                    : 'var(--text-muted)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: active ? 700 : 600,
                  cursor: 'pointer',
                  boxShadow: active ? '0 2px 8px var(--shadow-sm)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.value === 'active' ? (
                  <FaToggleOn size={11} />
                ) : tab.value === 'inactive' ? (
                  <FaToggleOff size={11} />
                ) : null}
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '4px',
            padding: '4px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap',
          }}
        >
          {(
            [
              { value: 'all', label: 'الكل' },
              { value: 'featured', label: 'مميّز' },
              { value: 'normal', label: 'عادي' },
            ] as const
          ).map((tab) => {
            const active = featured === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onFeaturedChange(tab.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: active
                    ? 'var(--bg-card)'
                    : 'transparent',
                  color: active ? '#FFB800' : 'var(--text-muted)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: active ? 700 : 600,
                  cursor: 'pointer',
                  boxShadow: active ? '0 2px 8px var(--shadow-sm)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.value === 'featured' && <FaStar size={10} />}
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginRight: 'auto',
            flexWrap: 'wrap',
          }}
        >
          {typeof resultsCount === 'number' && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {resultsCount} نتيجة
            </span>
          )}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(220,53,69,0.3)',
                backgroundColor: 'rgba(220,53,69,0.06)',
                color: '#DC3545',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
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

export default AdminAchievementFilters;