import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaSortAmountDown } from 'react-icons/fa';
import { FUND_THEME } from '../../../utils/helpRequestHelpers';

export type AchievementsSortOption = 'newest' | 'oldest' | 'order';

interface AchievementsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: AchievementsSortOption;
  onSortChange: (value: AchievementsSortOption) => void;
  isSearching?: boolean;
}

const SORT_OPTIONS: Array<{ value: AchievementsSortOption; label: string }> = [
  { value: 'newest', label: 'الأحدث أولاً' },
  { value: 'oldest', label: 'الأقدم أولاً' },
  { value: 'order', label: 'حسب ترتيب الإدارة' },
];

const AchievementsFilters = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
  isSearching = false,
}: AchievementsFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [showSort, setShowSort] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  // Debounce: 500ms (server-side — slightly longer than client-side)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChangeRef.current(localSearch);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localSearch]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
    };
    if (showSort) {
      document.addEventListener('mousedown', onClick);
    }
    return () => document.removeEventListener('mousedown', onClick);
  }, [showSort]);

  const handleClear = useCallback(() => setLocalSearch(''), []);

  const handlePickSort = useCallback(
    (value: AchievementsSortOption) => {
      onSortChange(value);
      setShowSort(false);
    },
    [onSortChange]
  );

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'الأحدث أولاً';

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
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {/* Search */}
      <div
        style={{
          position: 'relative',
          flex: '1 1 260px',
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
            transition: 'all 0.25s ease',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = FUND_THEME.accent;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${FUND_THEME.accentSoft}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {localSearch && (
          <button
            type="button"
            onClick={handleClear}
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

      {/* Sort dropdown */}
      <div
        ref={sortRef}
        style={{ position: 'relative', minWidth: '180px' }}
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
            padding: '10px 14px',
            borderRadius: '11px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-secondary)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: 0,
              flex: 1,
            }}
          >
            <FaSortAmountDown size={11} color={FUND_THEME.accent} />
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
            }}
          >
            {SORT_OPTIONS.map((opt) => {
              const active = opt.value === sort;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handlePickSort(opt.value)}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: active
                      ? 'rgba(23,162,184,0.08)'
                      : 'transparent',
                    color: active
                      ? FUND_THEME.accent
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
                        'rgba(23,162,184,0.06)';
                      e.currentTarget.style.color = FUND_THEME.accent;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementsFilters;