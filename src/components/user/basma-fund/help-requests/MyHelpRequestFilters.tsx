import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaSortAmountDown,
  FaLayerGroup,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaArchive,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';

// ============================================
// Types
// ============================================
export type MyHelpRequestStatusFilter =
  | 'all'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'archived';

export type MyHelpRequestSort = 'newest' | 'oldest' | 'most_viewed';

// ============================================
// Tabs config
// ============================================
interface TabConfig {
  value: MyHelpRequestStatusFilter;
  label: string;
  Icon: IconType;
  color: string;
}

const STATUS_TABS: TabConfig[] = [
  { value: 'all', label: 'الكل', Icon: FaLayerGroup, color: '#8B5A2B' },
  {
    value: 'pending',
    label: 'قيد المراجعة',
    Icon: FaHourglassHalf,
    color: '#FFB800',
  },
  {
    value: 'approved',
    label: 'منشور',
    Icon: FaCheckCircle,
    color: '#28A745',
  },
  {
    value: 'rejected',
    label: 'مرفوض',
    Icon: FaTimesCircle,
    color: '#DC3545',
  },
  {
    value: 'archived',
    label: 'مؤرشف',
    Icon: FaArchive,
    color: '#6B4226',
  },
];

const SORT_OPTIONS: { value: MyHelpRequestSort; label: string }[] = [
  { value: 'newest', label: 'الأحدث أولاً' },
  { value: 'oldest', label: 'الأقدم أولاً' },
  { value: 'most_viewed', label: 'الأكثر مشاهدة' },
];

// ============================================
// Props
// ============================================
interface MyHelpRequestFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: MyHelpRequestStatusFilter;
  onStatusChange: (status: MyHelpRequestStatusFilter) => void;

  sort: MyHelpRequestSort;
  onSortChange: (sort: MyHelpRequestSort) => void;

  onClear: () => void;

  isSearching?: boolean;
  resultsCount?: number;
}

// ============================================
// Component
// ============================================
const MyHelpRequestFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onClear,
  isSearching = false,
  resultsCount,
}: MyHelpRequestFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(localSearch);
    }, 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localSearch, onSearchChange]);

  // Sync from parent
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    };
    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSortDropdown]);

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sort)?.label || 'الأحدث أولاً';

  const hasActiveFilters =
    status !== 'all' || sort !== 'newest' || search.trim() !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="my-hr-filters"
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
      {/* ============================================ */}
      {/* Row 1: Search + Sort + Result count + Clear */}
      {/* ============================================ */}
      <div className="my-hr-filters__row1">
        {/* Search */}
        <div className="my-hr-filters__search">
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
            placeholder="ابحث في طلباتك..."
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
              e.currentTarget.style.boxShadow = `0 0 0 3px ${FUND_THEME.accent}20`;
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
              aria-label="مسح البحث"
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
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '22px',
                height: '22px',
              }}
            >
              <FaTimes size={10} />
            </button>
          )}

          {isSearching && localSearch && (
            <span
              style={{
                position: 'absolute',
                left: '36px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                className="spinner-border spinner-border-sm"
                style={{
                  width: '13px',
                  height: '13px',
                  color: FUND_THEME.accent,
                  borderWidth: '1.5px',
                }}
              />
            </span>
          )}
        </div>

        {/* Sort dropdown */}
        <div ref={sortDropdownRef} className="my-hr-filters__sort">
          <button
            type="button"
            onClick={() => setShowSortDropdown((v) => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '11px',
              border: `1px solid ${
                showSortDropdown
                  ? FUND_THEME.accent
                  : 'var(--border-color)'
              }`,
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
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
            <motion.span
              animate={{ rotate: showSortDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'inline-flex', opacity: 0.6 }}
            >
              <FaChevronDown size={10} />
            </motion.span>
          </button>

          <AnimatePresence>
            {showSortDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
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
                        setShowSortDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: active
                          ? `${FUND_THEME.accent}12`
                          : 'transparent',
                        color: active
                          ? FUND_THEME.accent
                          : 'var(--text-secondary)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.82rem',
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'right',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: active
                            ? FUND_THEME.accent
                            : 'transparent',
                          border: active
                            ? 'none'
                            : '1px solid var(--border-color)',
                          flexShrink: 0,
                        }}
                      />
                      {opt.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Result count + Clear */}
        <div className="my-hr-filters__actions">
          {typeof resultsCount === 'number' && (
            <span className="my-hr-filters__count">
              {resultsCount} نتيجة
            </span>
          )}

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={onClear}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
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
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ============================================ */}
      {/* Row 2: FULL-WIDTH tabs */}
      {/* ============================================ */}
      <div className="my-hr-tabs-full" role="tablist">
        <div className="my-hr-tabs-full__scroll">
          {STATUS_TABS.map((tab) => {
            const active = tab.value === status;
            const Icon = tab.Icon;
            return (
              <motion.button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onStatusChange(tab.value)}
                whileTap={{ scale: 0.97 }}
                className="my-hr-tab-full"
                style={{
                  position: 'relative',
                  padding: '10px 12px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: active ? `${tab.color}14` : 'transparent',
                  color: active ? tab.color : 'var(--text-muted)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: active ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: active ? `0 2px 8px ${tab.color}22` : 'none',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  flex: '1 1 0',
                  minWidth: 0,
                }}
              >
                <Icon size={11} />
                <span className="my-hr-tab-full__label">{tab.label}</span>
                {active && (
                  <motion.div
                    layoutId="help-request-tab-active"
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '20%',
                      right: '20%',
                      height: '3px',
                      borderRadius: '3px',
                      backgroundColor: tab.color,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* Scoped styles */}
      {/* ============================================ */}
      <style>{`
        /* ---------- Row 1 layout ---------- */
        .my-hr-filters__row1 {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
          align-items: center;
        }

        .my-hr-filters__search {
          position: relative;
          flex: 1 1 240px;
          min-width: 0;
        }

        .my-hr-filters__sort {
          position: relative;
          flex: 0 1 auto;
          min-width: 160px;
        }

        .my-hr-filters__actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 0 1 auto;
          flex-wrap: wrap;
        }

        .my-hr-filters__count {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        /* ---------- Row 2: full-width tabs ---------- */
        .my-hr-tabs-full {
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 4px;
          overflow: hidden;
        }

        .my-hr-tabs-full__scroll {
          display: flex;
          gap: 4px;
          width: 100%;
          align-items: stretch;
        }

        /* ---------- TAB: default (desktop) ---------- */
        .my-hr-tab-full {
          flex: 1 1 0;
          min-width: 0;
        }

        .my-hr-tab-full__label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ---------- Mobile: horizontal scroll-snap ---------- */
        @media (max-width: 640px) {
          .my-hr-tabs-full {
            padding: 4px;
            overflow: visible;
          }

          .my-hr-tabs-full__scroll {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding-bottom: 2px;
          }

          .my-hr-tabs-full__scroll::-webkit-scrollbar {
            display: none;
          }

          .my-hr-tab-full {
            flex: 0 0 auto;
            scroll-snap-align: start;
            min-width: 110px;
            padding: 10px 16px;
            font-size: 0.76rem;
          }
        }

        /* ---------- Very narrow: hide labels, show icons only ---------- */
        @media (max-width: 380px) {
          .my-hr-tab-full {
            min-width: 60px;
            padding: 10px 12px;
          }
          .my-hr-tab-full__label {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default MyHelpRequestFilters;